import type { ClinicalContext } from "./types";

export const CLINICAL_GUIDANCE: Record<
  string,
  Omit<ClinicalContext, "code" | "label" | "confidence" | "entropy" | "uncertainty_level" | "uncertainty_message">
> = {
  "Breast Invasive Carcinoma": {
    recommended_tests: [
      "ER/PR immunohistochemistry",
      "HER2 (ERBB2) amplification testing",
      "Ki-67 proliferation index",
    ],
    therapeutic_targets: ["ERBB2", "ESR1", "CDK4/6 pathway"],
    standard_of_care:
      "Subtype-guided endocrine therapy, anti-HER2 therapy, or chemotherapy based on receptor status.",
    follow_up: "Confirmatory histopathology and receptor panel before treatment decisions.",
    disclaimer: "Research decision-support prototype only. Not a diagnostic device.",
  },
  "Kidney Clear Cell Carcinoma": {
    recommended_tests: [
      "VHL pathway assessment",
      "CA9 (carbonic anhydrase IX) IHC",
      "Staging imaging (CT/MRI)",
    ],
    therapeutic_targets: ["VEGF", "mTOR", "HIF pathway"],
    standard_of_care:
      "Surgical resection for localized disease; VEGF/IO combinations for advanced RCC.",
    follow_up: "Validate with radiology and histology; assess IMDC risk group.",
    disclaimer: "Research decision-support prototype only. Not a diagnostic device.",
  },
  "Lung Adenocarcinoma": {
    recommended_tests: [
      "EGFR mutation testing",
      "ALK/ROS1 fusion testing",
      "PD-L1 expression",
      "KRAS status if EGFR/ALK negative",
    ],
    therapeutic_targets: ["EGFR", "ALK", "KRAS G12C", "MET"],
    standard_of_care:
      "Molecular profiling drives TKI or immunotherapy selection in advanced disease.",
    follow_up: "Never treat on expression alone — confirm driver mutations.",
    disclaimer: "Research decision-support prototype only. Not a diagnostic device.",
  },
  "Prostate Adenocarcinoma": {
    recommended_tests: [
      "PSA trend and Gleason grade",
      "AR signalling assessment",
      "TMPRSS2-ERG fusion (where indicated)",
    ],
    therapeutic_targets: ["AR", "PARP (HRR-deficient)", "PSMA-directed therapy"],
    standard_of_care:
      "Risk-stratified active surveillance, ADT, or multimodal therapy.",
    follow_up: "Integrate PSA, grade group, and staging before systemic therapy.",
    disclaimer: "Research decision-support prototype only. Not a diagnostic device.",
  },
  "Colon Adenocarcinoma": {
    recommended_tests: ["MSI/MMR status", "KRAS/NRAS/BRAF mutation panel", "CEA baseline"],
    therapeutic_targets: ["EGFR (RAS wild-type)", "BRAF V600E", "MSI-high → immunotherapy"],
    standard_of_care:
      "Stage-dependent surgery ± adjuvant chemo; molecular profile guides metastatic therapy.",
    follow_up: "Confirm MSS/MSI and RAS status before anti-EGFR therapy.",
    disclaimer: "Research decision-support prototype only. Not a diagnostic device.",
  },
};

export function uncertaintyLevel(
  confidence: number,
  entropy: number,
): ClinicalContext["uncertainty_level"] {
  if (confidence >= 0.75 && entropy < 0.45) return "high";
  if (confidence >= 0.55) return "moderate";
  return "low";
}

export function uncertaintyMessage(level: ClinicalContext["uncertainty_level"]): string {
  const messages: Record<ClinicalContext["uncertainty_level"], string> = {
    high: "High confidence — expression profile strongly matches this subtype. Still requires confirmatory clinical testing.",
    moderate: "Moderate confidence — consider additional molecular profiling or expert review.",
    low: "Low confidence — prediction is ambiguous. Do not use for treatment decisions.",
  };
  return messages[level];
}

export function buildClinicalContext(
  label: string,
  confidence: number,
  entropy: number,
  code?: string,
): ClinicalContext {
  const guidance = CLINICAL_GUIDANCE[label];
  const level = uncertaintyLevel(confidence, entropy);

  return {
    code: code ?? label,
    label,
    confidence,
    entropy,
    uncertainty_level: level,
    uncertainty_message: uncertaintyMessage(level),
    recommended_tests: guidance?.recommended_tests ?? [],
    therapeutic_targets: guidance?.therapeutic_targets ?? [],
    standard_of_care: guidance?.standard_of_care ?? "",
    follow_up: guidance?.follow_up ?? "",
    disclaimer:
      guidance?.disclaimer ??
      "Research decision-support prototype only. Not a diagnostic device.",
  };
}
