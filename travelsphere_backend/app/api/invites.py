from datetime import datetime, timedelta
import secrets

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.access import get_trip_for_owner
from app.core.security import get_current_user
from app.models.trip import Trip, TripInvite, TripMember
from app.models.user import User
from app.schemas.trip import (
    TripInviteAcceptResponse,
    TripInviteCreate,
    TripInviteCreateResponse,
    TripInviteResponse,
)

router = APIRouter(tags=["invites"])


@router.post(
    "/api/trips/{trip_id}/invites",
    response_model=TripInviteCreateResponse,
)
def create_invite(
    trip_id: int,
    payload: TripInviteCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    trip = get_trip_for_owner(db, trip_id, user)

    member = (
        db.query(TripMember)
        .filter(TripMember.id == payload.member_id, TripMember.trip_id == trip_id)
        .one_or_none()
    )
    if member is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Member not found.")

    db.query(TripInvite).filter(
        TripInvite.member_id == member.id,
        TripInvite.used_at.is_(None),
    ).delete(synchronize_session=False)
    invite = TripInvite(
        trip_id=trip_id,
        member_id=member.id,
        token=secrets.token_urlsafe(32),
        email=payload.email.strip().lower() if payload.email else None,
    )
    db.add(invite)
    db.commit()
    return {"path": f"/invite/{invite.token}", "token": invite.token}


@router.get("/api/invites/{token}", response_model=TripInviteResponse)
def get_invite(token: str, db: Session = Depends(get_db)):
    invite = (
        db.query(TripInvite)
        .join(TripInvite.trip)
        .join(TripInvite.member)
        .filter(TripInvite.token == token)
        .one_or_none()
    )
    if invite is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invite not found.")

    return {
        "trip_name": invite.trip.name,
        "owner_name": invite.trip.owner.name or invite.trip.owner.email,
        "member_name": invite.member.name,
        "email_locked": invite.email is not None,
    }


@router.post(
    "/api/invites/{token}/accept",
    response_model=TripInviteAcceptResponse,
)
def accept_invite(
    token: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    invite = (
        db.query(TripInvite)
        .join(TripInvite.trip)
        .join(TripInvite.member)
        .filter(TripInvite.token == token)
        .one_or_none()
    )
    if (
        invite is None
        or invite.used_at is not None
        or datetime.utcnow() >= invite.created_at + timedelta(days=7)
    ):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invite not found.")

    if invite.trip.owner_id == user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The trip owner cannot accept their own invite.",
        )

    if invite.email is not None and invite.email.casefold() != user.email.casefold():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This invite is for a different Google account",
        )

    linked_member = (
        db.query(TripMember)
        .filter(
            TripMember.trip_id == invite.trip_id,
            TripMember.user_id == user.id,
        )
        .one_or_none()
    )
    if linked_member is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You are already linked to a member of this trip.",
        )

    invite.member.user_id = user.id
    invite.used_at = datetime.utcnow()
    db.commit()
    return {"trip_id": invite.trip_id}
