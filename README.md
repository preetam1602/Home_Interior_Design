# 🏠 Home Interior Design

A full-stack home interior design website with an **AI Interior Designer**: visitors describe a room, style or budget and get recommendations from the studio's own catalog, optionally presented by a live video avatar.

![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)
![Node](https://img.shields.io/badge/Node.js-18+-green.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688.svg)
![React](https://img.shields.io/badge/React_19-TypeScript-61DAFB.svg)
![License](https://img.shields.io/badge/License-Add--Yours-lightgrey.svg)

---

## 📖 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Requirements](#requirements)
- [Quick Start](#quick-start)
- [First-Time Setup](#first-time-setup)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment & Configuration](#environment--configuration)
- [AI Interior Designer](#ai-interior-designer)
- [Product Catalog](#product-catalog)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Running Tests](#running-tests)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Overview

Visitors can:

- Browse **Colors & Materials** (paint swatches, surfaces) and **Furniture & Decor** organised by room.
- Save designs to a moodboard (the heart icon) and attach them to a **consultation booking**.
- Leave feedback.
- Ask the **AI Interior Designer** about a room, style, budget or a specific product, and get matching products from the catalog that they can save straight away.
- Optionally start a **video consultant** (HeyGen LiveAvatar) that speaks the answers.

Studio staff log in to the **Admin Portal** to manage consultation requests.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Python, FastAPI, SQLAlchemy 2, Pydantic 2, JWT auth |
| Database | PostgreSQL |
| Frontend | React 19, TypeScript, Vite 6, Tailwind CSS 4, Motion, Lucide icons |
| AI (recommendations) | Any OpenAI-compatible chat API — defaults to Groq (`openai/gpt-oss-120b`) |
| AI (video avatar) | HeyGen LiveAvatar (`@heygen/liveavatar-web-sdk`) |
| Package managers | pip (backend), npm (frontend) |

## Requirements

- **Python** 3.10 or higher
- **Node.js** 18 or higher (required by Vite 6)
- **PostgreSQL** database
- A **Groq API key** (or another OpenAI-compatible LLM key) for the AI Interior Designer
- (Optional) A **LiveAvatar API key** for the video consultant — from [app.liveavatar.com/developers](https://app.liveavatar.com/developers). A HeyGen account key does *not* work here.

---

## Quick Start

Already set up? Run the backend and frontend in **two terminals**, from the project root (`Home_interior/`).

**Terminal 1 — Backend API** → http://localhost:8000

```powershell
backend\.venv\Scripts\python.exe -m uvicorn backend.main:app --port 8000
```

**Terminal 2 — Frontend** → http://localhost:5173

```powershell
cd Frontend
npm run dev
```

Open **http://localhost:5173** and click **Ask AI Interior Designer** (bottom-right).

> ⚠️ Run the backend from the project root, not from inside `backend/` — the code imports itself as the `backend` package.
>
> 💡 After changing backend code or `backend/.env`, stop the API (`Ctrl+C`) and start it again. `--reload` does not reliably detect file changes inside OneDrive folders.

---

## First-Time Setup

### Backend Setup

1. **Create a virtual environment inside `backend/`**

   **Windows (PowerShell):**
   ```powershell
   python -m venv backend\.venv
   ```

   **macOS / Linux:**
   ```bash
   python3 -m venv backend/.venv
   ```

2. **Install dependencies**

   **Windows:**
   ```powershell
   backend\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
   ```

   **macOS / Linux:**
   ```bash
   backend/.venv/bin/python -m pip install -r backend/requirements.txt
   ```

3. **Create `backend/.env`** — see [Environment & Configuration](#environment--configuration).

4. **Load the product catalog into the database**

   Tables are created automatically on first start; this fills the `products` table from `Frontend/src/catalog.json`:

   ```powershell
   backend\.venv\Scripts\python.exe -m backend.seed_products
   ```
   (macOS / Linux: `backend/.venv/bin/python -m backend.seed_products`)

5. **Run the API**

   ```powershell
   backend\.venv\Scripts\python.exe -m uvicorn backend.main:app --port 8000
   ```
   (macOS / Linux: `backend/.venv/bin/python -m uvicorn backend.main:app --port 8000`)

   Interactive API docs: http://localhost:8000/docs

### Frontend Setup

```bash
cd Frontend
npm install       # first time, or after dependency changes
npm run dev       # development server → http://localhost:5173
npm run build     # production build → Frontend/dist
npm run preview   # preview the production build
```

---

## Environment & Configuration

Secrets live in **`backend/.env`**, which is git-ignored — never commit it.

```env
# --- Required ---
DATABASE_URL=postgresql://user:password@localhost:5432/home_interior
SECRET_KEY=a-long-random-string
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# --- AI Interior Designer (text answers + product recommendations) ---
LLM_key=your_groq_api_key
# LLM_BASE_URL=https://api.groq.com/openai/v1   # any OpenAI-compatible endpoint
# LLM_MODEL=openai/gpt-oss-120b

# --- Video consultant (optional; hidden on the site when not set) ---
LIVEAVATAR_API_KEY=your_liveavatar_api_key
# LIVEAVATAR_SANDBOX=true                  # true = free test mode (demo avatar, ~1 min sessions)
# LIVEAVATAR_AVATAR_ID=your_avatar_id      # needed once sandbox is off
# LIVEAVATAR_VOICE_ID=                     # empty = the avatar's default voice
# LIVEAVATAR_MAX_SESSION_SECONDS=300
# AVATAR_SESSIONS_PER_HOUR=5            # video sessions per visitor IP; raise (e.g. 50) while testing
```

**Going live with the video avatar:** choose an avatar in LiveAvatar, then set `LIVEAVATAR_AVATAR_ID=...` and `LIVEAVATAR_SANDBOX=false`. Live sessions cost **2 credits per minute** (the free plan includes 10 credits/month ≈ 5 minutes).

**Frontend:** the AI features call `http://localhost:8000` by default. To point them elsewhere, create `Frontend/.env` with:

```env
VITE_API_URL=https://your-api.example.com
```

> Note: the booking, feedback, login and admin screens still use a hard-coded `http://localhost:8000`.

The backend allows requests from `http://localhost:5173` and `http://localhost:3000` (CORS, in `backend/main.py`).

---

## AI Interior Designer

```
Visitor question ──► POST /ai/consult ──► catalog from PostgreSQL + LLM (Groq)
                                             │
              answer text + product ids ◄────┘  (ids checked against the catalog)
                     │
                     ├─► chat panel shows the answer and product cards (with Save)
                     └─► video avatar speaks a short summary (if started)
```

- **Where:** the floating **Ask AI Interior Designer** button on every page, and **Ask AI** on each product card (the consultant then knows which product you mean).
- **Context sent with each question:** current page, the product being asked about, saved designs, and the recent conversation.
- **Guardrails:** recommends only real catalog items, quotes the prices shown on the site (furniture and decor include the 10% offer), and adds up budget totals in code rather than trusting the model.
- **Video consultant:** HeyGen LiveAvatar is used only as a presenter — it speaks the backend's answer and has no AI of its own. The visitor's microphone is never used. A session starts only when the visitor clicks **Start video**, and ends on **End video**, when the panel closes, after 2 minutes without speaking, or at the session time limit.
- **Rate limits (per visitor IP):** 20 questions per 10 minutes, and 5 video sessions per hour (set with `AVATAR_SESSIONS_PER_HOUR`). The counters reset when the API restarts.
- **Groq free tier:** about 8,000 tokens per minute, which is roughly **3 questions per minute across all visitors**. Upgrade the Groq plan for real traffic.

## Product Catalog

`Frontend/src/catalog.json` is the **single source of truth** for products. The frontend imports it directly, and the backend's `products` table is synced from it so product ids stay identical (saved designs and consultation items refer to these ids).

After editing the catalog, re-sync the database:

```powershell
backend\.venv\Scripts\python.exe -m backend.seed_products
```

Each product has `id`, `name`, `price`, `category` (`color`, `material`, `furniture`, `decor`), `description`, `image`, and optionally `unit` (e.g. `/ litre`, `/sq.ft`), `room` and `styles` (style tags used by the AI, e.g. `modern`, `scandinavian`).

---

## API Endpoints

Full interactive docs: http://localhost:8000/docs

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/auth/register`, `/auth/login` | — | Admin registration / login (JWT) |
| GET | `/products/product`, `/products/product/{id}` | — | List / get products |
| POST, PUT, DELETE | `/products/product...` | — | Create / update / delete products |
| POST | `/consult/create` | — | Submit a consultation request |
| GET, PUT, DELETE | `/consult/...` | Admin | Manage consultations |
| POST | `/feed/feedback` | — | Submit feedback |
| GET, PUT, DELETE | `/feed/feedback...` | Admin | Manage feedback |
| GET | `/dashboard/` | Admin | Dashboard counts |
| POST | `/ai/consult` | — (rate limited) | Ask the AI Interior Designer |
| GET | `/ai/avatar/status` | — | Whether the video consultant is configured |
| POST | `/ai/avatar/session` | — (rate limited) | Short-lived LiveAvatar session token |

> ⚠️ The product create/update/delete routes currently have **no authentication** — protect them before deploying.

## Project Structure

```
Home_interior/
├── backend/
│   ├── main.py                  # FastAPI app, CORS, router registration
│   ├── database.py              # SQLAlchemy engine/session
│   ├── seed_products.py         # Syncs products table from Frontend/src/catalog.json
│   ├── core/                    # Settings (.env), security, dependencies
│   ├── models/                  # SQLAlchemy models
│   ├── schemas/                 # Pydantic request/response schemas
│   ├── crud/                    # Database access
│   ├── routes/                  # API routes (consultant.py = AI endpoints)
│   ├── services/
│   │   ├── llm_service.py       # Prompt, LLM call, answer validation
│   │   ├── product_retrieval.py # Catalog lookup, site prices, budget totals
│   │   └── avatar_service.py    # LiveAvatar session tokens
│   └── requirements.txt
└── Frontend/
    ├── src/
    │   ├── App.tsx              # View switching, saved designs, consultant panel
    │   ├── api.ts               # API base URL + AI consultant client
    │   ├── catalog.json         # Product catalog (single source of truth)
    │   ├── data.ts              # Catalog helpers (findProduct, getDisplayPrice)
    │   ├── types.ts
    │   ├── hooks/
    │   │   └── useLiveAvatar.ts # Video avatar session lifecycle
    │   └── components/
    │       ├── HomeView.tsx, MaterialView.tsx, FurnitureView.tsx,
    │       │   SelectedDesignsView.tsx, AdminDashboardView.tsx, LoginView.tsx
    │       └── consultant/      # AIConsultantPanel, RecommendedProducts, AvatarStage
    ├── package.json
    └── vite.config.ts
```

---

## Running Tests

There are no automated tests yet (`backend/tests/` is empty). Useful checks in the meantime:

```bash
cd Frontend
npx tsc --noEmit   # type-check the frontend
npm run build      # type-check + production build
```

## Contributing

1. Create a branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Commit using clear messages following a simplified [Conventional Commits](https://www.conventionalcommits.org/) style:
   - `feat:` – a new feature
   - `fix:` – a bug fix
   - `docs:` – documentation changes
   - `refactor:` – code changes that neither fix a bug nor add a feature
   - `test:` – adding or updating tests
3. Push your branch and open a Pull Request against `main`.

## Troubleshooting

| Issue | Possible Fix |
|-------|--------------|
| `ModuleNotFoundError: No module named 'backend'` | Start the API from the project root, not from inside `backend/` |
| Backend changes not taking effect | Restart the API — `--reload` misses changes in OneDrive folders |
| "The AI consultant is busy right now" | Groq rate limit reached (free tier ≈ 3 questions/min) — wait a minute or upgrade the Groq plan |
| "The AI consultant is unavailable right now" | Check `LLM_key` in `backend/.env` and the API terminal for the error |
| "The video consultant has been started several times recently" | The per-visitor video limit was reached — raise `AVATAR_SESSIONS_PER_HOUR` in `backend/.env` (or restart the API to reset the counter) |
| No **Start video** option in the AI panel | `LIVEAVATAR_API_KEY` is not set in `backend/.env` (restart the API after adding it) |
| Video consultant fails to start | Check the API terminal — common causes are an invalid key (HeyGen keys don't work), no credits left, or a session length above the plan limit |
| Products show "Mock Product" names or wrong prices | Run `python -m backend.seed_products` to sync the database from `catalog.json` |
| Port already in use | Stop the other process, or use another port (e.g. `--port 8001`, `npm run dev -- --port 5174`) |
| First page load is very slow | Normal on the first `npm run dev` — Vite is pre-bundling dependencies |
| Module not found errors | Re-run the `pip install` / `npm install` steps |

## License

This project does not yet include a license. If you plan to publish or share it publicly, add a `LICENSE` file (e.g. MIT, Apache 2.0, or GPL) to clarify usage rights.

---

<p align="center">Built with ❤️ for home interior design enthusiasts.</p>
