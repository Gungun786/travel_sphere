from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import jwt
from sqlalchemy.orm import Session

from app.core.config import BACKEND_JWT_SECRET
from app.core.database import get_db
from app.models.user import User


bearer = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer),
    db: Session = Depends(get_db),
) -> User:
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Bearer authentication is required.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        claims = jwt.decode(
            credentials.credentials,
            BACKEND_JWT_SECRET,
            algorithms=["HS256"],
            issuer="travelsphere-web",
            audience="travelsphere-api",
        )
    except jwt.PyJWTError as error:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired backend token.",
            headers={"WWW-Authenticate": "Bearer"},
        ) from error

    google_sub = claims.get("sub")
    email = claims.get("email")
    if not isinstance(google_sub, str) or not google_sub or not isinstance(email, str) or not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Backend token is missing required user claims.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = db.query(User).filter(User.google_sub == google_sub).one_or_none()
    if user is None:
        user = User(
            google_sub=google_sub,
            email=email,
            name=claims.get("name"),
            picture=claims.get("picture"),
        )
        db.add(user)
    else:
        user.email = email
        user.name = claims.get("name")
        user.picture = claims.get("picture")

    db.commit()
    db.refresh(user)
    return user
