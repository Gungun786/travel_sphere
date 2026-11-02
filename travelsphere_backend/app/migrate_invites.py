from sqlalchemy import text

from app.core.database import engine


def migrate_invites() -> None:
    with engine.begin() as connection:
        connection.execute(
            text(
                "ALTER TABLE trip_members ADD COLUMN IF NOT EXISTS "
                "user_id INTEGER REFERENCES users(id)"
            )
        )
        connection.execute(
            text(
                """
                CREATE TABLE IF NOT EXISTS trip_invites (
                    id SERIAL PRIMARY KEY,
                    trip_id INTEGER NOT NULL REFERENCES trips(id),
                    member_id INTEGER NOT NULL REFERENCES trip_members(id),
                    token VARCHAR(128) UNIQUE NOT NULL,
                    email VARCHAR(320),
                    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    used_at TIMESTAMP
                )
                """
            )
        )
        connection.execute(
            text(
                "ALTER TABLE trip_invites ADD COLUMN IF NOT EXISTS "
                "email VARCHAR(320)"
            )
        )
        connection.execute(
            text(
                "CREATE INDEX IF NOT EXISTS trip_invites_trip_id_idx "
                "ON trip_invites (trip_id)"
            )
        )
        connection.execute(
            text(
                "CREATE INDEX IF NOT EXISTS trip_invites_member_id_idx "
                "ON trip_invites (member_id)"
            )
        )


if __name__ == "__main__":
    migrate_invites()
