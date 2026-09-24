from sqlalchemy import Column, Integer, String, Float
from app.core.database import Base

class Destination(Base):
    __tablename__ = "destinations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    cost = Column(Float, nullable=False)
    avail_start = Column(Integer, nullable=False)
    avail_end = Column(Integer, nullable=False)
    tags = Column(String, nullable=False)  # comma-separated, e.g. "beach,nightlife"