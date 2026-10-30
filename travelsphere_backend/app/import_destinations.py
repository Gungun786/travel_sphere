import json
from pathlib import Path

from sqlalchemy import and_

from app.core.database import SessionLocal
from app.models.destination import Destination
from app.models.place import Place


DATA_PATH = Path(__file__).resolve().parents[1] / "data" / "destinations.json"
DESTINATION_FIELDS = (
    "slug",
    "name",
    "state",
    "description",
    "best_season",
    "top_places",
    "daily_budget_min",
    "daily_budget_max",
    "image_url",
    "best_months",
    "avoid_months",
    "aliases",
    "lat",
    "lon",
    "verified",
    "source_note",
    "cost",
    "avail_start",
    "avail_end",
    "tags",
)


def import_destinations() -> tuple[int, int]:
    records = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    inserted_destinations = 0
    skipped_destinations = 0
    inserted_places = 0
    skipped_places = 0

    db = SessionLocal()
    try:
        for record in records:
            destination = (
                db.query(Destination)
                .filter(Destination.slug == record["slug"])
                .one_or_none()
            )
            if destination is None:
                values = {
                    field: record[field]
                    for field in DESTINATION_FIELDS
                    if field in record
                }
                place_records = record.get("places", [])
                destination = Destination(**values)
                db.add(destination)
                db.flush()
                inserted_destinations += 1
            else:
                skipped_destinations += 1
                place_records = record.get("places", [])
                for field in DESTINATION_FIELDS:
                    if field in record and getattr(destination, field) is None:
                        setattr(destination, field, record[field])

            for place_record in place_records:
                existing_place = (
                    db.query(Place.id)
                    .filter(
                        and_(
                            Place.destination_id == destination.id,
                            Place.name == place_record["name"],
                        )
                    )
                    .one_or_none()
                )
                if existing_place:
                    skipped_places += 1
                    continue
                db.add(
                    Place(
                        destination_id=destination.id,
                        name=place_record["name"],
                        category=place_record["category"],
                        description=place_record["description"],
                        avg_hours=place_record["avg_hours"],
                        entry_cost=place_record.get("entry_cost", 0),
                        lat=place_record.get("lat"),
                        lon=place_record.get("lon"),
                        source_note=place_record.get("source_note"),
                        verified=place_record.get("verified", False),
                    )
                )
                inserted_places += 1
        db.commit()
    finally:
        db.close()

    print(
        f"destinations inserted={inserted_destinations} skipped={skipped_destinations}; "
        f"places inserted={inserted_places} skipped={skipped_places}"
    )
    return inserted_destinations, inserted_places


if __name__ == "__main__":
    import_destinations()
