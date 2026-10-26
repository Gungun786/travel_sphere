from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.traveler import Traveler
from app.models.destination import Destination
from app.schemas.optimize import OptimizeRequest, OptimizeResponse
from app.services.optimizer import solve_group_trip
from app.services.explainer import generate_explanation
from app.core.security import get_current_user

router = APIRouter()


def normalize_values(values: list[str] | set[str]) -> set[str]:
    normalized = set()

    for value in values:
        item = value.strip().lower()

        if item.endswith("s") and not item.endswith("ss"):
            item = item[:-1]

        normalized.add(item)

    return normalized


def remove_vetoed_destinations(
    destinations: dict,
    vetoed_destinations: list[str],
) -> dict:
    vetoed = set(vetoed_destinations)
    return {
        name: destination
        for name, destination in destinations.items()
        if name not in vetoed
    }


def load_database_data(db: Session):
    db_travelers = db.query(Traveler).all()
    db_destinations = db.query(Destination).all()

    travelers = {
        traveler.name: {
            "budget_max": traveler.budget_max,
            "date_start": traveler.date_start,
            "date_end": traveler.date_end,
            "interests": normalize_values(
                traveler.interests.split(",")
            ),
        }
        for traveler in db_travelers
    }

    destinations = {
        destination.name: {
            "cost": destination.cost,
            "avail_start": destination.avail_start,
            "avail_end": destination.avail_end,
            "tags": normalize_values(
                destination.tags.split(",")
            ),
        }
        for destination in db_destinations
    }

    return travelers, destinations


@router.post("/api/optimize", response_model=OptimizeResponse)
def optimize(
    payload: OptimizeRequest | None = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    if payload is None:
        travelers, destinations = load_database_data(db)
    else:
        travelers = {
            name: {
                "budget_max": traveler.budget_max,
                "date_start": traveler.date_start,
                "date_end": traveler.date_end,
                "interests": normalize_values(traveler.interests),
            }
            for name, traveler in payload.travelers.items()
        }

        if payload.destinations is not None:
            destinations = {
                name: {
                    "cost": destination.cost,
                    "avail_start": destination.avail_start,
                    "avail_end": destination.avail_end,
                    "tags": normalize_values(destination.tags),
                }
                for name, destination in payload.destinations.items()
            }
        else:
            _, destinations = load_database_data(db)

        destinations = remove_vetoed_destinations(
            destinations,
            payload.vetoed_destinations,
        )

    if payload is None:
        destinations = remove_vetoed_destinations(destinations, [])

    result = solve_group_trip(travelers, destinations)

    result["explanation"] = generate_explanation(
        result,
        travelers,
        destinations,
    )

    return result