import { useRef, useState } from "react";
import { SectionHead } from "./Dataset";
import { ClinicalPanel } from "./ClinicalPanel";
import { generateReport } from "@/lib/report";
import type { ClinicalContext, PredictionResult } from "@/lib/types";

const SUBTYPES = ["BRCA", "COAD", "KIRC", "LUAD", "PRAD"];

function parseApiResponse(json: unknown): PredictionResult | null {
  if (!json || typeof json !== "object") return null;
  const payload = json as Record<string, unknown>;

  if (payload.error && typeof payload.error === "string") {
    return { prediction: "", confidence: 0, probabilities: {}, error: payload.error };
  }

  const results = payload.results as Record<string, unknown>[] | undefined;
  const row = results?.[0] ?? payload;

  if (!row || typeof row !== "object") return null;

  const prediction = String(row.prediction ?? row.predicted_class ?? row.label ?? "");
  const confidence = Number(row.confidence ?? 0);
  const probabilities =
    (row.probabilities as Record<string, number>) ??
    (row.probs as Record<string, number>) ??
    {};

  const biomarkers = (row.biomarkers as PredictionResult["biomarkers"])?.map((gene) => ({
    gene: gene.gene,
    importance: gene.importance ?? gene.shap ?? 0,
    shap: gene.shap ?? gene.importance ?? 0,
  }));

  return {
    prediction,
    code: row.code as string | undefined,
    confidence,
    entropy: row.entropy as number | undefined,
    probabilities,
    probabilities_by_code: row.probabilities_by_code as Record<string, number> | undefined,
    biomarkers,
    clinical: row.clinical as ClinicalContext | undefined,
  };
}

export function Classifier() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  async function runPrediction(useDemo = false) {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let response: Response;

      if (useDemo || !file) {
        response = await fetch("/api/classify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mode: "demo" }),
        });
      } else {
        const formData = new FormData();
        formData.append("file", file);
        response = await fetch("/api/classify", { method: "POST", body: formData });
      }

      const json = await response.json();
      const parsed = parseApiResponse(json);

      if (!response.ok || !parsed || parsed.error) {
        setError(parsed?.error ?? json.error ?? `Upstream error ${response.status}`);
        return;
      }

      setResult(parsed);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  const probsByCode = result?.probabilities_by_code ?? {};
  const fallbackProbs = result?.probabilities ?? {};
  const predLabel = result?.prediction ?? "—";
  const predCode = result?.code ?? predLabel;
  const confidence = result?.confidence ?? null;
  const biomarkers =
    result?.biomarkers?.map((gene) => ({
      gene: gene.gene,
      importance: gene.importance ?? gene.shap ?? 0,
    })) ?? [];

  return (
    <section id="classifier" className="border-b border-border">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <SectionHead
          num="07"
          kicker="Live Classifier"
          title="Upload RNA-Seq and get an explainable subtype call."
        />
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Predictions run through a server-side proxy to the GeneAtlas FastAPI model with
          SHAP biomarkers and clinical decision-support context. CSV must contain Ensembl gene
          IDs matching the training panel (5000 genes).
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-md border border-border bg-card p-6">
            <div className="mb-4 flex items-baseline justify-between">
              <h3 className="font-display text-xl text-primary">01 · Upload sample</h3>
              <span className="font-mono text-xs text-muted-foreground">.csv</span>
            </div>

            <label className="block cursor-pointer rounded-md border border-dashed border-border bg-background p-8 text-center transition hover:border-primary/50">
              <input
                ref={inputRef}
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={(event) => {
                  const selected = event.target.files?.[0] ?? null;
                  setFile(selected);
                  setResult(null);
                  setError(null);
                }}
              />
              <div className="text-3xl">🧬</div>
              <div className="mt-3 font-medium text-primary">
                {file?.name ?? "Drop a gene expression CSV"}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                One row per sample · columns = Ensembl IDs · log₂(RPKM+1)
              </div>
            </label>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => runPrediction(false)}
                disabled={loading || !file}
                className="flex-1 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
              >
                {loading ? "Analysing…" : "Run prediction"}
              </button>
              <button
                onClick={() => runPrediction(true)}
                disabled={loading}
                className="flex-1 rounded-full border border-border px-5 py-3 text-sm font-medium transition hover:border-primary/50 disabled:opacity-50"
              >
                Run demo sample
              </button>
            </div>
          </div>

          <div className="rounded-md border border-border bg-card p-6">
            <div className="mb-4 flex items-baseline justify-between">
              <h3 className="font-display text-xl text-primary">02 · Prediction</h3>
              <span className="font-mono text-xs text-muted-foreground">
                {loading ? "running" : result ? "done" : error ? "error" : "idle"}
              </span>
            </div>

            {error && (
              <div className="rounded-md border border-[color:var(--rust)]/40 bg-[color:var(--rust)]/5 p-4 text-sm">
                <div className="font-medium text-[color:var(--rust)]">{error}</div>
                <p className="mt-3 text-xs text-muted-foreground">
                  For local development, start the API with{" "}
                  <code className="font-mono">uvicorn api:app --reload --port 8000</code> in{" "}
                  <code className="font-mono">model/</code> and set{" "}
                  <code className="font-mono">VITE_GENEATLAS_API_URL=http://127.0.0.1:8000</code>.
                </p>
              </div>
            )}

            {!error && (
              <>
                <div className="flex items-baseline gap-4">
                  <div className="font-display text-5xl text-primary">{predCode}</div>
                  <div className="font-mono text-sm text-muted-foreground">
                    {confidence !== null
                      ? `${(confidence * 100).toFixed(1)}% confidence`
                      : result
                        ? ""
                        : "awaiting input"}
                  </div>
                </div>
                {result?.prediction && (
                  <p className="mt-2 text-sm text-muted-foreground">{predLabel}</p>
                )}

                <div className="mt-6 space-y-2">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    Class probabilities
                  </div>
                  {SUBTYPES.map((code) => {
                    const fromCode = probsByCode[code];
                    const fromLabel = fallbackProbs[code];
                    const probability =
                      typeof fromCode === "number"
                        ? fromCode
                        : typeof fromLabel === "number"
                          ? fromLabel
                          : 0;

                    return (
                      <div key={code}>
                        <div className="flex justify-between font-mono text-xs">
                          <span className="text-[color:var(--rust)]">{code}</span>
                          <span>{(probability * 100).toFixed(1)}%</span>
                        </div>
                        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary">
                          <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${probability * 100}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {biomarkers.length > 0 && (
                  <div className="mt-6">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">
                      Top SHAP genes
                    </div>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {biomarkers.map((gene) => (
                        <li
                          key={gene.gene}
                          className="rounded-full border border-border bg-background px-3 py-1 font-mono text-xs"
                        >
                          {gene.gene}{" "}
                          <span className="text-[color:var(--rust)]">
                            {gene.importance.toFixed(3)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result && confidence !== null && (
                  <button
                    onClick={() =>
                      generateReport(
                        predLabel,
                        confidence,
                        fallbackProbs,
                        biomarkers,
                        result.clinical,
                      )
                    }
                    className="mt-6 w-full rounded-full border border-primary/30 bg-primary/5 px-5 py-3 text-sm font-medium text-primary transition hover:bg-primary/10"
                  >
                    Download PDF report
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {result?.clinical && <ClinicalPanel clinical={result.clinical} />}
      </div>
    </section>
  );
}
