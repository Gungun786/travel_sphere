from datetime import date, datetime

from pydantic import BaseModel, Field, model_validator


class TripMemberCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    budget_per_person: float = Field(ge=0)
    interests: list[str] = Field(default_factory=list)


class TripCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    destination: str | None = Field(default=None, max_length=120)
    decide_later: bool = False
    date_start: date
    date_end: date
    budget_total: float = Field(ge=0)
    optimizer_result: dict | None = None
    members: list[TripMemberCreate] = Field(min_length=1)

    @model_validator(mode="after")
    def validate_dates(self):
        if self.date_end < self.date_start:
            raise ValueError("date_end must be on or after date_start")
        return self


class TripUpdate(BaseModel):
    optimizer_result: dict | None


class TripMemberResponse(BaseModel):
    id: int
    name: str
    budget_per_person: float
    interests: list[str]


class TripResponse(BaseModel):
    id: int
    name: str
    destination: str | None
    decide_later: bool
    date_start: date
    date_end: date
    budget_total: float
    optimizer_result: dict | None
    created_at: datetime
    members: list[TripMemberResponse]
