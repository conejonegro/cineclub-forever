import { cannes2026, cannes2026Recomendadas } from "./cannes2026";
import { venecia2026, venecia2026Recomendadas } from "./venecia2026";

// Festivales de "Premiadas en Festivales", del más reciente al más antiguo.
// Para agregar uno nuevo: crea su archivo de datos (como cannes2026.js) y agrégalo aquí.
export const festivales = [
  {
    slug: "venecia-2026",
    icono: "venecia",
    nombre: "Venecia 2026",
    titulo: "Ganadoras de Venecia 2026",
    descripcion:
      "El palmarés de la 83ª Mostra de Venecia (septiembre 2026). Todavía no están en el catálogo: si alguna te late, solicítala y la buscamos.",
    ganadoras: venecia2026,
    recomendadas: venecia2026Recomendadas,
  },
  {
    slug: "cannes-2026",
    icono: "cannes",
    nombre: "Cannes 2026",
    titulo: "Ganadoras de Cannes 2026",
    descripcion:
      "El palmarés del 79º Festival de Cannes (mayo 2026). Todavía no están en el catálogo: si alguna te late, solicítala y la buscamos.",
    ganadoras: cannes2026,
    recomendadas: cannes2026Recomendadas,
  },
];

export function getFestival(slug) {
  return festivales.find((f) => f.slug === slug) ?? null;
}
