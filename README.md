# LegalAI PK

Next.js frontend and FastAPI backend for LegalAI PK. Auth screens follow the provided signup/login mockups.

## Stack

- Frontend: Next.js (App Router) + Tailwind CSS
- Backend: FastAPI + SQLite + JWT

## Run locally

Terminal 1 — API:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Terminal 2 — UI:

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000 (redirects to login).

## RAG corpus

1. **Primary** — [Zenodo Structured Pakistani Law Dataset](https://zenodo.org/records/20509007)  
   Schema: `Book | Chapter Number | Chapter Title | Section | Heading | Definition`  
   Ingest: `POST http://localhost:8000/api/rag/ingest/primary`

2. **Expansion** — [AyeshaJadoon Pakistan Laws Dataset](https://huggingface.co/datasets/AyeshaJadoon/Pakistan_Laws_Dataset)  
   Queue after primary RAG works: `POST http://localhost:8000/api/rag/ingest/expansion`

Source status: `GET http://localhost:8000/api/rag/sources`
