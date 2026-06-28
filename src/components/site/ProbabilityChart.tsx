import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Props = {
  probabilities: Record<string, number>;
};

export default function ProbabilityChart({
  probabilities,
}: Props) {
  const data = Object.entries(probabilities)
    .map(([name, value]) => ({
      cancer: name,
      probability: Number((value * 100).toFixed(2)),
    }))
    .sort((a, b) => b.probability - a.probability);

  return (
    <div className="mt-6 rounded-xl border p-6">

      <h3 className="text-xl font-bold mb-5">
        📊 Probability Distribution
      </h3>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
          <XAxis dataKey="cancer" />
          <YAxis />
          <Tooltip />
          <Bar
            dataKey="probability"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}