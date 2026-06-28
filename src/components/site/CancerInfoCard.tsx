import { cancerInfo } from "@/lib/cancerInfo";

type Props = {
  prediction: string;
};

export default function CancerInfoCard({
  prediction,
}: Props) {
  if (!prediction || !cancerInfo[prediction]) return null;

  const info = cancerInfo[prediction];

  return (
    <div className="mt-6 rounded-xl border bg-card p-6 shadow-sm">

      <h3 className="text-2xl font-bold mb-5">
        📖 About this Cancer
      </h3>

      <p className="leading-7 text-muted-foreground">
        {info.description}
      </p>

      <div className="mt-6">

        <h4 className="font-semibold mb-3">
          Common Biomarkers
        </h4>

        <div className="flex flex-wrap gap-2">

          {info.biomarkers.map((gene) => (

            <span
              key={gene}
              className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700"
            >
              {gene}
            </span>

          ))}

        </div>

      </div>

      <div className="mt-6 rounded-xl bg-muted p-4">

        <p className="text-sm text-muted-foreground">
          TCGA Training Samples
        </p>

        <p className="text-3xl font-bold">
          {info.tcgaSamples}
        </p>

      </div>

    </div>
  );
}