// Íconos de los festivales en "Premiadas", mismo estilo neón que CicloIcon.
// La key es el campo `icono` de cada festival en src/lib/premiadas/festivales.js,
// así todas las ediciones de un mismo festival comparten ícono.
const icons = {
  // Palma de Oro: hoja de palma curvada con sus foliolos
  cannes: (
    <>
      <path d="M6 21C8.5 15 12 9.5 18 3.5" />
      <path d="M8 17q-2-1.6-2.6-4.6" />
      <path d="M9.9 13.6q-1.6-2-1.7-5.2" />
      <path d="M12.2 10.3q-1.1-2.2-.6-5.2" />
      <path d="M14.8 7.2q-.4-2 .6-4.3" />
      <path d="M8 17q2.6.4 5.2-1" />
      <path d="M9.9 13.6q2.7.1 5.4-1.6" />
      <path d="M12.2 10.3q2.5-.2 4.9-2" />
      <path d="M14.8 7.2q2-.4 3.8-1.9" />
    </>
  ),
  // Góndola veneciana: casco con las puntas levantadas, el "ferro" en la proa, remo y olas
  venecia: (
    <>
      <path d="M2.5 11.5Q4 16.5 12 16.5q7.5 0 9-6" />
      <path d="M4.5 13.6q7.5 1.6 15.3-.6" />
      <path d="M2.5 11.5q-.3-1.2.6-1.6" />
      <path d="M21 10.5V6.5" />
      <path d="M21 7.5h-1.6" />
      <path d="M21 9h-1.6" />
      <path d="M8 15.5L12.5 3.5" />
      <path d="M3 20.5q1.5-1 3 0t3 0 3 0 3 0 3 0 3 0" />
    </>
  ),
};

// Estrella genérica para festivales sin ícono propio
const fallback = (
  <path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6-4.5-4.2 6.1-.7z" />
);

const neonColors = {
  cannes: "#ffd23f",
  venecia: "#ff7a45",
};
const fallbackColor = "#ffe14d";

export default function FestivalIcon({ icono, className = "w-16 h-16" }) {
  const color = neonColors[icono] ?? fallbackColor;

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
      {icons[icono] ?? fallback}
    </svg>
  );
}
