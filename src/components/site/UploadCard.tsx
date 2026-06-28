import { useRef, useState } from "react";
import Papa from "papaparse";
import BiomarkerCard from "./BiomarkerCard";
import CancerInfoCard from "./CancerInfoCard";
import ProbabilityChart from "./ProbabilityChart";
import PredictionCard from "./PredictionCard";
import { ClinicalPanel } from "./ClinicalPanel";
import type { ClinicalContext, PredictionResult } from "@/lib/types";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

type CsvRow = Record<string, string>;

export default function UploadCard() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [rows, setRows] = useState<CsvRow[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);

  const [isValid, setIsValid] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [probabilities, setProbabilities] = useState<Record<string, number>>({});
  const [biomarkers, setBiomarkers] = useState<
    { gene: string; importance: number }[]
  >([]);
  const [clinical, setClinical] = useState<ClinicalContext | null>(null);

  function handleFile(selected: File) {
    const validFile =
      selected.name.endsWith(".csv") ||
      selected.name.endsWith(".tsv");

    if (!validFile) {
      alert("Please upload a CSV or TSV file.");
      return;
    }

    setFile(selected);

    Papa.parse<CsvRow>(selected, {
      header: true,
      skipEmptyLines: true,

      complete: (results) => {
        const parsedRows = results.data;

        setRows(parsedRows);

        const cols = results.meta.fields ?? [];
        setColumns(cols);

        if (parsedRows.length < 1) {
          setIsValid(false);
          setValidationMessage(
            "Dataset contains no samples."
          );
            return;
        }

        if (cols.length < 2) {
          setIsValid(false);
          setValidationMessage(
            "No valid expression columns detected."
          );
          return;
        }

        setIsValid(true);
        setValidationMessage(
          "RNA-Seq dataset validated successfully."
        );
      },

      error: () => {
        alert("Unable to read file.");
      },
    });
  }

  async function analyzeSample() {
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/classify", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!result.success) {
        alert(result.error ?? "Prediction failed");
        return;
      }

      const row = result.results[0] as PredictionResult;

      setPrediction(row.prediction);
      setConfidence(row.confidence);
      setProbabilities(row.probabilities);
      setBiomarkers(
        (row.biomarkers ?? []).map((gene) => ({
          gene: gene.gene,
          importance: gene.importance ?? gene.shap ?? 0,
        })),
      );
      setClinical(row.clinical ?? null);

    } catch (error) {

      console.error(error);
      alert("Could not connect to GeneAtlas API.");

    } finally {

      setLoading(false);

    }
  }

  return (
    <div className="rounded-3xl border bg-card p-8 shadow-sm">

      <h2 className="text-2xl font-semibold">
        Upload RNA-Seq Sample
      </h2>

      <p className="mt-2 text-muted-foreground">
        Upload a bulk RNA-Seq expression matrix to classify
        cancer subtype using GeneAtlas.
      </p>

      <div
        className={`mt-8 rounded-2xl border-2 border-dashed p-12 text-center transition cursor-pointer ${
          dragging
            ? "border-primary bg-primary/5"
            : "border-border"
        }`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);

          if (e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
          }
        }}
      >
        <UploadCloud
          className="mx-auto mb-4 text-primary"
          size={60}
        />

        <h3 className="text-lg font-semibold">
          Drag & Drop CSV / TSV
        </h3>

        <p className="mt-2 text-muted-foreground">
          or click to browse
        </p>

        <input
          hidden
          ref={inputRef}
          type="file"
          accept=".csv,.tsv"
          onChange={(e) => {
            if (e.target.files?.length) {
              handleFile(e.target.files[0]);
            }
          }}
        />
      </div>

      {file && (
        <div className="mt-6 flex items-center gap-4 rounded-xl border bg-muted/40 p-4">
          <FileText className="text-primary" />

          <div className="flex-1">
            <p className="font-medium">
              {file.name}
            </p>

            <p className="text-sm text-muted-foreground">
              {(file.size / 1024).toFixed(1)} KB
            </p>
          </div>

          <CheckCircle2 className="text-green-500" />
        </div>
      )}

      {rows.length > 0 && (
        <>
          <div className="mt-8 rounded-xl border p-6">

            <h3 className="text-lg font-semibold">
              Dataset Summary
            </h3>

            <div className="mt-5 grid grid-cols-2 gap-6">

              <div>
                <p className="text-sm text-muted-foreground">
                  Rows
                </p>

                <p className="text-3xl font-bold">
                  {rows.length}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Columns
                </p>

                <p className="text-3xl font-bold">
                  {columns.length}
                </p>
              </div>

            </div>
          </div>

          <div
            className={`mt-6 flex items-start gap-3 rounded-xl border p-4 ${
              isValid
                ? "border-green-500 bg-green-50"
                : "border-red-500 bg-red-50"
            }`}
          >
            <AlertCircle />

            <div>
              <p className="font-semibold">
                {isValid
                  ? "Ready for Analysis"
                  : "Validation Failed"}
              </p>

              <p className="text-sm">
                {validationMessage}
              </p>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto rounded-xl border">

            <table className="w-full text-sm">

              <thead className="bg-muted">

                <tr>
                  {columns.slice(0, 6).map((column) => (
                    <th
                      key={column}
                      className="border-b p-3 text-left"
                    >
                      {column}
                    </th>
                  ))}
                </tr>

              </thead>

              <tbody>

                {rows.slice(0, 5).map((row, index) => (

                  <tr key={index}>

                    {columns.slice(0, 6).map((column) => (
                      <td
                        key={column}
                        className="border-b p-3"
                      >
                        {row[column]}
                      </td>
                    ))}

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          <button
            onClick={analyzeSample}
            disabled={!isValid || loading}
            className={`mt-8 w-full rounded-xl py-3 font-semibold transition ${
              isValid
                ? "bg-primary text-primary-foreground hover:opacity-90"
                : "cursor-not-allowed bg-muted text-muted-foreground"
            }`}
          >
            {loading ? "Analyzing..." : "Analyze Sample"}
          </button>
          {prediction && (
            <>
              <PredictionCard
                prediction={prediction}
                confidence={confidence}
                probabilities={probabilities}
                biomarkers={biomarkers}
              />


              <ProbabilityChart
                probabilities={probabilities}
              />

             <BiomarkerCard
                biomarkers={biomarkers}
              />

            <CancerInfoCard prediction={prediction} />

              {clinical && <ClinicalPanel clinical={clinical} />}
            </>
          )}

        </>
      )}
    </div>
  );
}