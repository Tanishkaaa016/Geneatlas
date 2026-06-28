import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { SectionHead } from "./Dataset";
import metricsData from "@/data/metrics.json";
import type { MetricsPayload } from "@/lib/types";

const metrics = metricsData as MetricsPayload;
const { evaluation, baselines, calibration, dataset } = metrics;
const maxCell = Math.max(...evaluation.confusion_matrix.flat());
const accuracyPct = (evaluation.accuracy * 100).toFixed(1);

export function Results() {
  return (
    <section id="results" className="border-b border-border">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <SectionHead
          num="03"
          kicker="Results"
          title={`${accuracyPct}% held-out test accuracy across ${evaluation.class_codes.length} subtypes.`}
        />
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Metrics exported from the trained TensorFlow model on a stratified 80/20 split (
          {dataset.test_size} test samples, {dataset.features.toLocaleString()} genes). Baselines
          trained on the identical split for fair comparison.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card title="Confusion matrix" subtitle="rows = true, cols = predicted">
            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-1 text-center text-xs">
                <thead>
                  <tr>
                    <th />
                    {evaluation.class_codes.map((code) => (
                      <th key={code} className="px-2 py-1 font-mono text-[color:var(--rust)]">
                        {code}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {evaluation.confusion_matrix.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      <th className="pr-2 text-right font-mono text-[color:var(--rust)]">
                        {evaluation.class_codes[rowIndex]}
                      </th>
                      {row.map((value, colIndex) => {
                        const intensity = value / maxCell;
                        const isDiag = rowIndex === colIndex;
                        return (
                          <td
                            key={colIndex}
                            className="h-12 w-12 rounded-sm font-mono"
                            style={{
                              background: isDiag
                                ? `oklch(0.28 0.05 155 / ${0.15 + intensity * 0.75})`
                                : value > 0
                                  ? `oklch(0.58 0.14 40 / ${0.15 + intensity * 0.5})`
                                  : "oklch(0.93 0.022 92)",
                              color: isDiag && intensity > 0.5 ? "var(--cream)" : "var(--ink)",
                            }}
                          >
                            {value}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card title="Per-class metrics" subtitle="precision · recall · F1 · AUC">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="py-2">Class</th>
                  <th className="py-2 text-right">Prec</th>
                  <th className="py-2 text-right">Rec</th>
                  <th className="py-2 text-right">F1</th>
                  <th className="py-2 text-right">AUC</th>
                </tr>
              </thead>
              <tbody>
                {evaluation.per_class.map((row) => (
                  <tr key={row.code} className="border-t border-border/60 font-mono">
                    <td className="py-2 text-[color:var(--rust)]">{row.code}</td>
                    <td className="py-2 text-right">{row.precision.toFixed(2)}</td>
                    <td className="py-2 text-right">{row.recall.toFixed(2)}</td>
                    <td className="py-2 text-right">{row.f1.toFixed(2)}</td>
                    <td className="py-2 text-right">{row.auc.toFixed(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <Card title="Baseline comparison" subtitle="same split, same features">
            <ul className="space-y-3">
              {baselines.map((baseline) => {
                const isOurs = baseline.model.includes("GeneAtlas");
                return (
                  <li key={baseline.model}>
                    <div className="flex items-baseline justify-between text-sm">
                      <span className={isOurs ? "font-semibold text-primary" : "text-foreground"}>
                        {baseline.model}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">
                        acc {(baseline.accuracy * 100).toFixed(1)}% · F1 {baseline.f1.toFixed(2)}
                      </span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${baseline.accuracy * 100}%`,
                          background: isOurs
                            ? "var(--forest)"
                            : "oklch(0.45 0.08 150 / 0.55)",
                        }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </Card>

          <Card title="Calibration" subtitle="confidence vs. accuracy bins">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={calibration} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                <CartesianGrid stroke="oklch(0.86 0.02 90)" vertical={false} />
                <XAxis dataKey="bin" stroke="oklch(0.42 0.025 150)" fontSize={10} />
                <YAxis stroke="oklch(0.42 0.025 150)" fontSize={11} domain={[0, 1]} />
                <Tooltip
                  contentStyle={{
                    background: "var(--cream)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 6,
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="confidence" fill="oklch(0.58 0.14 40)" name="mean confidence" />
                <Bar dataKey="accuracy" fill="oklch(0.28 0.05 155)" name="accuracy" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </section>
  );
}

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-md border border-border bg-card p-5">
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="font-display text-xl text-primary">{title}</h3>
        {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
      </div>
      {children}
    </div>
  );
}
