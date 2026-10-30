import json

from sqlalchemy import text

from app.core.database import engine


COLUMNS = {
    "slug": "VARCHAR(120)",
    "state": "VARCHAR(120)",
    "description": "TEXT",
    "best_season": "VARCHAR(120)",
    "top_places": "JSON",
    "daily_budget_min": "DOUBLE PRECISION",
    "daily_budget_max": "DOUBLE PRECISION",
    "image_url": "TEXT",
}

# Review these factual descriptions, places, seasons, and budget estimates before production use.
DETAILS = {
    "Goa": {
        "slug": "goa",
        "state": "Goa",
        "description": "A coastal state known for beaches, Portuguese-influenced heritage, and lively markets.",
        "best_season": "November to February",
        "top_places": [{"name": "Baga Beach", "note": "Popular beach for water activities and evening markets."}, {"name": "Panaji", "note": "State capital with Latin Quarter streets and riverside views."}, {"name": "Old Goa", "note": "Historic churches and monuments from the Portuguese era."}],
        "daily_budget_min": 2500,
        "daily_budget_max": 7000,
        "image_url": None,
    },
    "Manali": {
        "slug": "manali",
        "state": "Himachal Pradesh",
        "description": "A Himalayan town with mountain valleys, cedar forests, and access to high-altitude routes.",
        "best_season": "March to June and October to February",
        "top_places": [{"name": "Solang Valley", "note": "Mountain valley popular for outdoor activities."}, {"name": "Old Manali", "note": "Walkable area with cafes and traditional village character."}, {"name": "Hadimba Temple", "note": "Wooden temple set among cedar trees."}],
        "daily_budget_min": 2500,
        "daily_budget_max": 7000,
        "image_url": None,
    },
    "Kerala": {
        "slug": "kerala",
        "state": "Kerala",
        "description": "A southwestern state known for backwaters, tropical coastlines, and hill-country tea plantations.",
        "best_season": "September to March",
        "top_places": [{"name": "Alappuzha", "note": "Gateway to Kerala's backwater houseboat routes."}, {"name": "Munnar", "note": "Hill station surrounded by tea estates."}, {"name": "Fort Kochi", "note": "Historic waterfront district with layered trading influences."}],
        "daily_budget_min": 2500,
        "daily_budget_max": 7500,
        "image_url": None,
    },
    "Jaipur": {
        "slug": "jaipur",
        "state": "Rajasthan",
        "description": "The Pink City, known for Rajput-era forts, palaces, crafts, and regional cuisine.",
        "best_season": "October to March",
        "top_places": [{"name": "Amber Fort", "note": "Hilltop fort complex with courtyards and palaces."}, {"name": "City Palace", "note": "Royal complex with museums and ceremonial courtyards."}, {"name": "Hawa Mahal", "note": "Iconic pink sandstone facade in the old city."}],
        "daily_budget_min": 2200,
        "daily_budget_max": 6500,
        "image_url": None,
    },
    "Rishikesh": {
        "slug": "rishikesh",
        "state": "Uttarakhand",
        "description": "A riverside city at the Himalayan foothills associated with yoga, ashrams, and rafting.",
        "best_season": "September to April",
        "top_places": [{"name": "Laxman Jhula area", "note": "Riverside neighborhood with temples, cafes, and views."}, {"name": "Triveni Ghat", "note": "Ghat known for its evening river ceremony."}, {"name": "Rajaji National Park", "note": "Nearby protected area with forest and wildlife habitats."}],
        "daily_budget_min": 1800,
        "daily_budget_max": 5500,
        "image_url": None,
    },
    "Meghalaya": {
        "slug": "meghalaya",
        "state": "Meghalaya",
        "description": "A northeastern hill state with forests, waterfalls, caves, and living root bridges.",
        "best_season": "October to May",
        "top_places": [{"name": "Shillong", "note": "Hill capital with lakes, viewpoints, and cultural sites."}, {"name": "Cherrapunji", "note": "Highland area known for waterfalls and limestone caves."}, {"name": "Nongriat", "note": "Village area reached by a trek to a living root bridge."}],
        "daily_budget_min": 2200,
        "daily_budget_max": 6500,
        "image_url": None,
    },
}


def migrate_destination_details() -> None:
    with engine.begin() as connection:
        for column, definition in COLUMNS.items():
            connection.execute(
                text(
                    f"ALTER TABLE destinations ADD COLUMN IF NOT EXISTS "
                    f"{column} {definition}"
                )
            )
        connection.execute(
            text(
                "CREATE UNIQUE INDEX IF NOT EXISTS destinations_slug_key "
                "ON destinations (slug) WHERE slug IS NOT NULL"
            )
        )
        for name, details in DETAILS.items():
            assignments = ", ".join(
                f"{column} = :{column}" for column in details
            )
            parameters = {
                "name": name,
                **details,
                "top_places": json.dumps(details["top_places"]),
            }
            connection.execute(
                text(
                    f"UPDATE destinations SET {assignments} "
                    "WHERE name = :name"
                ),
                parameters,
            )


if __name__ == "__main__":
    migrate_destination_details()
