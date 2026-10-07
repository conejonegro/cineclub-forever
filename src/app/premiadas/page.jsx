import Link from "next/link";
import { festivales } from "@/lib/premiadas/festivales";
import FestivalIcon from "@/components/FestivalIcon";

export const metadata = {
  title: "Premiadas en Festivales | Cineclub Forever",
  description: "Lo que ganó y lo que valió la pena en los grandes festivales de cine.",
};

export default function PremiadasPage() {
  return (
    <main className="min-h-screen bg-[#0d0d0d]">
      <div className="max-w-6xl mx-auto px-6 md:px-14 py-14">

        {/* Header */}
        <div className="mb-10">
          <p
            className="text-white/50 text-[10px] uppercase tracking-[0.3em] mb-2 font-semibold"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Premiadas
          </p>
          <h1
            className="text-white text-3xl font-bold"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Premiadas en Festivales
          </h1>
          <p className="text-white/40 text-sm mt-2 max-w-2xl">
            Lo que ganó en los grandes festivales y lo que, sin ganar, valió mucho la pena.
            Elige un festival.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {festivales.map((festival) => (
            <Link
              key={festival.slug}
              href={`/premiadas/${festival.slug}`}
              className="group block bg-white/[0.03] border border-white/[0.07] hover:border-white/20 rounded-2xl p-7 transition-colors duration-200"
            >
              <FestivalIcon
                icono={festival.icono}
                className="w-16 h-16 opacity-80 group-hover:opacity-100 transition-opacity duration-200 mb-4"
              />
              <h2
                className="text-2xl font-bold text-white mb-2"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                {festival.nombre}
              </h2>
              <p className="text-white/35 text-[11px] tracking-[0.2em] uppercase mb-4">
                {festival.ganadoras.length} ganadoras · {festival.recomendadas.length} recomendadas
              </p>
              <p className="text-white/55 text-sm leading-relaxed line-clamp-3">
                {festival.descripcion}
              </p>
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}
