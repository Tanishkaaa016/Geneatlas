import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  CartesianGrid,
  ZAxis,
  Cell,
} from "recharts";

const classDist = [
  { code: "BRCA", n: 300, color: "oklch(0.28 0.05 155)" },
  { code: "KIRC", n: 146, color: "oklch(0.45 0.08 150)" },
  { code: "LUAD", n: 141, color: "oklch(0.58 0.14 40)" },
  { code: "PRAD", n: 136, color: "oklch(0.72 0.12 75)" },
  { code: "COAD", n: 78, color: "oklch(0.55 0.1 200)" },
];

/** Deterministic pseudo-PCA scatter (visual only). */
function genPCA() {
  const centers: Record<string, [number, number]> = {
    BRCA: [-2.4, 1.6],
    KIRC: [2.2, 1.9],
    LUAD: [1.8, -2.0],
    PRAD: [-2.6, -1.4],
    COAD: [0.2, 2.8],
  };
  let seed = 7;
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const data: { code: string; x: number; y: number; color: string }[] = [];
  classDist.forEach((c) => {
    const [cx, cy] = centers[c.code];
    for (let i = 0; i < Math.round(c.n / 4); i++) {
      data.push({
        code: c.code,
        color: c.color,
        x: cx + (rnd() - 0.5) * 2.4,
        y: cy + (rnd() - 0.5) * 2.4,
      });
    }
  });
  return data;
}
const pca = genPCA();

const sources = [
  { id: "TCGA-BRCA", desc: "Breast Invasive Carcinoma", n: 300, ref: "Koboldt et al. 2012" },
  { id: "TCGA-KIRC", desc: "Kidney Renal Clear Cell", n: 146, ref: "Creighton et al. 2013" },
  { id: "TCGA-LUAD", desc: "Lung Adenocarcinoma", n: 141, ref: "Collisson et al. 2014" },
  { id: "TCGA-PRAD", desc: "Prostate Adenocarcinoma", n: 136, ref: "Abeshouse et al. 2015" },
  { id: "TCGA-COAD", desc: "Colon Adenocarcinoma", n: 78, ref: "Muzny et al. 2012" },
];

export function Dataset() {
  return (
    <section id="dataset" className="border-b border-border">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <SectionHead num="01" kicker="Dataset" title="881 tumour samples, 20,531 genes." />
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Gene expression profiles from The Cancer Genome Atlas (TCGA), measured as
          log₂(RPKM+1). PCA reveals natural separation across five subtypes — the
          structure our model learns to amplify.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <ChartCard title="Class distribution" subtitle="samples per subtype">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={classDist} margin={{ top: 10, right: 8, bottom: 0, left: -16 }}>
                <CartesianGrid stroke="oklch(0.86 0.02 90)" vertical={false} />
                <XAxis dataKey="code" stroke="oklch(0.42 0.025 150)" fontSize={11} />
                <YAxis stroke="oklch(0.42 0.025 150)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: "var(--cream)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 6,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="n" radius={[3, 3, 0, 0]}>
                  {classDist.map((c) => (
                    <Cell key={c.code} fill={c.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="PCA · top 2 components"
            subtitle="20K → 2 dims, colored by subtype"
            className="lg:col-span-2"
          >
            <ResponsiveContainer width="100%" height={260}>
              <ScatterChart margin={{ top: 10, right: 8, bottom: 0, left: -16 }}>
                <CartesianGrid stroke="oklch(0.86 0.02 90)" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="PC1"
                  stroke="oklch(0.42 0.025 150)"
                  fontSize={11}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="PC2"
                  stroke="oklch(0.42 0.025 150)"
                  fontSize={11}
                />
                <ZAxis range={[40, 40]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  contentStyle={{
                    background: "var(--cream)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 6,
                    fontSize: 12,
                  }}
                />
                <Scatter data={pca}>
                  {pca.map((p, i) => (
                    <Cell key={i} fill={p.color} fillOpacity={0.72} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
              {classDist.map((c) => (
                <span key={c.code} className="flex items-center gap-1.5">
                  <span className="inline-block h-2 w-2 rounded-full" style={{ background: c.color }} />
                  {c.code}
                </span>
              ))}
            </div>
          </ChartCard>
        </div>

        <div className="mt-10 overflow-hidden rounded-md border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Source cohort</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3 text-right">n</th>
                <th className="px-4 py-3">Reference</th>
              </tr>
            </thead>
            <tbody>
              {sources.map((s) => (
                <tr key={s.id} className="border-t border-border/60">
                  <td className="px-4 py-3 font-mono text-xs text-[color:var(--rust)]">{s.id}</td>
                  <td className="px-4 py-3">{s.desc}</td>
                  <td className="px-4 py-3 text-right font-mono">{s.n}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s.ref}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export function SectionHead({ num, kicker, title }: { num: string; kicker: string; title: string }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
        <span className="font-mono text-[color:var(--rust)]">{num}</span>
        <span className="h-px w-8 bg-foreground/30" />
        {kicker}
      </div>
      <h2 className="max-w-3xl font-display text-4xl text-primary md:text-5xl">{title}</h2>
    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-md border border-border bg-card p-5 ${className}`}>
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="font-display text-xl text-primary">{title}</h3>
        {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
      </div>
      {children}
    </div>
  );
}
