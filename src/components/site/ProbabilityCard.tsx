type Props = {
  probabilities: Record<string, number>;
};

export default function ProbabilityCard({
  probabilities,
}: Props) {
  return (
    <div className="mt-6 rounded-xl border p-6">

      <h3 className="text-xl font-bold mb-5">
        Class Probabilities
      </h3>

      {(Object.entries(probabilities) as [string, number][])
        .sort((a, b) => b[1] - a[1])
        .map(([name, value]) => (

          <div
            key={name}
            className="mb-4"
          >

            <div className="flex justify-between">

              <span>{name}</span>

              <span>
                {(value * 100).toFixed(2)}%
              </span>

            </div>

            <div className="mt-2 h-3 rounded-full bg-gray-200">

              <div
                className="h-3 rounded-full bg-green-600 transition-all"
                style={{
                  width: `${value * 100}%`,
                }}
              />

            </div>

          </div>

        ))}

    </div>
  );
}