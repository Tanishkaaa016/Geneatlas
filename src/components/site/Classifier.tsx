import { useState } from "react";
import { SectionHead } from "./Dataset";

type PredictionResponse = {
  prediction?: string;
  predicted_class?: string;
  label?: string;
  confidence?: number;
  probabilities?: Record<string, number>;
  probs?: Record<string, number>;
  top_genes?: { gene: string; shap: number }[];
  error?: string;
  [k: string]: unknown;
};

const SUBTYPES = ["BRCA", "KIRC", "LUAD", "PRAD", "COAD"];

export function Classifier() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [csvName, setCsvName] = useState<string | null>(null);
  const [csvPreview, setCsvPreview] = useState<string | null>(null);

  async function runDemo() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const r = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "demo", csv: csvPreview ?? null }),
      });
      const text = await r.text();
      let json: PredictionResponse;
      try {
        json = JSON.parse(text);
      } catch {
        json = { error: text.slice(0, 200) };
      }
      if (!r.ok || json.error) {
        setError(json.error || `Upstream error ${r.status}`);
      } else {
        setResult(json);
      }
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setCsvName(f.name);
    const reader = new FileReader();
    reader.onload = () => setCsvPreview(String(reader.result).slice(0, 4000));
    reader.readAsText(f);
  }

  const pred =
    result?.prediction || result?.predicted_class || result?.label || "—";
  const confidence = typeof result?.confidence === "number" ? result.confidence : null;
  const probs = result?.probabilities || result?.probs || null;

  return (
    <section id="classifier" className="border-b border-border">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <SectionHead
          num="05"
          kicker="Live Classifier"
          title="Run a prediction against the live model."
        />
        <p className="mt-4 max-w-2xl text-muted-foreground">
          This page proxies your browser request server-side to{" "}
          <code className="font-mono text-xs text-[color:var(--rust)]">
            gene-classifier.onrender.com
          </code>
          . Cold starts on Render's free tier can take 30–60s.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Upload */}
          <div className="rounded-md border border-border bg-card p-6">
            <div className="mb-4 flex items-baseline justify-between">
              <h3 className="font-display text-xl text-primary">01 · Upload sample</h3>
              <span className="font-mono text-xs text-muted-foreground">.csv</span>
            </div>

            <label className="block cursor-pointer rounded-md border border-dashed border-border bg-background p-8 text-center transition hover:border-primary/50">
              <input type="file" accept=".csv,text/csv" onChange={onFile} className="hidden" />
              <div className="text-3xl">🧬</div>
              <div className="mt-3 font-medium text-primary">
                {csvName ?? "Drop a gene expression CSV"}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                One row per sample · columns = gene names · log₂(RPKM+1)
              </div>
            </label>

            <button
              onClick={runDemo}
              disabled={loading}
              className="mt-6 w-full rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? "Analysing expression profile…" : csvName ? "Run prediction" : "Run demo"}
            </button>

            {!csvName && (
              <p className="mt-3 text-xs text-muted-foreground">
                No CSV? "Run demo" sends a synthetic sample.
              </p>
            )}
          </div>

          {/* Prediction */}
          <div className="rounded-md border border-border bg-card p-6">
            <div className="mb-4 flex items-baseline justify-between">
              <h3 className="font-display text-xl text-primary">02 · Prediction</h3>
              <span className="font-mono text-xs text-muted-foreground">
                {loading ? "running" : result ? "done" : error ? "error" : "idle"}
              </span>
            </div>

            {error && (
              <div className="rounded-md border border-[color:var(--rust)]/40 bg-[color:var(--rust)]/5 p-4 text-sm">
                <div className="font-medium text-[color:var(--rust)]">Upstream said:</div>
                <div className="mt-1 font-mono text-xs text-muted-foreground">{error}</div>
                <p className="mt-3 text-xs text-muted-foreground">
                  The Render service responded but the model weights may not be loaded
                  on this instance. Wake the service at{" "}
                  <a
                    href="https://gene-classifier.onrender.com"
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                  >
                    gene-classifier.onrender.com
                  </a>{" "}
                  and try again.
                </p>
              </div>
            )}

            {!error && (
              <>
                <div className="flex items-baseline gap-4">
                  <div className="font-display text-5xl text-primary">{pred}</div>
                  <div className="font-mono text-sm text-muted-foreground">
                    {confidence !== null
                      ? `${(confidence * 100).toFixed(1)}% confidence`
                      : result
                      ? ""
                      : "awaiting input"}
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    Class probabilities
                  </div>
                  {SUBTYPES.map((s) => {
                    const p =
                      probs && typeof probs[s] === "number" ? (probs[s] as number) : 0;
                    return (
                      <div key={s}>
                        <div className="flex justify-between font-mono text-xs">
                          <span className="text-[color:var(--rust)]">{s}</span>
                          <span>{(p * 100).toFixed(1)}%</span>
                        </div>
                        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary">
                          <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${p * 100}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {result?.top_genes && (
                  <div className="mt-6">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">
                      Top SHAP genes
                    </div>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {result.top_genes.map((g) => (
                        <li
                          key={g.gene}
                          className="rounded-full border border-border bg-background px-3 py-1 font-mono text-xs"
                        >
                          {g.gene}{" "}
                          <span className="text-[color:var(--rust)]">
                            {g.shap.toFixed(2)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
