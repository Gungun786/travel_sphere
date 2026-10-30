from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, selectinload

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.destination import Destination
from app.models.place import Place
from app.models.user import User
from app.schemas.destination import DestinationResponse

router = APIRouter(prefix="/api/destinations", tags=["destinations"])


def serialize_destination(destination: Destination) -> DestinationResponse:
    return DestinationResponse(
        name=destination.name,
        slug=destination.slug,
        state=destination.state,
        description=destination.description,
        best_season=destination.best_season,
        top_places=destination.top_places or [],
        daily_budget_min=destination.daily_budget_min,
        daily_budget_max=destination.daily_budget_max,
        image_url=destination.image_url,
        best_months=destination.best_months or [],
        avoid_months=destination.avoid_months or [],
        aliases=destination.aliases or [],
        lat=destination.lat,
        lon=destination.lon,
        verified=destination.verified or False,
        source_note=destination.source_note,
        places=[
            {
                "id": place.id,
                "name": place.name,
                "category": place.category,
                "description": place.description,
                "avg_hours": place.avg_hours,
                "entry_cost": place.entry_cost,
                "lat": place.lat,
                "lon": place.lon,
                "source_note": place.source_note,
                "verified": place.verified,
            }
            for place in destination.places
        ],
        cost=destination.cost,
        avail_start=destination.avail_start,
        avail_end=destination.avail_end,
        tags=[tag for tag in destination.tags.split(",") if tag],
    )


@router.get("", response_model=list[DestinationResponse])
def list_destinations(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    destinations = (
        db.query(Destination)
        .options(selectinload(Destination.places))
        .order_by(Destination.name)
        .all()
    )
    return [serialize_destination(destination) for destination in destinations]


@router.get("/{slug}", response_model=DestinationResponse)
def get_destination(
    slug: str,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    destination = (
        db.query(Destination)
        .options(selectinload(Destination.places))
        .filter(Destination.slug == slug)
        .one_or_none()
    )
    if destination is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Destination not found.",
        )
    return serialize_destination(destination)
