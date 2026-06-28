"""Clinical decision-support helpers for GeneAtlas predictions."""

from __future__ import annotations

import math
from typing import Any

from constants import CANCER_LABELS, CLINICAL_GUIDANCE, UNCERTAINTY_THRESHOLDS


def prediction_entropy(probabilities: dict[str, float]) -> float:
    """Shannon entropy of the class probability vector (nats)."""
    total = 0.0
    for value in probabilities.values():
        if value > 0:
            total -= value * math.log(value)
    return total


def uncertainty_level(confidence: float, entropy: float) -> str:
    """Map confidence + entropy to a clinical triage band."""
    if confidence >= UNCERTAINTY_THRESHOLDS["high"] and entropy < 0.45:
        return "high"
    if confidence >= UNCERTAINTY_THRESHOLDS["moderate"]:
        return "moderate"
    return "low"


def uncertainty_message(level: str) -> str:
    messages = {
        "high": "High confidence — expression profile strongly matches this subtype. Still requires confirmatory clinical and molecular testing.",
        "moderate": "Moderate confidence — consider additional molecular profiling or expert review before clinical action.",
        "low": "Low confidence — prediction is ambiguous. Do not use for treatment decisions; repeat with validated assay or expert pathology review.",
    }
    return messages[level]


def get_clinical_context(label: str, confidence: float, probabilities: dict[str, float]) -> dict[str, Any]:
    """Build clinical decision-support payload for a prediction."""
    meta = CANCER_LABELS.get(label, {})
    guidance = CLINICAL_GUIDANCE.get(label, {})
    entropy = prediction_entropy(probabilities)
    level = uncertainty_level(confidence, entropy)

    return {
        "code": meta.get("code", label),
        "label": label,
        "confidence": confidence,
        "entropy": round(entropy, 4),
        "uncertainty_level": level,
        "uncertainty_message": uncertainty_message(level),
        "recommended_tests": guidance.get("recommended_tests", []),
        "therapeutic_targets": guidance.get("therapeutic_targets", []),
        "standard_of_care": guidance.get("standard_of_care", ""),
        "follow_up": guidance.get("follow_up", ""),
        "disclaimer": "Research decision-support prototype only. Not a diagnostic device.",
    }
