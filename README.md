# pos-python-skeleton

Dockerized **FastAPI + React (Vite + TypeScript) + PostgreSQL** skeleton for a mini POS web app.

## Services
- **backend**: FastAPI at http://localhost:8000 (docs at `/docs`)
- **frontend**: React (Vite) at http://localhost:5173
- **db**: PostgreSQL at localhost:5432
- **pgadmin** (optional): http://localhost:5050

## Quick Start (Docker)
```bash
# 1) Copy env files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 2) Build & run
docker compose up -d --build

# 3) Create DB tables (Alembic)
docker compose exec backend alembic upgrade head

# 4) Open docs
# http://localhost:8000/docs
# Open frontend
# http://localhost:5173
```

## Local Dev without Docker (optional)
- Python 3.12+, Node 20+
- Backend:
```bash
cd backend
python -m venv .venv && . .venv/Scripts/activate  # on Windows
pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```
- Frontend:
```bash
cd frontend
npm i
npm run dev
```

