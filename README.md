# JUNCTION-2025 – AI‑Powered Financial Coach

AI‑assisted money coach built for Junction: a React dashboard frontend, Node.js backend, and a MockBank service that simulates banking data and persists AI chat responses.

---

## Project Structure

- `frontend/` – Vite + React + TypeScript app (dashboard, chat UI, insights, games).
- `backend/` – Node.js/Express API that talks to Featherless AI and MockBank, plus a WebSocket bridge for live chat.
- `mockbank/` – Mock banking API + PostgreSQL + Prisma schema (transactions, AI responses, sample insights).
- `start.py` – Helper script to boot backend and frontend together (and integrate with MockBank if Docker is running).

---

## Prerequisites

- Node.js 20+, npm and cors
- Python 3 (for `start.py`, optional)
- Docker (for Postgres + MockBank data)
- Featherless AI API key
- Gemini AI API key

---

## Quick Start (Local Dev)

### 1. Start Postgres for MockBank

```bash
docker run --name mockbank-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=mockbank \
  -p 5432:5432 \
  -d postgres:16
```

### 2. MockBank service

From `mockbank/`:

```bash
npm install
npx prisma migrate dev
npm run seed
```

Then start MockBank (check the scripts in `mockbank/package.json`, usually something like):

```bash
npm run dev
```

### 3. Backend API

From `backend/`:

1. Create `backend/.env`:

   ```bash
   API_KEY=...                # Featherless key
   GEMINI_API_KEY=...         #Gemini key
   ```

2. Install and run:

   ```bash
   npm install
   node server.js
   ```

### 4. Frontend app

From `frontend/`:

1. Create `frontend/.env`:

   ```bash
   VITE_API_URL=http://localhost:3000
   VITE_WS_URL=ws://localhost:3000/
   VITE_MOCKBANK_USER_ID=demo1
   ```

2. Install and run:

   ```bash
   npm install
   npm run dev
   ```

The frontend will typically run on `http://localhost:5173`.

---

## One‑Command Dev Helper

You can use the Python helper script from the repo root to start:

```bash
python3 start.py
```

---

## Features

### Backend

- Accepts chat messages from the frontend and forwards them to Featherless AI.
- Streams AI responses back to the UI via WebSockets.
- Persists AI responses in the MockBank database (`AiResponse` Prisma model).
- Can target different models via env (`CHAT_MODEL`) – see the Featherless model list: https://featherless.ai/models
- System prompt is tuned for speaking to a younger audience; adjust in the backend (around the model config) if you want a different tone.

### Frontend

- **Home / Dashboard**
  - Month summary and quick stats.
  - Last 30 days cash‑flow visualization.
- **Spending & Transactions**
  - Spending by category donut, budget progress, and transaction feed.
  - Shared timeframe toolbar (day/week/month/custom/date‑range) for charts, insights and tables.
- **AI Insights**
  - Sends a scoped subset of transactions to the backend to generate tips, warnings, opportunities, achievements.
  - “Deep dive” button jumps to chat with a pre‑filled prompt.
- **Coach Chat**
  - Real‑time conversation with the AI coach via WebSocket.
  - Messages are stored in MockBank so you can query the history from the backend.

> Note: Some dashboard widgets still use hard‑coded data and are intended to be wired up to MockBank/DB data later.

### MockBank

- PostgreSQL + Prisma service that simulates a banking API.
- Stores users, transactions and AI responses.
- Includes seed data for demo transactions and sample insights.

---

## Useful Backend Endpoints

With MockBank running on `http://localhost:3001`:

Health & users:

```bash
curl http://localhost:3001/health
curl http://localhost:3001/users
```

Transactions for the demo user:

```bash
curl http://localhost:3001/users/demo1/transactions
```

AI response log (powered by the new Prisma model):

```bash
curl http://localhost:3001/users/demo1/ai-responses

curl -X POST http://localhost:3001/users/demo1/ai-responses \
  -H "Content-Type: application/json" \
  -d '{
    "prompt":   "What should I do about groceries?",
    "response": "Cut impulse snacks by 20%.",
    "model":    "meta-llama",
    "metadata": { "tags": ["groceries"] }
  }'
```

Live chat replies from the frontend are stored automatically through the backend WebSocket bridge, so `/users/:id/ai-responses` will grow as you talk to the coach.

---

## Environment Summary

Backend – `backend/.env`:

```bash
API_KEY=...                # Featherless key
MOCKBANK_API_BASE=http://localhost:3001
MOCKBANK_USER_ID=demo1
CHAT_MODEL=meta-llama/Meta-Llama-3.1-8B-Instruct
```

MockBank – `mockbank/.env` (add‑on):

```bash
ALLOWED_ORIGINS=http://localhost:5173
```

Frontend – `frontend/.env`:

```bash
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000/
VITE_MOCKBANK_USER_ID=demo1
```

Adjust hosts, ports and user IDs to match your deployment or test setup, but should probably run without any changes, granted requirements are there.
