import Link from "next/link";
import { getCiclos } from "@/lib/ciclos/ciclosData";
import CicloIcon from "@/components/CicloIcon";
import CiclosHeroPattern from "@/components/CiclosHeroPattern";

export const metadata = {
  title: "Ciclos | Cineclub Forever",
  description: "Explora el catálogo del cineclub organizado por ciclo.",
};

export default function CiclosPage() {
  const ciclos = getCiclos();

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <div className="relative overflow-hidden">
        <CiclosHeroPattern />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0d0d0d]" />
        <div className="relative max-w-6xl mx-auto px-6 md:px-14 pt-20 pb-16">
          <h1
            className="text-4xl md:text-5xl font-bold text-white leading-[1.05] mb-4"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Ciclos
          </h1>
          <p className="text-white/55 text-sm md:text-base leading-relaxed max-w-2xl">
            Cada ciclo es una manera distinta de armar el catálogo: a veces por tema, a veces
            nada más porque a alguien se le antojó. Aquí queda el registro de lo que hemos
            visto, agrupado por cómo llegó a la lista.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-14 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ciclos.map((ciclo) => (
            <Link
              key={ciclo.slug}
              href={`/ciclos/${ciclo.slug}`}
              className="group block bg-white/[0.03] border border-white/[0.07] hover:border-white/20 rounded-2xl p-7 transition-colors duration-200"
            >
              <CicloIcon
                slug={ciclo.slug}
                className="w-16 h-16 opacity-80 group-hover:opacity-100 transition-opacity duration-200 mb-4"
              />
              <h2
                className="text-2xl font-bold text-white mb-2"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                {ciclo.nombre}
              </h2>
              <p className="text-white/35 text-[11px] tracking-[0.2em] uppercase mb-4">
                {ciclo.totalPeliculas} película{ciclo.totalPeliculas === 1 ? "" : "s"}
              </p>
              {ciclo.descripcion && (
                <p className="text-white/55 text-sm leading-relaxed line-clamp-3">
                  {ciclo.descripcion}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
