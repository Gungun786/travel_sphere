# TravelSphere

TravelSphere is a collaborative trip-planning application that helps groups choose destinations, compare options, and save trip plans.

## Tech stack

- Frontend: Next.js 14 App Router, React, TypeScript, Tailwind CSS, Auth.js
- Backend: FastAPI, Pydantic, SQLAlchemy, PostgreSQL
- Optimization: Google OR-Tools CP-SAT
- Explanations: Google Gemini
- Authentication: Google login with backend JWTs

## Features

- Group trip optimizer with budget, date, and interest constraints
- Gemini-generated explanations for recommendations
- Google login
- Per-user saved trips and trip members
- Decide-later trips with destination veto and re-optimization
- Destination comparison and trip planning views

## Architecture

The Next.js frontend handles the user interface and Auth.js Google session. The frontend obtains a short-lived backend JWT and sends authenticated requests to the FastAPI service. FastAPI validates the JWT, loads user-owned trip data through SQLAlchemy, runs OR-Tools optimization, and optionally asks Gemini to explain the result. PostgreSQL stores users, trips, members, travelers, and destinations.

## Setup

### Backend

1. Create a PostgreSQL database.
2. Create and activate a virtual environment:

   ```powershell
   cd travelsphere_backend
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   ```

3. Copy `travelsphere_backend/.env.example` to `travelsphere_backend/.env` and set real local values.
4. Start the API:

   ```powershell
   uvicorn app.main:app --reload
   ```

5. To add missing starter travelers and destinations without changing existing rows:

   ```powershell
   python -m app.seed_if_missing
   ```

### Frontend

1. From the repository root, install dependencies:

   ```powershell
   npm install
   ```

2. Copy `.env.example` to `.env.local` and set real local values.
3. Start Next.js:

   ```powershell
   npm run dev
   ```

The frontend runs at `http://localhost:3000` and the backend runs at `http://127.0.0.1:8000` by default.

## Environment variables

| File | Variable | Purpose |
| --- | --- | --- |
| Frontend | `AUTH_GOOGLE_ID` | Google OAuth client ID |
| Frontend | `AUTH_GOOGLE_SECRET` | Google OAuth client secret |
| Frontend | `AUTH_SECRET` | Auth.js session encryption secret |
| Frontend | `BACKEND_JWT_SECRET` | Shared secret for frontend-issued backend JWTs |
| Frontend | `NEXT_PUBLIC_API_URL` | Backend API base URL |
| Backend | `DATABASE_URL` | PostgreSQL connection URL |
| Backend | `GEMINI_API_KEY` | Google Gemini API key |
| Backend | `BACKEND_JWT_SECRET` | JWT signing and validation secret |
| Backend | `FRONTEND_ORIGINS` | Comma-separated allowed browser origins |

Use the same `BACKEND_JWT_SECRET` value in the frontend and backend environments. Never commit real values.

## API endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Health check |
| `POST` | `/api/optimize` | Optimize a group trip, optionally with vetoed destinations |
| `POST` | `/api/trips` | Create a saved trip |
| `GET` | `/api/trips` | List the current user's trips |
| `GET` | `/api/trips/{id}` | Read an owned trip |
| `PATCH` | `/api/trips/{id}` | Update an owned trip's optimizer result |

All trip and optimization endpoints require a backend bearer token.

## Render start command

```text
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

Set the Render service root to `travelsphere_backend` so the `app` package resolves correctly.

## Roadmap

- Add migrations and managed deployment workflows
- Persist veto history and collaborative voting
- Improve destination filters and recommendation explanations
- Add automated backend and frontend integration coverage
