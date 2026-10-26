import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.optimize import router as optimize_router
from app.api.trips import router as trips_router
from app.core.database import Base, engine
from app.models.trip import Trip, TripMember
from app.models.user import User

app = FastAPI(title="TravelSphere AI Backend")
Base.metadata.create_all(bind=engine)

frontend_origins = [
    origin.strip()
    for origin in os.getenv("FRONTEND_ORIGINS", "http://localhost:3000").split(",")
    if origin.strip()
]


@app.get("/health")
def health():
    return {"status": "ok"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=frontend_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(optimize_router)
app.include_router(trips_router)