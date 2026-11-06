"""Combine weather and demo ML outputs into optimizer penalty inputs."""
from datetime import date
from typing import Any

from app.ml.models import predict_crowd_and_disruption
from app.ml.weather import weather_suitability


def score_destination(
    destination_name: str,
    destination_info: dict[str, Any],
    *,
    forecast_date: date | None = None,
    month: int | None = None,
) -> dict[str, Any]:
    """Return normalized component scores and a 0-100 aggregate penalty.

    Until the API accepts actual trip dates, callers should leave forecast_date
    unset; weather will be neutral and clearly marked unavailable.
    """
    weather = weather_suitability(destination_name, forecast_date)
    features = predict_crowd_and_disruption(
        month=month or date.today().month,
        weekend=False,
        holiday=False,
        # Use forecast inputs when available; otherwise use neutral defaults.
        rain_probability=(
            weather["precipitation_probability_max"]
            if weather["precipitation_probability_max"] is not None else 50.0
        ),
        temperature_max=(
            weather["temperature_max"]
            if weather["temperature_max"] is not None else 25.0
        ),
    )

    # Higher is worse for all three penalty components.
    weather_penalty = 100.0 - float(weather["score"])
    crowd_penalty = features["crowd_score"]
    disruption_penalty = features["disruption_score"]
    total_penalty = (
        0.25 * weather_penalty
        + 0.35 * crowd_penalty
        + 0.40 * disruption_penalty
    )
    return {
        "weather_suitability": round(float(weather["score"]), 2),
        "weather_available": bool(weather["available"]),
        "crowd_score": features["crowd_score"],
        "disruption_score": features["disruption_score"],
        "penalty": round(total_penalty, 2),
        "scoring_note": (
            "Crowd and disruption scores use synthetic training labels; "
            "they are demonstration estimates, not validated real-world predictions."
        ),
    }
