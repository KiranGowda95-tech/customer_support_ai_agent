# Customer Support AI Agent

An AI copilot for customer support agents. It combines ticket management, retrieval-augmented generation (RAG), long-term customer memory, and LangChain tool calling to draft empathetic, actionable replies that agents can review before sending.

## Features

- **Ticket workflow** — Create, list, and resolve support tickets backed by SQLite.
- **AI draft generation** — Groq-powered LangChain agent writes draft replies using ticket context, prior customer memory, and knowledge-base snippets.
- **RAG knowledge base** — Ingest Markdown/TXT files from `knowledge_base/` into ChromaDB for semantic search.
- **Customer memory (Mem0)** — Stores accepted resolutions per customer (and optionally per company) for future retrieval.
- **Support tools** — The agent can call tools to look up subscription plans and open-ticket load before drafting.
- **Streamlit dashboard** — Web UI to create tickets, generate drafts, inspect context, accept/discard replies, and probe customer memory.

## Architecture

```
┌─────────────────┐     HTTP      ┌──────────────────────────────────────┐
│  app.py         │ ────────────► │  FastAPI (main.py)                   │
│  Streamlit UI   │               │  ├── Tickets / Drafts / Knowledge    │
└─────────────────┘               │  └── Memory routes                   │
                                  └──────────┬───────────────────────────┘
                                             │
                    ┌────────────────────────┼────────────────────────┐
                    ▼                        ▼                        ▼
              SQLite (tickets)          ChromaDB RAG              Mem0 + ChromaDB
              customers, drafts         knowledge base            customer memory
                    │                        │                        │
                    └────────────────────────┴────────────────────────┘
                                             │
                                             ▼
                                    Groq LLM (LangChain agent)
```

## Prerequisites

- **Python 3.11** (see `.python-version`)
- **[uv](https://docs.astral.sh/uv/)** for dependency management
- **Groq API key** (required for draft generation)
- **Google API key** (recommended for Gemini embeddings; falls back to Chroma default embeddings if unavailable)
- **OpenAI API key** (optional; used by Mem0 embedder when Google key is not set)

## Quick Start

### 1. Clone and install

```bash
git clone <repository-url>
cd customer_support_ai_agent
uv sync
```

### 2. Configure environment

Create a `.env` file in the project root:

```env
GROQ_API_KEY=your_groq_api_key
GOOGLE_API_KEY=your_google_api_key
```

Optional settings (defaults shown):

| Variable | Default | Description |
|----------|---------|-------------|
| `GROQ_MODEL` | `llama-3.1-8b-instant` | Groq chat model |
| `LLM_TEMPERATURE` | `0.2` | LLM sampling temperature |
| `GOOGLE_EMBEDDING_MODEL` | `gemini-embedding-001` | Embedding model for RAG and Mem0 |
| `OPENAI_API_KEY` | — | Fallback Mem0 embedder when Google key is absent |
| `API_HOST` | `0.0.0.0` | FastAPI bind host |
| `API_PORT` | `8000` | FastAPI bind port |
| `API_BASE_URL` | `http://localhost:8000` | Used by the Streamlit dashboard |

On first run, the app creates local data directories under `data/` (SQLite DB, Chroma collections). These are gitignored.

### 3. Start the API

```bash
uv run python main.py
```

Verify: [http://localhost:8000/health](http://localhost:8000/health) should return `{"status":"ok"}`.

### 4. Start the dashboard

In a second terminal:

```bash
uv run streamlit run app.py
```

Open the URL Streamlit prints (typically [http://localhost:8501](http://localhost:8501)).

### 5. Index the knowledge base

In the dashboard sidebar, click **Ingest Knowledge Base**, or call the API:

```bash
curl -X POST http://localhost:8000/api/knowledge/ingest \
  -H "Content-Type: application/json" \
  -d '{"clear_existing": true}'
```

Sample banking FAQ documents live in `knowledge_base/`. Add your own `.md` or `.txt` files there before ingesting.

## Usage

1. **Create a ticket** in the dashboard (or via `POST /api/tickets`). Enable **Auto-generate draft** to queue background draft generation.
2. **Generate or review a draft** — Select a ticket, click **Generate Draft**, edit the reply, then **Accept** or **Discard**.
3. **Inspect context** — Expand **Context used** to see memory hits, knowledge-base matches, and tool-call traces.
4. **Probe memory** — Use **Memory Probe** to search stored resolutions for the selected customer.

Accepting a draft marks the ticket resolved and saves the resolution to Mem0 for future tickets.

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/` | Service status message |
| `POST` | `/api/tickets` | Create ticket (optional `auto_generate`) |
| `GET` | `/api/tickets` | List all tickets |
| `GET` | `/api/tickets/{id}` | Get ticket by ID |
| `POST` | `/api/tickets/{id}/generate-draft` | Generate AI draft for ticket |
| `GET` | `/api/drafts/{ticket_id}` | Get latest draft for ticket |
| `PATCH` | `/api/drafts/{draft_id}` | Update draft content/status (`pending`, `accepted`, `discarded`) |
| `POST` | `/api/knowledge/ingest` | Ingest `knowledge_base/` into ChromaDB |
| `GET` | `/api/customers/{id}/memories` | List customer memories |
| `GET` | `/api/customers/{id}/memory-search?query=...` | Semantic memory search |

Interactive docs: [http://localhost:8000/docs](http://localhost:8000/docs)

### Example: create a ticket

```bash
curl -X POST http://localhost:8000/api/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "customer_email": "alex@acme.io",
    "customer_name": "Alex Rivera",
    "customer_company": "Acme Labs",
    "subject": "ATM withdrawal declined",
    "description": "Customer tried to withdraw cash at an ATM but the transaction was declined twice.",
    "priority": "medium",
    "auto_generate": true
  }'
```

## Project Structure

```
customer_support_ai_agent/
├── main.py                 # FastAPI entry point
├── app.py                  # Streamlit dashboard
├── knowledge_base/         # RAG source documents (.md, .txt)
├── customer_support_agent/
│   ├── api/                # FastAPI app, routers, dependencies
│   ├── core/               # Settings and path resolution
│   ├── integration/
│   │   ├── memory/         # Mem0 customer memory store
│   │   ├── rag/            # ChromaDB knowledge-base service
│   │   └── tools/          # LangChain support tools
│   ├── repositories/sqlite/# Ticket, customer, draft persistence
│   ├── schemas/            # Pydantic request/response models
│   └── services/           # Copilot, draft, and knowledge services
├── tests/
└── data/                   # Created at runtime (gitignored)
```

## Agent Tools

The copilot can invoke these LangChain tools during draft generation:

| Tool | Purpose |
|------|---------|
| `lookup_customer_plan` | Returns subscription tier and SLA details for a customer email |
| `lookup_open_ticket_load` | Returns how many open tickets the customer has |

## Development

Run tests:

```bash
uv run pytest
```

Experimentation notebook: `notebooks/experiments.ipynb`

## Tech Stack

- [FastAPI](https://fastapi.tiangolo.com/) — REST API
- [LangChain](https://python.langchain.com/) + [Groq](https://groq.com/) — Agent and LLM
- [ChromaDB](https://www.trychroma.com/) — Vector store for RAG
- [Mem0](https://mem0.ai/) — Long-term customer memory
- [Streamlit](https://streamlit.io/) — Agent dashboard
- [SQLite](https://www.sqlite.org/) — Local ticket/customer storage

## License

See [LICENSE](LICENSE).
