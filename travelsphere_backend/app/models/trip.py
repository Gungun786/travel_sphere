from datetime import date, datetime

from sqlalchemy import Boolean, Column, Date, DateTime, Float, ForeignKey, Integer, JSON, String
from sqlalchemy.orm import relationship

from app.core.database import Base


class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    name = Column(String(120), nullable=False)
    destination = Column(String(120), nullable=True)
    decide_later = Column(Boolean, nullable=False, default=False)
    date_start = Column(Date, nullable=False)
    date_end = Column(Date, nullable=False)
    budget_total = Column(Float, nullable=False)
    optimizer_result = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    owner = relationship("User")
    members = relationship(
        "TripMember",
        back_populates="trip",
        cascade="all, delete-orphan",
        order_by="TripMember.id",
    )


class TripMember(Base):
    __tablename__ = "trip_members"

    id = Column(Integer, primary_key=True, index=True)
    trip_id = Column(Integer, ForeignKey("trips.id"), nullable=False, index=True)
    name = Column(String(120), nullable=False)
    budget_per_person = Column(Float, nullable=False)
    interests = Column(String, nullable=False, default="")

    trip = relationship("Trip", back_populates="members")
