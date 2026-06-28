type Biomarker = {
  gene: string;
  importance: number;
};

type Props = {
  biomarkers: Biomarker[];
};

export default function BiomarkerCard({
  biomarkers,
}: Props) {
  if (!biomarkers.length) return null;

  const maxImportance = Math.max(
    ...biomarkers.map((g) => g.importance)
  );

  return (
    <div className="mt-6 rounded-xl border p-6">

      <h3 className="text-2xl font-bold mb-6">
        🧬 Top Biomarkers
      </h3>

      {biomarkers.map((gene, index) => (

        <div
          key={gene.gene}
          className="mb-5"
        >

          <div className="flex justify-between">

            <span className="font-medium">
              {index + 1}. {gene.gene}
            </span>

            <span>
              {gene.importance.toFixed(5)}
            </span>

          </div>

          <div className="mt-2 h-2 rounded-full bg-gray-200">

            <div
              className="h-2 rounded-full bg-blue-600 transition-all"
              style={{
                width: `${
                  (gene.importance / maxImportance) * 100
                }%`,
              }}
            />

          </div>

        </div>

      ))}

    </div>
  );
}