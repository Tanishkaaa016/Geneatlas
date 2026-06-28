import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { SectionHead } from "./Dataset";
import survivalData from "@/data/survival.json";
import type { SurvivalPayload } from "@/lib/types";

const survival = survivalData as SurvivalPayload;

export function Survival() {
  return (
    <section id="survival" className="border-b border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <SectionHead
          num="06"
          kicker="Prognosis context"
          title="Subtype-level survival outlook (TCGA literature)."
        />
        <p className="mt-4 max-w-3xl text-muted-foreground">
          {survival.disclaimer} Source: {survival.source}.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {survival.curves.map((curve) => (
            <div key={curve.code} className="rounded-md border border-border bg-card p-5">
              <div className="mb-4 flex items-baseline justify-between">
                <h3 className="font-display text-xl text-primary">{curve.code}</h3>
                <span className="text-xs text-muted-foreground">{curve.label}</span>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    Median OS
                  </p>
                  <p className="font-mono text-2xl">{curve.median_months} mo</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    5-year survival
                  </p>
                  <p className="font-mono text-2xl">
                    {(curve.five_year_survival * 100).toFixed(0)}%
                  </p>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={curve.points} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                  <CartesianGrid stroke="oklch(0.86 0.02 90)" vertical={false} />
                  <XAxis
                    dataKey="months"
                    stroke="oklch(0.42 0.025 150)"
                    fontSize={11}
                    label={{ value: "months", position: "insideBottom", offset: -5, fontSize: 10 }}
                  />
                  <YAxis
                    stroke="oklch(0.42 0.025 150)"
                    fontSize={11}
                    domain={[0, 1]}
                    tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                  />
                  <Tooltip
                    formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, "survival"]}
                    contentStyle={{
                      background: "var(--cream)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 6,
                      fontSize: 12,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line
                    type="monotone"
                    dataKey="survival"
                    stroke="var(--forest)"
                    strokeWidth={2}
                    dot={false}
                    name="overall survival"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
