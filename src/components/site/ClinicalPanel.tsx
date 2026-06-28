import type { ClinicalContext } from "@/lib/types";

const levelStyles: Record<
  ClinicalContext["uncertainty_level"],
  { badge: string; border: string }
> = {
  high: {
    badge: "bg-[color:var(--forest)]/15 text-[color:var(--forest)]",
    border: "border-[color:var(--forest)]/30",
  },
  moderate: {
    badge: "bg-amber-500/15 text-amber-700",
    border: "border-amber-500/30",
  },
  low: {
    badge: "bg-[color:var(--rust)]/15 text-[color:var(--rust)]",
    border: "border-[color:var(--rust)]/30",
  },
};

type Props = {
  clinical: ClinicalContext;
};

export function ClinicalPanel({ clinical }: Props) {
  const styles = levelStyles[clinical.uncertainty_level];

  return (
    <div className={`mt-6 rounded-md border bg-card p-6 ${styles.border}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-display text-xl text-primary">Clinical decision support</h3>
        <span
          className={`rounded-full px-3 py-1 font-mono text-xs uppercase tracking-wider ${styles.badge}`}
        >
          {clinical.uncertainty_level} confidence
        </span>
      </div>

      <p className="mt-3 text-sm text-muted-foreground">{clinical.uncertainty_message}</p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <h4 className="text-xs uppercase tracking-wider text-muted-foreground">
            Recommended confirmatory tests
          </h4>
          <ul className="mt-2 space-y-1 text-sm">
            {clinical.recommended_tests.map((test) => (
              <li key={test} className="flex gap-2">
                <span className="text-[color:var(--rust)]">→</span>
                {test}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-wider text-muted-foreground">
            Therapeutic targets to review
          </h4>
          <div className="mt-2 flex flex-wrap gap-2">
            {clinical.therapeutic_targets.map((target) => (
              <span
                key={target}
                className="rounded-full border border-border bg-background px-3 py-1 font-mono text-xs"
              >
                {target}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-3 text-sm">
        <p>
          <span className="font-medium text-primary">Standard of care context: </span>
          {clinical.standard_of_care}
        </p>
        <p>
          <span className="font-medium text-primary">Follow-up: </span>
          {clinical.follow_up}
        </p>
      </div>

      <p className="mt-4 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {clinical.disclaimer}
      </p>
    </div>
  );
}
