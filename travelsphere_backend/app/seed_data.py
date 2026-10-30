from app.core.database import SessionLocal
from app.models.traveler import Traveler
from app.models.destination import Destination

TRAVELERS = [
    Traveler(name="Alice", budget_max=20000, date_start=156, date_end=171, interests="beach,culture"),
    Traveler(name="Bob", budget_max=19000, date_start=159, date_end=169, interests="nightlife,beach"),
    Traveler(name="Carol", budget_max=22000, date_start=167, date_end=181, interests="mountain,nature"),
]

DESTINATIONS = [
    Destination(name="Goa", slug="goa", state="Goa", description="A coastal state known for beaches, Portuguese-influenced heritage, and lively markets.", best_season="November to February", top_places=[{"name": "Baga Beach", "note": "Popular beach for water activities and evening markets."}, {"name": "Panaji", "note": "State capital with Latin Quarter streets and riverside views."}, {"name": "Old Goa", "note": "Historic churches and monuments from the Portuguese era."}], daily_budget_min=2500, daily_budget_max=7000, image_url=None, cost=15000, avail_start=156, avail_end=166, tags="beach,nightlife"),
    Destination(name="Manali", slug="manali", state="Himachal Pradesh", description="A Himalayan town with mountain valleys, cedar forests, and access to high-altitude routes.", best_season="March to June and October to February", top_places=[{"name": "Solang Valley", "note": "Mountain valley popular for outdoor activities."}, {"name": "Old Manali", "note": "Walkable area with cafes and traditional village character."}, {"name": "Hadimba Temple", "note": "Wooden temple set among cedar trees."}], daily_budget_min=2500, daily_budget_max=7000, image_url=None, cost=18000, avail_start=163, avail_end=176, tags="mountain,adventure"),
    Destination(name="Kerala", slug="kerala", state="Kerala", description="A southwestern state known for backwaters, tropical coastlines, and hill-country tea plantations.", best_season="September to March", top_places=[{"name": "Alappuzha", "note": "Gateway to Kerala's backwater houseboat routes."}, {"name": "Munnar", "note": "Hill station surrounded by tea estates."}, {"name": "Fort Kochi", "note": "Historic waterfront district with layered trading influences."}], daily_budget_min=2500, daily_budget_max=7500, image_url=None, cost=20000, avail_start=152, avail_end=161, tags="nature,culture,beach"),
    Destination(name="Jaipur", slug="jaipur", state="Rajasthan", description="The Pink City, known for Rajput-era forts, palaces, crafts, and regional cuisine.", best_season="October to March", top_places=[{"name": "Amber Fort", "note": "Hilltop fort complex with courtyards and palaces."}, {"name": "City Palace", "note": "Royal complex with museums and ceremonial courtyards."}, {"name": "Hawa Mahal", "note": "Iconic pink sandstone facade in the old city."}], daily_budget_min=2200, daily_budget_max=6500, image_url=None, cost=18000, avail_start=274, avail_end=365, tags="Historical,Food,Shopping"),
    Destination(name="Rishikesh", slug="rishikesh", state="Uttarakhand", description="A riverside city at the Himalayan foothills associated with yoga, ashrams, and rafting.", best_season="September to April", top_places=[{"name": "Laxman Jhula area", "note": "Riverside neighborhood with temples, cafes, and views."}, {"name": "Triveni Ghat", "note": "Ghat known for its evening river ceremony."}, {"name": "Rajaji National Park", "note": "Nearby protected area with forest and wildlife habitats."}], daily_budget_min=1800, daily_budget_max=5500, image_url=None, cost=16000, avail_start=60, avail_end=151, tags="Trekking,Mountains,Wildlife"),
    Destination(name="Meghalaya", slug="meghalaya", state="Meghalaya", description="A northeastern hill state with forests, waterfalls, caves, and living root bridges.", best_season="October to May", top_places=[{"name": "Shillong", "note": "Hill capital with lakes, viewpoints, and cultural sites."}, {"name": "Cherrapunji", "note": "Highland area known for waterfalls and limestone caves."}, {"name": "Nongriat", "note": "Village area reached by a trek to a living root bridge."}], daily_budget_min=2200, daily_budget_max=6500, image_url=None, cost=22000, avail_start=1, avail_end=90, tags="Trekking,Mountains,Wildlife"),
]


def seed():
    db = SessionLocal()
    try:
        db.query(Traveler).delete()
        db.query(Destination).delete()
        db.add_all(TRAVELERS)
        db.add_all(DESTINATIONS)
        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    seed()
    print("Seed data inserted successfully.")
