# TravelSphere Backend

Initial backend foundation for the TravelSphere project.

## Stack

- FastAPI
- SQLAlchemy
- PostgreSQL
- Pydantic
- Alembic
- python-dotenv

## Setup

Create a PostgreSQL database named `travelsphere`.

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Copy `.env.example` to `.env` and set:

```env
DATABASE_URL=postgresql+psycopg2://postgres:YOUR_PASSWORD@localhost:5432/travelsphere
```

Run the server:

```bash
uvicorn app.main:app --reload
```

Open:

- http://127.0.0.1:8000
- http://127.0.0.1:8000/docs
- http://127.0.0.1:8000/db-test

The `/db-test` endpoint checks whether SQLAlchemy can connect to PostgreSQL.
