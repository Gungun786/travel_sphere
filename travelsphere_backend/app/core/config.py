import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL is not set in the .env file")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY is not set in the .env file")

BACKEND_JWT_SECRET = os.getenv("BACKEND_JWT_SECRET")

if not BACKEND_JWT_SECRET:
    raise ValueError("BACKEND_JWT_SECRET is not set in the .env file")