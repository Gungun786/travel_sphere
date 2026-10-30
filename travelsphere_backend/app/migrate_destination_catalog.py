from sqlalchemy import text

from app.core.database import engine


DESTINATION_COLUMNS = {
    "best_months": "JSON",
    "avoid_months": "JSON",
    "aliases": "JSON",
    "lat": "DOUBLE PRECISION",
    "lon": "DOUBLE PRECISION",
    "verified": "BOOLEAN DEFAULT FALSE",
    "source_note": "TEXT",
}


def migrate_destination_catalog() -> None:
    with engine.begin() as connection:
        for column, definition in DESTINATION_COLUMNS.items():
            connection.execute(
                text(
                    "ALTER TABLE destinations ADD COLUMN IF NOT EXISTS "
                    f"{column} {definition}"
                )
            )
        connection.execute(
            text(
                """
                CREATE TABLE IF NOT EXISTS places (
                    id SERIAL PRIMARY KEY,
                    destination_id INTEGER NOT NULL REFERENCES destinations(id),
                    name VARCHAR(160) NOT NULL,
                    category VARCHAR(40) NOT NULL,
                    description TEXT NOT NULL,
                    avg_hours DOUBLE PRECISION NOT NULL,
                    entry_cost DOUBLE PRECISION NOT NULL DEFAULT 0,
                    lat DOUBLE PRECISION,
                    lon DOUBLE PRECISION,
                    source_note TEXT,
                    verified BOOLEAN NOT NULL DEFAULT FALSE
                )
                """
            )
        )
        connection.execute(
            text(
                "CREATE INDEX IF NOT EXISTS places_destination_id_idx "
                "ON places (destination_id)"
            )
        )


if __name__ == "__main__":
    migrate_destination_catalog()
