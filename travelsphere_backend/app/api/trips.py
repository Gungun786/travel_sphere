from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.trip import Trip, TripMember
from app.models.user import User
from app.schemas.trip import TripCreate, TripMemberResponse, TripResponse

router = APIRouter(prefix="/api/trips", tags=["trips"])


def serialize_trip(trip: Trip) -> TripResponse:
    return TripResponse(
        id=trip.id,
        name=trip.name,
        destination=trip.destination,
        decide_later=trip.decide_later,
        date_start=trip.date_start,
        date_end=trip.date_end,
        budget_total=trip.budget_total,
        optimizer_result=trip.optimizer_result,
        created_at=trip.created_at,
        members=[
            TripMemberResponse(
                id=member.id,
                name=member.name,
                budget_per_person=member.budget_per_person,
                interests=[
                    interest for interest in member.interests.split(",") if interest
                ],
            )
            for member in trip.members
        ],
    )


@router.post("", response_model=TripResponse, status_code=status.HTTP_201_CREATED)
def create_trip(
    payload: TripCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    trip = Trip(
        owner_id=user.id,
        name=payload.name,
        destination=payload.destination,
        decide_later=payload.decide_later,
        date_start=payload.date_start,
        date_end=payload.date_end,
        budget_total=payload.budget_total,
        optimizer_result=payload.optimizer_result,
        members=[
            TripMember(
                name=member.name,
                budget_per_person=member.budget_per_person,
                interests=",".join(member.interests),
            )
            for member in payload.members
        ],
    )
    db.add(trip)
    db.commit()
    db.refresh(trip)
    return serialize_trip(trip)


@router.get("", response_model=list[TripResponse])
def list_trips(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    trips = (
        db.query(Trip)
        .filter(Trip.owner_id == user.id)
        .order_by(Trip.created_at.desc())
        .all()
    )
    return [serialize_trip(trip) for trip in trips]


@router.get("/{trip_id}", response_model=TripResponse)
def get_trip(
    trip_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    trip = (
        db.query(Trip)
        .filter(Trip.id == trip_id, Trip.owner_id == user.id)
        .one_or_none()
    )
    if trip is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found.")
    return serialize_trip(trip)
