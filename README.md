# 🏠 Home Interior Design

A full-stack home interior design application featuring a Python backend API and a modern TypeScript/React frontend.

![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)
![Node](https://img.shields.io/badge/Node.js-16+-green.svg)
![React](https://img.shields.io/badge/React-TypeScript-61DAFB.svg)
![License](https://img.shields.io/badge/License-Add--Yours-lightgrey.svg)

---

## 📖 Table of Contents

- [Overview](#overview)
- [Repository Layout](#repository-layout)
- [Tech Stack](#tech-stack)
- [Requirements](#requirements)
- [Getting Started](#getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment & Configuration](#environment--configuration)
- [Running Tests](#running-tests)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Overview

Home Interior Design is a web application that helps users design, visualize, and manage home interior projects. The backend exposes a REST API built in Python, while the frontend delivers a fast, responsive UI built with React, TypeScript, and Vite.

## Repository Layout

```
Home_interior/
├── backend/            # Python API, services, models, routes, and tests
│   ├── requirements.txt
│   ├── main.py
│   └── tests/
└── Frontend/           # Vite + React (TypeScript) frontend application
    ├── src/
    ├── package.json
    └── vite.config.ts
```

## Tech Stack

| Layer      | Technology                     |
|------------|---------------------------------|
| Backend    | Python, FastAPI                 |
| Database   | PostgreSQL                      |
| Frontend   | React, TypeScript, Vite         |
| Testing    | Pytest (backend)                |
| Package Manager | pip (backend), npm/pnpm (frontend) |

## Requirements

- **Python** 3.10 or higher
- **Node.js** 16 or higher
- **npm** or **pnpm**
- **PostgreSQL** 13 or higher
- (Optional) **Git** for version control

---

## Getting Started

### Backend Setup

1. **Create and activate a virtual environment**

   **Windows (PowerShell):**
   ```powershell
   python -m venv .venv
   .venv\Scripts\Activate.ps1
   ```

   **macOS / Linux:**
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```

2. **Install dependencies**

   ```bash
   pip install -r backend/requirements.txt
   ```

3. **Set up PostgreSQL**

   Make sure PostgreSQL is installed and running, then create a database for the project:

   ```bash
   psql -U postgres -c "CREATE DATABASE home_interior_db;"
   ```

   Update the `DATABASE_URL` in your `.env` file to point to this database (see [Environment & Configuration](#environment--configuration)).

   If the project uses migrations (e.g. Alembic), apply them:

   ```bash
   alembic upgrade head
   ```

4. **Run the API**

   **Windows (PowerShell):**
   ```powershell
   cd Home_interior
   .\backend\.venv\Scripts\uvicorn.exe backend.main:app --reload
   ```

   **macOS / Linux:**
   ```bash
   cd Home_interior
   uvicorn backend.main:app --reload
   ```

   > 💡 Adjust the entrypoint (`backend.main:app`) if your project structure differs. The API will typically be available at `http://127.0.0.1:8000`.

5. **(Optional) View interactive API docs**

   If using FastAPI, visit `http://127.0.0.1:8000/docs` for the auto-generated Swagger UI.

### Frontend Setup

1. **Navigate to the frontend folder and install dependencies**

   ```bash
   cd Frontend
   npm install
   ```

2. **Start the development server**

   ```bash
   npm run dev
   ```

   The app will typically be available at `http://localhost:5173`.

3. **Build for production**

   ```bash
   npm run build
   ```

4. **Preview the production build**

   ```bash
   npm run preview
   ```

---

## Environment & Configuration

- Keep secrets and environment-specific values **out of source control**.
- Create a `.env` file at the appropriate project root(s) and add it to `.gitignore`.
- Example `.env` variables you may need:

  ```env
  # Backend
  DATABASE_URL=postgresql://<username>:<password>@localhost:5432/home_interior_db
  SECRET_KEY=your_secret_key
  DEBUG=True

  # Frontend
  VITE_API_BASE_URL=http://127.0.0.1:8000
  ```

- Consider providing a `.env.example` file with placeholder values so contributors know which variables are required.

## Running Tests

Backend tests live under `backend/tests/`. Run them with your preferred test runner:

```bash
cd backend
pytest
```

For coverage reporting:

```bash
pytest --cov=backend --cov-report=term-missing
```

Frontend tests (if configured, e.g. with Vitest or Jest):

```bash
cd Frontend
npm run test
```

## Project Structure

```
backend/
├── main.py           # Application entrypoint
├── routes/            # API route definitions
├── models/             # Data models / schemas
├── services/            # Business logic
├── tests/              # Unit and integration tests
└── requirements.txt

Frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/           # Page-level views
│   ├── hooks/            # Custom React hooks
│   ├── assets/            # Images, styles, static files
│   └── App.tsx
├── public/
└── package.json
```

> 📌 Update this section to reflect your actual folder structure as the project evolves.

---

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository and create your branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your changes and commit using clear, descriptive messages:
   ```bash
   git commit -m "feat: add room layout preview"
   ```
3. Push your branch and open a Pull Request against `main`.
4. Ensure tests pass and code is linted before submitting.

### Commit Convention

This project follows a simplified [Conventional Commits](https://www.conventionalcommits.org/) style:

- `feat:` – a new feature
- `fix:` – a bug fix
- `docs:` – documentation changes
- `refactor:` – code changes that neither fix a bug nor add a feature
- `test:` – adding or updating tests

## Troubleshooting

| Issue | Possible Fix |
|-------|---------------|
| `uvicorn` command not found | Ensure your virtual environment is activated and dependencies are installed |
| Frontend fails to connect to API | Check `VITE_API_BASE_URL` in your `.env` matches the backend's running address |
| Port already in use | Stop the conflicting process or run on a different port, e.g. `--port 8001` |
| Module not found errors | Re-run `pip install -r backend/requirements.txt` or `npm install` |

## License

This project does not yet include a license. If you plan to publish or share it publicly, add a `LICENSE` file (e.g. MIT, Apache 2.0, or GPL) to clarify usage rights.

---

<p align="center">Built with ❤️ for home interior design enthusiasts.</p>
