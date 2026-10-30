from app.core.database import SessionLocal
from app.models.destination import Destination
from app.models.traveler import Traveler
from app.seed_data import DESTINATIONS, TRAVELERS


def seed_if_missing() -> None:
    db = SessionLocal()
    try:
        existing_travelers = {
            name for (name,) in db.query(Traveler.name).all()
        }
        existing_destinations = {
            name for (name,) in db.query(Destination.name).all()
        }

        for traveler in TRAVELERS:
            if traveler.name in existing_travelers:
                print(f"Skipped traveler: {traveler.name}")
                continue
            db.add(
                Traveler(
                    name=traveler.name,
                    budget_max=traveler.budget_max,
                    date_start=traveler.date_start,
                    date_end=traveler.date_end,
                    interests=traveler.interests,
                )
            )
            existing_travelers.add(traveler.name)
            print(f"Inserted traveler: {traveler.name}")

        for destination in DESTINATIONS:
            if destination.name in existing_destinations:
                print(f"Skipped destination: {destination.name}")
                continue
            db.add(
                Destination(
                    name=destination.name,
                    slug=destination.slug,
                    state=destination.state,
                    description=destination.description,
                    best_season=destination.best_season,
                    top_places=destination.top_places,
                    daily_budget_min=destination.daily_budget_min,
                    daily_budget_max=destination.daily_budget_max,
                    image_url=destination.image_url,
                    cost=destination.cost,
                    avail_start=destination.avail_start,
                    avail_end=destination.avail_end,
                    tags=destination.tags,
                )
            )
            existing_destinations.add(destination.name)
            print(f"Inserted destination: {destination.name}")

        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    seed_if_missing()
