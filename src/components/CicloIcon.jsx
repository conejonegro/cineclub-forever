const icons = {
  snob: (
    <>
      <path d="M4 4h16" />
      <path d="M4 4l8 9 8-9" />
      <path d="M12 13v7" />
      <path d="M8 20h8" />
    </>
  ),
  libre: (
    <>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 7.6-1.8" />
      <circle cx="12" cy="16" r="1.5" />
    </>
  ),
  teens: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <circle cx="8.5" cy="12" r="2" />
      <circle cx="15.5" cy="12" r="2" />
      <path d="M10.2 12h3.6" />
    </>
  ),
};

const fallback = (
  <>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="7" r="1" />
    <circle cx="12" cy="17" r="1" />
    <circle cx="7" cy="12" r="1" />
    <circle cx="17" cy="12" r="1" />
  </>
);

const neonColors = {
  snob: "#ff2fd6",
  libre: "#39ff88",
  teens: "#2fe6ff",
};
const fallbackColor = "#ffe14d";

export default function CicloIcon({ slug, className = "w-16 h-16" }) {
  const color = neonColors[slug] ?? fallbackColor;

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ filter: `drop-shadow(0 0 6px ${color}aa)` }}
    >
      {icons[slug] ?? fallback}
    </svg>
  );
}
