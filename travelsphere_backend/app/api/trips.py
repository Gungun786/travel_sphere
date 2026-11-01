from collections import defaultdict, deque
from datetime import date
from threading import Lock
import time

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, selectinload

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.destination import Destination
from app.models.trip import Trip, TripMember
from app.models.user import User
from app.schemas.trip import CompareRequest
from app.schemas.trip import (
    TripCreate,
    TripMemberResponse,
    TripResponse,
    TripUpdate,
)
from app.services.explainer import generate_comparison_explanation
from app.services.optimizer import availability_overlaps

router = APIRouter(prefix="/api/trips", tags=["trips"])
_explain_calls: dict[int, deque[float]] = defaultdict(deque)
_explain_lock = Lock()


def _day_of_year(value: date) -> int:
    return value.timetuple().tm_yday


def _comparison_facts(
    trip: Trip,
    members: list[TripMember],
    destination: Destination,
) -> dict:
    trip_start = _day_of_year(trip.date_start)
    trip_end = _day_of_year(trip.date_end)
    if trip_end < trip_start:
        trip_end += 365

    destination_tags = {
        tag.strip().lower() for tag in destination.tags.split(",") if tag.strip()
    }
    per_member = []
    for member in members:
        member_tags = {tag.strip().lower() for tag in member.interests.split(",") if tag.strip()}
        shared_tags = sorted(destination_tags & member_tags)
        per_member.append(
            {
                "member": member.name,
                "matches": bool(shared_tags),
                "shared_tags": shared_tags,
            }
        )

    top_places = destination.top_places or []
    place_names = [
        item.get("name")
        for item in top_places[:3]
        if isinstance(item, dict) and item.get("name")
    ]
    if len(place_names) < 3:
        place_names.extend(place.name for place in destination.places[: 3 - len(place_names)])

    return {
        "slug": destination.slug,
        "name": destination.name,
        "estimated_cost": destination.cost,
        "date_fit": availability_overlaps(
            trip_start,
            trip_end,
            destination.avail_start,
            destination.avail_end,
        ),
        "budget_fit": {
            "fit_count": sum(
                member.budget_per_person >= destination.cost for member in members
            ),
            "total_members": len(members),
        },
        "interest_match": {
            "matched_members": sum(item["matches"] for item in per_member),
            "total_members": len(members),
            "shared_tags": sorted(
                {
                    tag
                    for item in per_member
                    for tag in item["shared_tags"]
                }
            ),
            "per_member": per_member,
        },
        "best_season": destination.best_season,
        "top_places": place_names[:3],
    }


def _best_per_row(facts: list[dict]) -> dict:
    return {
        "estimated_cost": min(facts, key=lambda item: item["estimated_cost"])["slug"],
        "date_fit": next(
            (item["slug"] for item in facts if item["date_fit"]),
            None,
        ),
        "budget_fit": max(
            facts,
            key=lambda item: item["budget_fit"]["fit_count"],
        )["slug"],
        "interest_match": max(
            facts,
            key=lambda item: item["interest_match"]["matched_members"],
        )["slug"],
        "best_season": next(
            (item["slug"] for item in facts if item["best_season"]),
            None,
        ),
        "top_places": max(
            facts,
            key=lambda item: len(item["top_places"]),
        )["slug"],
    }


def _rule_based_summary(facts: list[dict], best_per_row: dict) -> str:
    names = {item["slug"]: item["name"] for item in facts}
    cheapest = names[best_per_row["estimated_cost"]]
    date_fit = names.get(best_per_row["date_fit"], "none")
    interest = names[best_per_row["interest_match"]]
    return (
        f"{cheapest} is the cheapest option. {date_fit} has the best date fit, "
        f"while {interest} matches the most group interests. The main trade-off "
        "is balancing cost, dates, and shared interests."
    )


def _allow_explanation(user_id: int) -> bool:
    now = time.monotonic()
    with _explain_lock:
        calls = _explain_calls[user_id]
        while calls and now - calls[0] >= 60:
            calls.popleft()
        if len(calls) >= 10:
            return False
        calls.append(now)
        return True


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


@router.patch("/{trip_id}", response_model=TripResponse)
def update_trip(
    trip_id: int,
    payload: TripUpdate,
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

    trip.optimizer_result = payload.optimizer_result
    db.commit()
    db.refresh(trip)
    return serialize_trip(trip)


@router.post("/{trip_id}/compare")
def compare_trip(
    trip_id: int,
    payload: CompareRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if payload.explain and not _allow_explanation(user.id):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Comparison explanations are limited to 10 per minute.",
        )

    trip = (
        db.query(Trip)
        .options(selectinload(Trip.members))
        .filter(Trip.id == trip_id, Trip.owner_id == user.id)
        .one_or_none()
    )
    if trip is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found.")

    destinations = (
        db.query(Destination)
        .options(selectinload(Destination.places))
        .filter(Destination.slug.in_(payload.slugs))
        .all()
    )
    by_slug = {destination.slug: destination for destination in destinations}
    if any(slug not in by_slug for slug in payload.slugs):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Destination not found.",
        )

    facts = [_comparison_facts(trip, trip.members, by_slug[slug]) for slug in payload.slugs]
    best_per_row = _best_per_row(facts)
    summary = None
    if payload.explain:
        try:
            summary = generate_comparison_explanation(
                {"destinations": facts, "best_per_row": best_per_row},
                best_per_row,
            )
        except Exception:
            summary = _rule_based_summary(facts, best_per_row)

    return {
        "destinations": facts,
        "best_per_row": best_per_row,
        "summary": summary,
    }
