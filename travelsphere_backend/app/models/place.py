from sqlalchemy import Boolean, Column, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.core.database import Base


class Place(Base):
    __tablename__ = "places"

    id = Column(Integer, primary_key=True, index=True)
    destination_id = Column(Integer, ForeignKey("destinations.id"), nullable=False, index=True)
    name = Column(String(160), nullable=False)
    category = Column(String(40), nullable=False)
    description = Column(String, nullable=False)
    avg_hours = Column(Float, nullable=False)
    entry_cost = Column(Float, nullable=False, default=0)
    lat = Column(Float, nullable=True)
    lon = Column(Float, nullable=True)
    source_note = Column(String, nullable=True)
    verified = Column(Boolean, nullable=False, default=False)

    destination = relationship("Destination", back_populates="places")
