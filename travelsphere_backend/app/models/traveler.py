from sqlalchemy import Column, Integer, String, Float
from app.core.database import Base

class Traveler(Base):
    __tablename__ = "travelers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    budget_max = Column(Float, nullable=False)
    date_start = Column(Integer, nullable=False)
    date_end = Column(Integer, nullable=False)
    interests = Column(String, nullable=False)  # comma-separated, e.g. "beach,culture"