# Customer Support AI Agent

An AI-powered support copilot that helps customer-service teams manage tickets and prepare safer, context-aware reply drafts. The application combines a FastAPI backend, a Streamlit dashboard, an LLM-powered agent, retrieval-augmented generation (RAG), customer memory, support tools, and response guardrails.

> **Important:** This application generates draft replies for human review. Review the generated content before sending it to a customer. Configure API keys securely and do not commit secrets or real customer data to source control.

## Contents

- [Overview](#overview)
- [Features](#features)
- [How It Works](#how-it-works)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Run the Application](#run-the-application)
- [Using the Dashboard](#using-the-dashboard)
- [API Reference](#api-reference)
- [Knowledge Base and RAG](#knowledge-base-and-rag)
- [Guardrails and Privacy](#guardrails-and-privacy)
- [Testing and Evaluation](#testing-and-evaluation)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)
- [Security Notes](#security-notes)
- [License](#license)

## Overview

Customer Support AI Agent is designed to assist support teams with common customer-service workflows. It stores support tickets, retrieves relevant knowledge-base content and customer memories, and uses an LLM agent to prepare a response draft. Guardrails check inputs and outputs for potentially unsafe or inappropriate content.

The project currently includes banking-oriented knowledge-base examples, such as ATM cash withdrawals, account charges, minimum balances, KYC, and savings-account rules.

## Features

- **Ticket management:** Create, list, and retrieve support tickets with SQLite persistence.
- **AI reply drafting:** Generate a draft for a ticket using the configured Groq chat model.
- **Retrieval-augmented generation (RAG):** Search the knowledge base for relevant information using ChromaDB.
- **Customer memory:** Retrieve and search relevant customer context using Mem0.
- **Tool calling:** Let the agent call support tools when additional ticket or support information is needed.
- **Guardrails:** Validate inputs, redact detected personally identifiable information (PII), filter abusive language, check for forbidden promises, and enforce topic scope.
- **Draft review workflow:** Retrieve, edit, and update the status of generated drafts.
- **Knowledge ingestion:** Load knowledge-base documents into the retrieval system.
- **Observability:** Capture request traces for debugging and inspection.
- **Evaluation suite:** Assess response faithfulness, relevance, context precision, tool use, and selected safety requirements.
- **Streamlit dashboard:** Use a web interface to work with tickets, drafts, knowledge ingestion, and customer memory.

## How It Works

1. Start the FastAPI backend and Streamlit dashboard.
2. Create a support ticket or select an existing ticket.
3. Request a draft response for the ticket.
4. Input guardrails check the request before model generation.
5. The copilot retrieves relevant knowledge-base passages and customer memories.
6. The agent can call available support tools when appropriate.
7. Output guardrails inspect the generated response. Depending on the result, the system can sanitize the draft or produce a fallback/escalation response.
8. The draft is stored for review. Accepted draft content can also be saved to customer memory for future context.
9. A support agent reviews and edits the draft before using it.

## Architecture

| Component | Responsibility |
|---|---|
| `main.py` | Creates and starts the FastAPI application. |
| `app.py` | Runs the Streamlit support dashboard. |
| `customer_support_agent/api/` | FastAPI app factory, dependencies, and route handlers. |
| `customer_support_agent/core/settings.py` | Environment-based settings, storage paths, and directory setup. |
| `customer_support_agent/services/` | Copilot orchestration, draft workflow, knowledge operations, and guardrails. |
| `customer_support_agent/integration/rag/` | ChromaDB-backed knowledge retrieval. |
| `customer_support_agent/integration/memory/` | Mem0 customer-memory integration. |
| `customer_support_agent/integration/tools/` | Tools available to the support agent. |
| `customer_support_agent/repositories/sqlite/` | SQLite persistence for customers, tickets, and drafts. |
| `customer_support_agent/schemas/` | API request/response schemas. |
| `customer_support_agent/observability/` | Request tracing and observability utilities. |
| `knowledge_base/` | Source Markdown documents used for retrieval. |
| `tests/` | General application tests. |
| `evals/` | Evaluation dataset, end-to-end evaluation tests, and report generation. |
| `data/` | Local runtime database, vector-store data, and traces. |

## Technology Stack

- **Python 3.11**
- **FastAPI** and **Uvicorn** — REST API
- **Streamlit** — support-agent dashboard
- **LangChain** — LLM and tool-calling orchestration
- **Groq** — chat-model provider
- **ChromaDB** — vector storage and semantic retrieval
- **Mem0** — customer memory
- **SQLite** — relational persistence
- **Google Gemini embeddings** — recommended embedding provider
- **Ragas** and **DeepEval** — evaluation tooling
- **uv** — Python dependency and environment management

## Requirements

- Python `>=3.11,<3.12`
- [`uv`](https://docs.astral.sh/uv/)
- A Groq API key for model generation
- A Google API key for the configured Gemini embedding integration
- An OpenAI API key only if needed by your Mem0 embedding configuration or fallback setup

Provider requirements can vary depending on the integrations and settings you enable.

## Installation

### 1. Get the project

If you have cloned the repository:

```bash
git clone <repository-url>
cd customer_support_ai_agent
```

Replace `<repository-url>` with the URL of your repository. If you already have the source code, open a terminal in the project root—the directory containing `pyproject.toml` and `main.py`.

### 2. Install dependencies

```bash
uv sync
```

This installs the project dependencies using `pyproject.toml` and `uv.lock`.

### 3. Create the environment file

Create a file named `.env` in the project root:

```env
GROQ_API_KEY=your_groq_api_key
GOOGLE_API_KEY=your_google_api_key
OPENAI_API_KEY=
```

Replace the placeholder with your own key. Keep `.env` private and out of Git.

## Configuration

The application reads settings from environment variables and the `.env` file. The following are the main settings defined by the project.

| Variable | Default | Purpose |
|---|---|---|
| `GROQ_API_KEY` | Empty | API key for Groq model access. |
| `GROQ_MODEL` | `llama-3.1-8b-instant` | Chat model used for drafting. |
| `LLM_TEMPERATURE` | `0.2` | Controls response-generation randomness. |
| `GOOGLE_API_KEY` | Empty | API key for Google embedding access. |
| `GOOGLE_EMBEDDING_MODEL` | `gemini-embedding-001` | Configured embedding model identifier. |
| `OPENAI_API_KEY` | Empty | Optional key for an OpenAI embedding fallback, if configured. |
| `ENABLE_LOCAL_EMBEDDINGS` | `false` | Enables the optional local-embedding setting when supported by the integration. |
| `API_HOST` | `0.0.0.0` | Host address used by the API server. |
| `API_PORT` | `8000` | Port used by the API server. |
| `API_BASE_URL` | `http://localhost:8000` | API URL used by the Streamlit dashboard. |
| `GUARDRAILS_ENABLED` | `true` | Enables/disables guardrail checks. |
| `TRACER_ENABLED` | `true` | Enables/disables request tracing. |

Additional retrieval settings are available in `customer_support_agent/core/settings.py`, including chunk size, chunk overlap, RAG top-k, and memory top-k.

> **Configuration note:** `API_BASE_URL` is used by the dashboard. The backend settings also define `DASHBOARD_API_URL`; check the relevant integration before changing either value in a deployed environment.

## Run the Application

Run the backend and dashboard in **two separate terminals**, from the project root.

### Terminal 1: Start the API

```bash
uv run python main.py
```

The API should be available at:

- API base: `http://localhost:8000`
- Interactive Swagger documentation: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/health`

### Terminal 2: Start the dashboard

```bash
uv run streamlit run app.py
```

Streamlit prints the local dashboard URL in the terminal, typically `http://localhost:8501`.

Make sure the backend is running and that `API_BASE_URL` points to the backend address reachable from the dashboard.

## Using the Dashboard

The Streamlit dashboard is intended for support-agent workflows. Depending on the available data and configuration, you can:

1. Create support tickets.
2. View the ticket list.
3. Generate a draft reply for a ticket.
4. Review the retrieved context and tool-call information associated with a draft.
5. Edit draft content and update its status.
6. Ingest knowledge-base documents.
7. Search customer memory.

Treat generated responses as suggestions, not automatically approved customer communications.

## API Reference

The API is served by FastAPI. Open `http://localhost:8000/docs` while the backend is running for the live request/response schemas.

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/` | Returns a basic service status message. |
| `GET` | `/health` | Health check. |
| `POST` | `/api/tickets` | Create a support ticket. |
| `GET` | `/api/tickets` | List support tickets. |
| `GET` | `/api/tickets/{id}` | Retrieve a ticket by ID. |
| `POST` | `/api/tickets/{id}/generate-draft` | Generate a draft reply for a ticket. |
| `GET` | `/api/drafts/{ticket_id}` | Retrieve the latest draft for a ticket. |
| `PATCH` | `/api/drafts/{draft_id}` | Update draft content and/or status. |
| `POST` | `/api/knowledge/ingest` | Ingest knowledge-base documents. |
| `GET` | `/api/customers/{id}/memories` | List memories associated with a customer. |
| `GET` | `/api/customers/{id}/memory-search` | Search customer memories. |

### Example: create a ticket

The following example illustrates the shape of a ticket-creation request. Confirm the required fields and allowed values in the interactive API documentation for the current version.

```bash
curl -X POST "http://localhost:8000/api/tickets" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_email": "alex@example.com",
    "customer_name": "Alex Rivera",
    "customer_company": "Example Company",
    "subject": "ATM withdrawal declined",
    "description": "My ATM withdrawal was declined twice.",
    "priority": "medium",
    "auto_generate": true
  }'
```

## Knowledge Base and RAG

The `knowledge_base/` directory contains Markdown source documents. The retrieval pipeline splits source content into chunks, creates embeddings, stores vectors in ChromaDB, and retrieves relevant passages to help ground generated drafts.

To ingest the knowledge base, use the dashboard's knowledge-ingestion control or call:

```http
POST /api/knowledge/ingest
Content-Type: application/json
```

The request schema supports a `clear_existing` option. Check `/docs` for the exact request body and response.

When updating source documents, ingest them again so the retrieval store reflects the latest content. Do not assume that editing a Markdown file automatically updates existing vectors.

## Guardrails and Privacy

The guardrail service is implemented in `customer_support_agent/services/guardrails_service.py`. The project describes checks that include:

- **Input validation** before model invocation.
- **PII detection and redaction** for patterns such as account/card numbers, email addresses, and phone numbers.
- **Toxicity filtering** for selected abusive or hostile language.
- **Forbidden-promise detection** for risky claims such as guaranteed returns or absolute safety assurances.
- **Scope checks** to identify requests outside the intended support domain.
- **Output enforcement** that can sanitize a draft or trigger a fallback/escalation response.

These checks are safeguards, not a guarantee that every unsafe or inaccurate response will be detected. Validate the system with representative test cases before using it with real customers.

## Testing and Evaluation

### Run the tests

```bash
uv run pytest
```

### Run the full evaluation suite

The full evaluation may make live model/API calls and incur provider usage charges. Configure the required environment variables before running it.

```bash
uv run pytest -m full_eval
```

The evaluation suite is designed to measure:

- Ragas metrics such as faithfulness, answer relevancy, and context precision.
- Expected tool usage.
- PII leakage checks.
- Forbidden-promise checks.
- Response-length constraints.

### Generate an evaluation report

```bash
uv run python evals/run_eval_report.py
```

Evaluation output paths and optional runtime controls are defined by the evaluation scripts. The full evaluation may create report files under `evals/reports/`.

Common evaluation-specific environment variables include `EVAL_GROQ_MODEL`, `EVAL_RUNTIME_GROQ_MODEL`, `FULL_EVAL_CASE_DELAY_SECONDS`, and `EVAL_LIVE_LOGS`. Review `evals/test_full_eval.py` for the exact behavior and defaults.

## Project Structure

```text
customer_support_ai_agent/
├── app.py                         # Streamlit dashboard
├── main.py                        # FastAPI entry point
├── pyproject.toml                 # Project metadata and dependencies
├── uv.lock                        # Locked dependency versions
├── knowledge_base/                # Source support documents
├── customer_support_agent/
│   ├── api/                       # FastAPI routes and app setup
│   ├── core/                      # Settings and runtime directory setup
│   ├── integration/
│   │   ├── memory/                # Mem0 integration
│   │   ├── rag/                   # ChromaDB retrieval integration
│   │   └── tools/                 # Agent tools
│   ├── observability/             # Tracing
│   ├── repositories/sqlite/       # SQLite repositories
│   ├── schemas/                   # API schemas
│   └── services/                  # Copilot, drafts, knowledge, guardrails
├── data/                          # Runtime data and local databases
├── evals/
│   ├── dataset/                   # Evaluation examples
│   ├── test_full_eval.py           # End-to-end evaluation suite
│   └── run_eval_report.py          # Report generation
└── tests/                          # Application tests
```

Runtime database and vector-store files may be created under `data/` when the application starts. Avoid committing runtime data unless it is intentionally curated and safe to share.

## Troubleshooting

### Missing or invalid API key

- Confirm that `.env` is in the project root.
- Check that the variable name is spelled correctly.
- Restart the backend after changing environment variables.
- Never paste API keys into source files or commit them.

### Dashboard cannot connect to the API

- Start the FastAPI backend first.
- Check that the backend is listening on port `8000`, or update `API_PORT`.
- Set `API_BASE_URL` to the correct reachable API address.
- If dashboard and backend run in separate containers or hosts, `localhost` may refer to different machines.

### No relevant knowledge is retrieved

- Confirm that documents exist in `knowledge_base/`.
- Run knowledge ingestion.
- Verify that the embedding provider is configured and available.
- Check application logs and the API response for ingestion errors.

### Vector-store or database problems

- Stop the application before manually moving or deleting local database/vector-store files.
- Back up `data/` before making changes.
- Re-ingestion or rebuilding a vector store may be necessary after changing embedding models or storage configuration.

### Model or evaluation failures

- Confirm provider credentials, quota, network access, and model availability.
- Run ordinary tests first to separate local logic issues from live-provider issues.
- Remember that full evaluation can use paid API calls.

## Security Notes

- Keep `.env`, API keys, database files containing customer information, traces, and generated reports with sensitive content out of public repositories.
- Use synthetic customer data during development and evaluation whenever possible.
- Restrict access to the API and dashboard when deploying outside a trusted local environment.
- Use HTTPS and appropriate authentication/authorization before exposing the application publicly. Do not treat an open development API as production-secure.
- Review generated drafts and retrieved source content before sending customer-facing messages.
- Back up persistent data and define retention/access policies before using real customer records.

## License

See the [`LICENSE`](LICENSE) file for license terms.
