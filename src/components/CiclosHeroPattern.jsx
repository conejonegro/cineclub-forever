export default function CiclosHeroPattern() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 800 400"
      aria-hidden="true"
    >
      <defs>
        <pattern id="ciclos-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="white" strokeOpacity="0.05" />
        </pattern>
        <radialGradient id="ciclos-glow-pink" cx="18%" cy="25%" r="55%">
          <stop offset="0%" stopColor="#ff2fd6" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ff2fd6" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ciclos-glow-green" cx="82%" cy="15%" r="50%">
          <stop offset="0%" stopColor="#39ff88" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#39ff88" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ciclos-glow-cyan" cx="55%" cy="90%" r="60%">
          <stop offset="0%" stopColor="#2fe6ff" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#2fe6ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="800" height="400" fill="url(#ciclos-grid)" />
      <rect width="800" height="400" fill="url(#ciclos-glow-pink)" />
      <rect width="800" height="400" fill="url(#ciclos-glow-green)" />
      <rect width="800" height="400" fill="url(#ciclos-glow-cyan)" />
    </svg>
  );
}
