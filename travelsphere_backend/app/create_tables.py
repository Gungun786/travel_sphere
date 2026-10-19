from app.core.database import Base, engine
from app.models.traveler import Traveler
from app.models.destination import Destination
from app.models.user import User

Base.metadata.create_all(bind=engine)
print("Tables created successfully.")