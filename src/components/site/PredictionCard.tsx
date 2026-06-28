import { generateReport } from "@/lib/report";

type Biomarker = {
  gene: string;
  importance: number;
};

type Props = {
  prediction: string;
  confidence: number;
  probabilities: Record<string, number>;
  biomarkers: Biomarker[];
};

export default function PredictionCard({
  prediction,
  confidence,
  probabilities,
  biomarkers,
}: Props) {
  if (!prediction) return null;

  return (
    <div className="mt-8 rounded-xl border border-green-300 bg-green-50 p-6">

      <h3 className="text-xl font-bold">
        Prediction
      </h3>

      <p className="mt-4 text-2xl font-semibold text-green-700">
        {prediction}
      </p>

      <p className="mt-2 text-muted-foreground">
        Confidence: {(confidence * 100).toFixed(2)}%
      </p>

      <button
        onClick={() =>
          generateReport(
            prediction,
            confidence,
            probabilities,
            biomarkers
          )
        }
        className="mt-6 rounded-xl bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 transition"
      >
        Download AI Report
      </button>

    </div>
  );
}