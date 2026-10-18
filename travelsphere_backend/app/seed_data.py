from app.core.database import SessionLocal
from app.models.traveler import Traveler
from app.models.destination import Destination

db = SessionLocal()

db.query(Traveler).delete()
db.query(Destination).delete()

travelers = [
    Traveler(name="Alice", budget_max=20000, date_start=156, date_end=171, interests="beach,culture"),
    Traveler(name="Bob", budget_max=19000, date_start=159, date_end=169, interests="nightlife,beach"),
    Traveler(name="Carol", budget_max=22000, date_start=167, date_end=181, interests="mountain,nature"),
]

destinations = [
    Destination(name="Goa", cost=15000, avail_start=156, avail_end=166, tags="beach,nightlife"),
    Destination(name="Manali", cost=18000, avail_start=163, avail_end=176, tags="mountain,adventure"),
    Destination(name="Kerala", cost=20000, avail_start=152, avail_end=161, tags="nature,culture,beach"),
]

db.add_all(travelers)
db.add_all(destinations)
db.commit()
db.close()

print("Seed data inserted successfully.")