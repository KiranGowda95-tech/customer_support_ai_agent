from __future__ import annotations

import os
import sys
from pathlib import Path


from fastapi.testclient import TestClient

sys.path.insert(0,str(Path(__file__).resolve().parents[1]))

from customer_support_agent.core.settings import Settings
from customer_support_agent.integration.rag.chroma_kb import KnowledgeBaseService

def run_standalone_isolation_test():
    print("starting isolation test for knowledgebaseservice...")
# 1. Manually initialize your settings
    settings = Settings(
        chroma_rag_dir=Path("./test_chroma_db"),
        google_api_key=os.getenv("GOOGLE_API_KEY","")
    )

    try:
        # This will trigger _build_embedding_function automatically
        kb_service = KnowledgeBaseService(settings=settings)
        
        # Test a dummy query search action
        print("🔍 Testing query routing matrix...")
        results = kb_service.search(query="ATM withdrawal limit transaction help", top_k=1)
        print(f"✅ SYSTEM STACK CHECK COMPLETE! Search executed cleanly. Current total items: {len(results)}")

    except Exception as e:
        print(f"❌ ISOLATION TEST FAILED: {str(e)}")


if __name__=="__main__":
    run_standalone_isolation_test()