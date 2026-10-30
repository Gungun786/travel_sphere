from sqlalchemy import Boolean, CheckConstraint, Column, Float, Integer, JSON, String
from sqlalchemy.orm import relationship
from app.core.database import Base

class Destination(Base):
    __tablename__ = "destinations"
    __table_args__ = (
        CheckConstraint("avail_start BETWEEN 1 AND 366"),
        CheckConstraint("avail_end BETWEEN 1 AND 366"),
    )

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    slug = Column(String(120), unique=True, nullable=True, index=True)
    state = Column(String(120), nullable=True)
    description = Column(String, nullable=True)
    best_season = Column(String(120), nullable=True)
    top_places = Column(JSON, nullable=True)
    daily_budget_min = Column(Float, nullable=True)
    daily_budget_max = Column(Float, nullable=True)
    image_url = Column(String, nullable=True)
    best_months = Column(JSON, nullable=True)
    avoid_months = Column(JSON, nullable=True)
    aliases = Column(JSON, nullable=True)
    lat = Column(Float, nullable=True)
    lon = Column(Float, nullable=True)
    verified = Column(Boolean, nullable=True, default=False)
    source_note = Column(String, nullable=True)
    cost = Column(Float, nullable=False)
    avail_start = Column(Integer, nullable=False)
    avail_end = Column(Integer, nullable=False)
    tags = Column(String, nullable=False)  # comma-separated, e.g. "beach,nightlife"
    places = relationship("Place", back_populates="destination")