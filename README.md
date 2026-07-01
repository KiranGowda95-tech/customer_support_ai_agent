# Customer Support AI Agent

Customer Support AI Agent is a production-ready support copilot for banking and customer-service teams. It combines ticket management, retrieval-augmented generation (RAG), long-term customer memory, guardrails, and LangChain tool calling to create safer draft responses.

## What This App Does

- Manages customer support tickets with SQLite-backed persistence.
- Generates AI reply drafts using Groq, RAG search, Mem0 customer memory, and support tools.
- Applies deterministic guardrails for PII redaction, toxicity, forbidden promises, and topic scope.
- Provides a Streamlit dashboard for ticket creation, draft review, memory probing, and knowledge ingestion.
- Includes an eval suite that validates response quality, compliance, and tool usage.

## Architecture

- `main.py` starts FastAPI.
- `app.py` runs the Streamlit dashboard.
- `customer_support_agent/api/` contains routers, dependency injection, and app setup.
- `customer_support_agent/services/` contains the copilot, draft workflow, guardrails, and knowledge services.
- `customer_support_agent/integration/` contains Mem0 memory, ChromaKB RAG, and support tools.
- `customer_support_agent/repositories/sqlite/` persists customers, tickets, and drafts.
- `evals/` contains the full evaluation harness and report generation.

## Core Production Flow

1. Start the API and dashboard.
2. Create or ingest tickets.
3. Generate a draft from the copilot.
4. The copilot applies input guardrails before model invocation.
5. It retrieves customer memory and knowledge snippets.
6. It calls support tools when the ticket asks about plan/SLA or ticket load.
7. It applies output guardrails and, if needed, a deterministic fallback or escalation message.
8. Accepted drafts are persisted and stored in Mem0 for future cases.

## Guardrails Design

The guardrails service is implemented in `customer_support_agent/services/guardrails_service.py` and includes:

- **Input validation**: prevents unsafe drafts before the LLM is called.
- **PII detection and redaction**: regex-based detection for account numbers, card numbers, email addresses, and phone numbers.
- **Toxicity filtering**: blocks hostile words and abusive language.
- **Forbidden promise detection**: prevents statements like `guaranteed return`, `free money`, or `100% safe`.
- **Scope classification**: deterministic keyword checks plus an optional Groq classifier fallback.
- **Output enforcement**: sanitizes responses and triggers escalation if an unsafe draft is produced.

Guardrails are enabled by default and can be disabled with `GUARDRAILS_ENABLED=false`.

## Evaluation & Quality Assurance

The evaluation suite is in `evals/test_full_eval.py` and is designed to validate the system end to end.

### What it checks

- `ragas` metrics:
  - `faithfulness`
  - `answer_relevancy`
  - `context_precision`
- deterministic DeepEval assertions:
  - `expected_tools` were called
  - `no_pii_leak`
  - `no_forbidden_promises`
  - `length_bound`

### Eval reporting

- Raw results are written to `evals/reports/full_eval_results.json`.
- `evals/run_eval_report.py` builds latest summary files at `evals/reports/latest.json` and `evals/reports/latest.md`.
- The suite logs environment and model details, opens an isolated runtime, ingests knowledge, generates drafts, and scores them end to end.

### Runtime eval settings

- `GROQ_API_KEY` — required for live evaluation
- `EVAL_GROQ_MODEL` — evaluation model for report scoring
- `EVAL_RUNTIME_GROQ_MODEL` — runtime model used during draft generation
- `FULL_EVAL_CASE_DELAY_SECONDS` — delay between cases in live eval
- `EVAL_LIVE_LOGS` — enable or disable live eval logging

## Prerequisites

- Python 3.11
- [uv](https://docs.astral.sh/uv/) for dependency management
- `GROQ_API_KEY` for Groq model access
- `GOOGLE_API_KEY` for Gemini embeddings (recommended)
- `OPENAI_API_KEY` optional fallback for Mem0 embeddings

## Setup

```bash
git clone <repository-url>
cd customer_support_ai_agent
uv sync
```

Create `.env`:

```env
GROQ_API_KEY=your_groq_api_key
GOOGLE_API_KEY=your_google_api_key
OPENAI_API_KEY=your_openai_api_key
```

### Important env vars

| Variable                 | Default                 | Description                      |
| ------------------------ | ----------------------- | -------------------------------- |
| `GROQ_MODEL`             | `llama-3.1-8b-instant`  | Groq chat model                  |
| `LLM_TEMPERATURE`        | `0.2`                   | Model temperature                |
| `GOOGLE_EMBEDDING_MODEL` | `gemini-embedding-001`  | Gemini embedding model           |
| `GROQ_API_KEY`           | —                       | Required for Groq model calls    |
| `GOOGLE_API_KEY`         | —                       | Recommended for embeddings       |
| `OPENAI_API_KEY`         | —                       | Optional fallback embedder       |
| `API_HOST`               | `0.0.0.0`               | FastAPI host                     |
| `API_PORT`               | `8000`                  | FastAPI port                     |
| `API_BASE_URL`           | `http://localhost:8000` | Streamlit dashboard API base URL |
| `GUARDRAILS_ENABLED`     | `true`                  | Enable guardrails                |
| `TRACER_ENABLED`         | `true`                  | Enable request tracing           |

On first startup, the app creates runtime storage under `data/` and `data/traces/`.

## Running Locally

Start the API:

```bash
uv run python main.py
```

Start the Streamlit dashboard:

```bash
uv run streamlit run app.py
```

## API Endpoints

| Method  | Path                                | Description                 |
| ------- | ----------------------------------- | --------------------------- |
| `GET`   | `/health`                           | Health check                |
| `GET`   | `/`                                 | Service status message      |
| `POST`  | `/api/tickets`                      | Create a ticket             |
| `GET`   | `/api/tickets`                      | List tickets                |
| `GET`   | `/api/tickets/{id}`                 | Get ticket details          |
| `POST`  | `/api/tickets/{id}/generate-draft`  | Generate a draft            |
| `GET`   | `/api/drafts/{ticket_id}`           | Retrieve latest draft       |
| `PATCH` | `/api/drafts/{draft_id}`            | Update draft content/status |
| `POST`  | `/api/knowledge/ingest`             | Ingest knowledge documents  |
| `GET`   | `/api/customers/{id}/memories`      | List customer memories      |
| `GET`   | `/api/customers/{id}/memory-search` | Search customer memory      |

Interactive docs: http://localhost:8000/docs

### Example ticket creation

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

## Production Notes

- The app is built for local and staging deployment with simple runtime configuration.
- The `customer_support_agent/api/dependencies.py` layer injects the `SupportCopilot`, `GuardrailsService`, tracer, and repository services.
- The copilot uses `create_tool_calling_agent` and `AgentExecutor` to decide whether to call tools or use direct LLM generation.
- If tool calls fail or return empty content, the service falls back to a deterministic draft synthesis path.
- Accepted drafts are persisted and stored in Mem0 using both customer and company scope IDs.
- Trace data is stored under `data/traces/` and can be enabled/disabled via `TRACER_ENABLED`.

## Project Structure

```
customer_support_ai_agent/
├── main.py
├── app.py
├── knowledge_base/
├── customer_support_agent/
│   ├── api/
│   ├── core/
│   ├── integration/
│   ├── observability/
│   ├── repositories/
│   ├── schemas/
│   └── services/
├── evals/
│   ├── dataset/
│   ├── reports/
│   ├── _test_support.py
│   ├── run_eval_report.py
│   └── test_full_eval.py
├── tests/
└── data/
```

## Development

Run tests:

```bash
uv run pytest
```

Run the full eval suite:

```bash
uv run pytest -m full_eval
```

Generate the latest eval report:

```bash
python evals/run_eval_report.py
```

## Tech Stack

- FastAPI — REST API backend
- Streamlit — dashboard UI
- LangChain + Groq — LLM and agent orchestration
- ChromaDB — semantic vector store for RAG
- Mem0 — long-term customer memory
- SQLite — ticket/customer persistence
- Guardrails — safety and compliance enforcement

## License

See [LICENSE](LICENSE).
