from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.traveler import Traveler
from app.models.destination import Destination
from app.schemas.optimize import OptimizeResponse
from app.services.optimizer import solve_group_trip
from app.services.explainer import generate_explanation

router = APIRouter()

@router.post("/api/optimize", response_model=OptimizeResponse)
def optimize(db: Session = Depends(get_db)):
    db_travelers = db.query(Traveler).all()
    db_destinations = db.query(Destination).all()

    travelers = {
        t.name: {
            "budget_max": t.budget_max,
            "date_start": t.date_start,
            "date_end": t.date_end,
            "interests": set(t.interests.split(",")),
        }
        for t in db_travelers
    }

    destinations = {
        d.name: {
            "cost": d.cost,
            "avail_start": d.avail_start,
            "avail_end": d.avail_end,
            "tags": set(d.tags.split(",")),
        }
        for d in db_destinations
    }

    result = solve_group_trip(travelers, destinations)
    result["explanation"] = generate_explanation(result, travelers, destinations)
    return result