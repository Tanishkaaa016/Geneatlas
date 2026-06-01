/**
 * Animated DNA double helix rendered with SVG.
 * Pure CSS animation — lightweight, no deps.
 */
export function Helix() {
  const rungs = Array.from({ length: 22 });
  return (
    <svg
      viewBox="0 0 200 420"
      className="h-full w-full"
      role="img"
      aria-label="DNA double helix"
    >
      <defs>
        <linearGradient id="strandA" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.45 0.08 150)" />
          <stop offset="100%" stopColor="oklch(0.28 0.05 155)" />
        </linearGradient>
        <linearGradient id="strandB" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.58 0.14 40)" />
          <stop offset="100%" stopColor="oklch(0.72 0.12 75)" />
        </linearGradient>
      </defs>

      {rungs.map((_, i) => {
        const y = 10 + i * 18;
        const phase = (i / rungs.length) * Math.PI * 4;
        const x1 = 100 + Math.sin(phase) * 60;
        const x2 = 100 - Math.sin(phase) * 60;
        const depth = (Math.cos(phase) + 1) / 2; // 0..1
        return (
          <g key={i} opacity={0.55 + depth * 0.45}>
            <line
              x1={x1}
              y1={y}
              x2={x2}
              y2={y}
              stroke="oklch(0.45 0.05 150 / 0.35)"
              strokeWidth={1}
            />
            <circle cx={x1} cy={y} r={3.5} fill="url(#strandA)" />
            <circle cx={x2} cy={y} r={3.5} fill="url(#strandB)" />
          </g>
        );
      })}

      {/* strand outlines */}
      <path
        d={Array.from({ length: 80 })
          .map((_, i) => {
            const t = i / 79;
            const y = 10 + t * (rungs.length - 1) * 18;
            const x = 100 + Math.sin(t * Math.PI * 4) * 60;
            return `${i === 0 ? "M" : "L"} ${x} ${y}`;
          })
          .join(" ")}
        fill="none"
        stroke="oklch(0.28 0.05 155 / 0.6)"
        strokeWidth="1"
      />
      <path
        d={Array.from({ length: 80 })
          .map((_, i) => {
            const t = i / 79;
            const y = 10 + t * (rungs.length - 1) * 18;
            const x = 100 - Math.sin(t * Math.PI * 4) * 60;
            return `${i === 0 ? "M" : "L"} ${x} ${y}`;
          })
          .join(" ")}
        fill="none"
        stroke="oklch(0.58 0.14 40 / 0.5)"
        strokeWidth="1"
      />
    </svg>
  );
}
