from app.core.database import Base, engine
from app.models.traveler import Traveler
from app.models.destination import Destination

Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)
print("Tables recreated successfully.")