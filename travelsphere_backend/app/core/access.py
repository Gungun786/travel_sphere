from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.trip import Trip
from app.models.user import User


def get_trip_for_viewer(db: Session, trip_id: int, user: User) -> Trip:
    trip = db.query(Trip).filter(Trip.id == trip_id).one_or_none()
    if trip is None or (
        trip.owner_id != user.id
        and not any(member.user_id == user.id for member in trip.members)
    ):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Trip not found.",
        )
    return trip


def get_trip_for_owner(db: Session, trip_id: int, user: User) -> Trip:
    trip = get_trip_for_viewer(db, trip_id, user)
    if trip.owner_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the trip owner can perform this action.",
        )
    return trip
