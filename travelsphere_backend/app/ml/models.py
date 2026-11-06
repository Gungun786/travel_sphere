"""Synthetic XGBoost models for demo-only crowd and disruption estimates.

These models are a plumbing/demo baseline. Their synthetic labels are NOT real
crowd or disruption data and their outputs must not be presented as validated
real-world predictions. Replace the synthetic training data when credible data
becomes available.
"""
from __future__ import annotations

import numpy as np
from xgboost import XGBRegressor

FEATURE_NAMES = ["month", "weekend", "holiday", "rain_probability", "temperature_max"]


def _build_models() -> tuple[XGBRegressor, XGBRegressor]:
    rng = np.random.default_rng(42)
    n = 1200
    X = np.column_stack([
        rng.integers(1, 13, n),              # month
        rng.integers(0, 2, n),               # weekend
        rng.integers(0, 2, n),               # holiday
        rng.uniform(0, 100, n),              # precipitation probability
        rng.uniform(5, 42, n),               # max temperature
    ]).astype(float)

    month, weekend, holiday, rain, temp = X.T
    # Synthetic patterns, deliberately simple and only for demonstrating the pipeline.
    crowd_y = np.clip(
        15 + 3.5 * weekend + 9 * holiday
        + 18 * np.isin(month, [4, 5, 10, 11, 12])
        + rng.normal(0, 8, n), 0, 100
    )
    disruption_y = np.clip(
        8 + 0.55 * rain + 0.7 * np.maximum(temp - 34, 0)
        + 0.5 * np.maximum(10 - temp, 0)
        + rng.normal(0, 7, n), 0, 100
    )

    common = dict(
        n_estimators=80,
        max_depth=3,
        learning_rate=0.06,
        objective="reg:squarederror",
        n_jobs=1,
        random_state=42,
    )
    crowd_model = XGBRegressor(**common)
    disruption_model = XGBRegressor(**common)
    crowd_model.fit(X, crowd_y)
    disruption_model.fit(X, disruption_y)
    return crowd_model, disruption_model


# Fit once when this module is imported, not on every API request.
CROWD_MODEL, DISRUPTION_MODEL = _build_models()


def predict_crowd_and_disruption(
    month: int,
    weekend: bool = False,
    holiday: bool = False,
    rain_probability: float = 50.0,
    temperature_max: float = 25.0,
) -> dict[str, float]:
    """Return demo scores from 0-100 using the synthetic models."""
    row = np.array([[
        max(1, min(12, int(month))),
        int(weekend),
        int(holiday),
        max(0.0, min(100.0, float(rain_probability))),
        float(temperature_max),
    ]], dtype=float)

    crowd = float(CROWD_MODEL.predict(row)[0])
    disruption = float(DISRUPTION_MODEL.predict(row)[0])
    return {
        "crowd_score": round(max(0.0, min(100.0, crowd)), 2),
        "disruption_score": round(max(0.0, min(100.0, disruption)), 2),
    }
