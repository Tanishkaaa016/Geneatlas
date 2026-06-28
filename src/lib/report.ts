import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { ClinicalContext } from "@/lib/types";

type Biomarker = {
  gene: string;
  importance: number;
};

export function generateReport(
  prediction: string,
  confidence: number,
  probabilities: Record<string, number>,
  biomarkers: Biomarker[],
  clinical?: ClinicalContext,
) {
  const pdf = new jsPDF();

  pdf.setFillColor(22, 119, 255);
  pdf.rect(0, 0, 210, 35, "F");

  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(24);
  pdf.text("GeneAtlas", 20, 20);

  pdf.setFontSize(12);
  pdf.text("Cancer Classification Report", 20, 29);

  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(11);
  pdf.text(`Generated: ${new Date().toLocaleString()}`, 20, 45);

  pdf.setDrawColor(22, 119, 255);
  pdf.roundedRect(15, 55, 180, 35, 3, 3);

  pdf.setFontSize(18);
  pdf.setFont("helvetica", "bold");
  pdf.text("Prediction", 20, 68);

  pdf.setFontSize(15);
  pdf.setFont("helvetica", "normal");
  pdf.text(prediction, 20, 79);
  pdf.text(`Confidence: ${(confidence * 100).toFixed(2)}%`, 20, 87);

  if (clinical) {
    pdf.setFontSize(10);
    pdf.text(`Uncertainty: ${clinical.uncertainty_level}`, 120, 79);
    pdf.text(`Entropy: ${clinical.entropy.toFixed(3)}`, 120, 87);
  }

  autoTable(pdf, {
    startY: 100,
    head: [["Cancer Type", "Probability"]],
    body: Object.entries(probabilities)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => [name, `${(value * 100).toFixed(2)}%`]),
    headStyles: { fillColor: [22, 119, 255] },
  });

  autoTable(pdf, {
    startY: (pdf as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10,
    head: [["Biomarker", "SHAP Importance"]],
    body: biomarkers.map((biomarker) => [
      biomarker.gene,
      biomarker.importance.toFixed(5),
    ]),
    headStyles: { fillColor: [16, 185, 129] },
  });

  if (clinical) {
    autoTable(pdf, {
      startY: (pdf as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10,
      head: [["Clinical Decision Support", ""]],
      body: [
        ["Recommended tests", clinical.recommended_tests.join("; ")],
        ["Therapeutic targets", clinical.therapeutic_targets.join(", ")],
        ["Standard of care", clinical.standard_of_care],
        ["Follow-up", clinical.follow_up],
      ],
      headStyles: { fillColor: [100, 100, 100] },
      columnStyles: { 0: { cellWidth: 45 } },
    });
  }

  pdf.setFontSize(10);
  pdf.setTextColor(100);
  pdf.text("Research Use Only • Not a diagnostic device • GeneAtlas MI Research Platform", 20, 285);

  pdf.save("GeneAtlas_Report.pdf");
}
