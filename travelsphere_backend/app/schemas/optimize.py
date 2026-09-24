from pydantic import BaseModel
from typing import List, Dict

class TravelerIn(BaseModel):
    budget_max: float
    date_start: int
    date_end: int
    interests: List[str]

class DestinationIn(BaseModel):
    cost: float
    avail_start: int
    avail_end: int
    tags: List[str]

class OptimizeRequest(BaseModel):
    travelers: Dict[str, TravelerIn]
    destinations: Dict[str, DestinationIn]

class OptimizeResponse(BaseModel):
    chosen: str | None
    cost: float | None = None
    match_score: int | None = None
    reason: str | None = None
    explanation: str