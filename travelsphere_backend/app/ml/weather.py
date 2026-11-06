"""Open-Meteo weather suitability scoring.

Important: the current TravelSphere request schema does not provide a confirmed
trip date or destination coordinates. This module therefore only fetches a
forecast when an explicit forecast date is supplied. If data is unavailable,
it returns a neutral score rather than inventing weather conditions.
"""
from datetime import date, timedelta
from typing import Any

import httpx

# Starter mapping only. Add/verify coordinates for every supported destination.
DESTINATION_COORDINATES: dict[str, tuple[float, float]] = {
    "jaipur": (26.9124, 75.7873),
    "rishikesh": (30.0869, 78.2676),
    "meghalaya": (25.4670, 91.3662),  # Shillong used as a regional proxy
}

NEUTRAL_WEATHER_SCORE = 50.0  # 0 = poor conditions, 100 = suitable


def weather_suitability(
    destination_name: str,
    forecast_date: date | None = None,
    timeout_seconds: float = 5.0,
) -> dict[str, Any]:
    """Return a 0-100 weather suitability score and metadata.

    Open-Meteo forecast coverage is limited. If no date is provided, the
    destination is unknown, or the requested date is outside the forecast
    response, return a neutral score with available=False.
    """
    if forecast_date is None:
        return {
            "score": NEUTRAL_WEATHER_SCORE,
            "available": False,
            "reason": "No confirmed trip date supplied",
            "temperature_max": None,
            "precipitation_probability_max": None,
        }

    coords = DESTINATION_COORDINATES.get(destination_name.strip().lower())
    if coords is None:
        return {
            "score": NEUTRAL_WEATHER_SCORE,
            "available": False,
            "reason": "Destination coordinates are not configured",
            "temperature_max": None,
            "precipitation_probability_max": None,
        }

    # Open-Meteo's forecast API cannot provide arbitrary historical/far-future dates.
    today = date.today()
    if forecast_date < today or forecast_date > today + timedelta(days=15):
        return {
            "score": NEUTRAL_WEATHER_SCORE,
            "available": False,
            "reason": "Date is outside the supported forecast window",
            "temperature_max": None,
            "precipitation_probability_max": None,
        }

    latitude, longitude = coords
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "daily": "temperature_2m_max,precipitation_probability_max",
        "timezone": "auto",
        "start_date": forecast_date.isoformat(),
        "end_date": forecast_date.isoformat(),
    }

    try:
        response = httpx.get(
            "https://api.open-meteo.com/v1/forecast",
            params=params,
            timeout=timeout_seconds,
        )
        response.raise_for_status()
        payload = response.json()
        daily = payload.get("daily", {})
        temps = daily.get("temperature_2m_max") or []
        rain_probs = daily.get("precipitation_probability_max") or []
        if not temps or not rain_probs or temps[0] is None or rain_probs[0] is None:
            raise ValueError("Forecast response did not contain required daily fields")

        temperature = float(temps[0])
        rain_probability = float(rain_probs[0])

        # Transparent heuristic, not a trained weather model:
        # ideal temperature range gets full temperature points; extremes lose points.
        if 18 <= temperature <= 29:
            temperature_points = 60.0
        elif 12 <= temperature < 18 or 29 < temperature <= 34:
            temperature_points = 40.0
        else:
            temperature_points = 20.0

        rain_points = 40.0 * (1.0 - max(0.0, min(100.0, rain_probability)) / 100.0)
        score = max(0.0, min(100.0, temperature_points + rain_points))
        return {
            "score": round(score, 2),
            "available": True,
            "reason": None,
            "temperature_max": temperature,
            "precipitation_probability_max": rain_probability,
        }
    except (httpx.HTTPError, ValueError, KeyError, TypeError) as exc:
        return {
            "score": NEUTRAL_WEATHER_SCORE,
            "available": False,
            "reason": f"Weather data unavailable: {type(exc).__name__}",
            "temperature_max": None,
            "precipitation_probability_max": None,
        }
