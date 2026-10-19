from pydantic import BaseModel, Field
from typing import List, Dict

class TravelerIn(BaseModel):
    budget_max: float
    date_start: int = Field(ge=1, le=366)
    date_end: int = Field(ge=1, le=731)
    interests: List[str]

class DestinationIn(BaseModel):
    cost: float
    avail_start: int = Field(ge=1, le=366)
    avail_end: int = Field(ge=1, le=366)
    tags: List[str]

class OptimizeRequest(BaseModel):
    travelers: Dict[str, TravelerIn]
    destinations: Dict[str, DestinationIn] | None = None

class OptimizeResponse(BaseModel):
    chosen: str | None
    cost: float | None = None
    match_score: int | None = None
    reason: str | None = None
    explanation: str