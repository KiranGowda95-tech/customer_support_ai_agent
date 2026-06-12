from __future__ import annotations

import hashlib
import os
from pathlib import Path
from typing import Any

import chromadb
from chromadb.api.types import EmbeddingFunction, Documents, Embeddings
from google import genai  # Modern, official Google SDK
from chromadb.utils import embedding_functions
from langchain_text_splitters import RecursiveCharacterTextSplitter

from customer_support_agent.core.settings import Settings


# ==========================================
# 1. THE CUSTOM EMBEDDING WRAPPER CLASS
# ==========================================
class ModernGoogleEmbeddingFunction(EmbeddingFunction[Documents]):
    def __init__(self, api_key: str, model_name: str = "text-embedding-004"):
        self.model_name = model_name
        # Initialize the modern official client directly
        self.client = genai.Client(api_key=api_key)

    def __call__(self, input: Documents) -> Embeddings:
        try:
            response = self.client.models.embed_content(
                model=self.model_name,
                contents=input,
            )
            # Extract and return the float vectors array natively expected by ChromaDB
            return [embedding.values for embedding in response.embeddings]
        except Exception as e:
            raise RuntimeError(f"Modern Google API embedding payload failed: {str(e)}")


# ==========================================
# 2. THE MAIN KNOWLEDGE BASE SERVICE CLASS
# ==========================================
class KnowledgeBaseService:
    def __init__(self, settings: Settings):
        # Restore the original properties initialization
        self._settings = settings
        self._client = chromadb.PersistentClient(path=str(settings.chroma_rag_path))
        self._collection_name = "support_kb_gemini" if settings.google_api_key else "support_kb"
        self._embedding_function = self._build_embedding_function()
        
        self._collection = self._client.get_or_create_collection(
            name=self._collection_name,
            embedding_function=self._embedding_function,
        )
        self._splitter = RecursiveCharacterTextSplitter(
            chunk_size=settings.rag_chunk_size,
            chunk_overlap=settings.rag_chunk_overlap,
        )

    def _build_embedding_function(self) -> Any:
        if self._settings.google_api_key:
            print("Entering into the _build_embedding_function")
        
            api_key = str(self._settings.google_api_key).strip()
            
            # 🟢 FORCE FIXED: Override legacy models to the absolute modern AI Studio standard
            model_name = "models/text-embedding-004"

            try:
                print(f"Initializing official ModernGoogleEmbeddingFunction with: {model_name}")
                
                # Instantiating custom class
                ef = ModernGoogleEmbeddingFunction(
                    api_key=api_key,
                    model_name=model_name
                )
                
                # Perform a dry-run check
                ef(["network credential validation check"])
                
                print(f"🎉 CRITICAL SUCCESS: Modern Google SDK connected perfectly to {model_name}!")
                return ef
            
            except Exception as exc:
                print("🔥 MODERN GEMINI INITIALIZATION FAILED:", repr(exc))
                raise RuntimeError(
                    f"Could not connect using the modern SDK. Verify your network or API key value string. Details: {repr(exc)}"
                )

        print("No Google API key supplied. Falling back to local ONNX embeddings.")
        return embedding_functions.DefaultEmbeddingFunction()

    def ingest_directory(self, directory: Path, clear_existing: bool = False) -> dict[str, int]:
        if clear_existing:
            print(f"🔄 Attempting to clear existing collection: {self._collection_name}")
            try:
                self._client.delete_collection(name=self._collection_name)
                print(f"🗑️ Successfully deleted old collection: {self._collection_name}")
            except Exception as e:
                print(f"ℹ️ Note: Collection did not exist yet, skipping deletion. Reason: {repr(e)}")
                
            self._collection = self._client.get_or_create_collection(
                name=self._collection_name,
                embedding_function=self._embedding_function,
            )
        
        if not directory.exists():
            raise FileNotFoundError(f"❌ Local ingestion directory not found: {directory.absolute()}")

        source_files = sorted(
            [
                *directory.glob("*.md"),
                *directory.glob("*.txt"),
            ]
        )

        docs: list[str] = []
        ids: list[str] = []
        metadatas: list[dict[str, Any]] = []

        for file_path in source_files:
            text = file_path.read_text(encoding="utf-8")
            chunks = self._splitter.split_text(text)

            for index, chunk in enumerate(chunks):
                chunk_hash = hashlib.sha1(chunk.encode("utf-8")).hexdigest()[:10]
                doc_id = f"{file_path.stem}-{index}-{chunk_hash}"
                docs.append(chunk)
                ids.append(doc_id)
                metadatas.append(
                    {
                        "source": file_path.name,
                        "chunk_index": index,
                    }
                )
            
        if docs:
            # upsert prevents duplicate-id failures when re-ingesting.
            self._collection.upsert(documents=docs, ids=ids, metadatas=metadatas)

        return {
            "files_indexed": len(source_files),
            "chunks_indexed": len(docs),
            "collection_count": self._collection.count(),
        }

    def search(self, query: str, top_k: int | None = None) -> list[dict[str, Any]]:
        if self._collection.count() == 0:
            return []
        
        results = self._collection.query(
            query_texts=[query],
            n_results=top_k or self._settings.rag_top_k,
            include=["documents", "metadatas", "distances"],
        )

        documents = (results.get("documents") or [[]])[0]
        metadatas = (results.get("metadatas") or [[]])[0]
        distances = (results.get("distances") or [[]])[0]

        combined: list[dict[str, Any]] = []
        for i, document in enumerate(documents):
            metadata = metadatas[i] if i < len(metadatas) else {}
            distance = distances[i] if i < len(distances) else None
            combined.append(
                {
                    "content": document,
                    "source": metadata.get("source", "unknown"),
                    "distance": distance,
                }
            )

        return combined
