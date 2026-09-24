from fastapi import FastAPI
from app.api.optimize import router as optimize_router

app = FastAPI(title="TravelSphere AI Backend")

app.include_router(optimize_router)