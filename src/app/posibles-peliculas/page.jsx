import { posibles } from "@/lib/posibles/posibles";
import { MovieSection, withTmdbData } from "@/components/MovieGrid";

export const metadata = {
  title: "Posibles películas | Cineclub Forever",
  description: "Candidatas para el cineclub: festivales, rarezas y terror de 2024 a 2026.",
};

export default async function PosiblesPage() {
  const categorias = await Promise.all(
    posibles.map(async (c) => ({ ...c, peliculas: await withTmdbData(c.peliculas) }))
  );

  return (
    <main className="min-h-screen bg-[#0d0d0d]">
      <div className="max-w-6xl mx-auto px-6 md:px-14 py-14">

        {/* Header */}
        <div className="mb-10">
          <p
            className="text-white/50 text-[10px] uppercase tracking-[0.3em] mb-2 font-semibold"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Posibles
          </p>
          <h1
            className="text-white text-3xl font-bold"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Posibles películas
          </h1>
          <p className="text-white/40 text-sm mt-2 max-w-2xl">
            Candidatas para próximas funciones, de 2024 a 2026. Si alguna te late, solicítala.
          </p>

          {/* Jump links */}
          <nav className="flex flex-wrap gap-2 mt-6">
            {categorias.map((c) => (
              <a
                key={c.slug}
                href={`#${c.slug}`}
                className="text-white/60 hover:text-white text-[11px] border border-white/10 hover:border-white/30 rounded-full px-3 py-1 transition-colors duration-200"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                {c.titulo}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-16">
          {categorias.map((c) => (
            <div key={c.slug} id={c.slug} className="scroll-mt-24">
              <MovieSection label={c.titulo} description={c.descripcion} movies={c.peliculas} />
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
