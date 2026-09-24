from app.core.database import SessionLocal
from app.models.traveler import Traveler
from app.models.destination import Destination

db = SessionLocal()

db.query(Traveler).delete()
db.query(Destination).delete()

travelers = [
    Traveler(name="Alice", budget_max=20000, date_start=5, date_end=20, interests="beach,culture"),
    Traveler(name="Bob", budget_max=19000, date_start=8, date_end=18, interests="nightlife,beach"),
    Traveler(name="Carol", budget_max=22000, date_start=16, date_end=30, interests="mountain,nature"),
]

destinations = [
    Destination(name="Goa", cost=15000, avail_start=5, avail_end=15, tags="beach,nightlife"),
    Destination(name="Manali", cost=18000, avail_start=12, avail_end=25, tags="mountain,adventure"),
    Destination(name="Kerala", cost=20000, avail_start=1, avail_end=10, tags="nature,culture,beach"),
]

db.add_all(travelers)
db.add_all(destinations)
db.commit()
db.close()

print("Seed data inserted successfully.")