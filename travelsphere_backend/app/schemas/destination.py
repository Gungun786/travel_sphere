from pydantic import BaseModel


class PlaceResponse(BaseModel):
    id: int
    name: str
    category: str
    description: str
    avg_hours: float
    entry_cost: float
    lat: float | None
    lon: float | None
    source_note: str | None
    verified: bool


class DestinationResponse(BaseModel):
    name: str
    slug: str | None
    state: str | None
    description: str | None
    best_season: str | None
    top_places: list[dict[str, str]]
    daily_budget_min: float | None
    daily_budget_max: float | None
    image_url: str | None
    best_months: list[int]
    avoid_months: list[int]
    aliases: list[str]
    lat: float | None
    lon: float | None
    verified: bool
    source_note: str | None
    places: list[PlaceResponse]
    cost: float
    avail_start: int
    avail_end: int
    tags: list[str]
