import Link from "next/link";
import { notFound } from "next/navigation";
import { festivales, getFestival } from "@/lib/premiadas/festivales";
import FestivalIcon from "@/components/FestivalIcon";
import { MovieSection, withTmdbData } from "@/components/MovieGrid";

export function generateStaticParams() {
  return festivales.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const festival = getFestival(slug);

  return {
    title: festival ? `${festival.titulo} | Cineclub Forever` : "Premiadas en Festivales",
    description: festival?.descripcion ?? "Películas premiadas en festivales de cine.",
  };
}

export default async function FestivalPage({ params }) {
  const { slug } = await params;
  const festival = getFestival(slug);
  if (!festival) notFound();

  const [ganadoras, recomendadas] = await Promise.all([
    withTmdbData(festival.ganadoras),
    withTmdbData(festival.recomendadas),
  ]);

  return (
    <main className="min-h-screen bg-[#0d0d0d]">
      <div className="max-w-6xl mx-auto px-6 md:px-14 py-14">

        {/* Header */}
        <div className="mb-10">
          <Link
            href="/premiadas"
            className="text-white/50 hover:text-white/80 text-[10px] uppercase tracking-[0.3em] mb-2 font-semibold block w-fit transition-colors duration-200"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            ← Premiadas en Festivales
          </Link>
          <div className="flex items-center gap-3">
            <FestivalIcon icono={festival.icono} className="w-9 h-9 flex-shrink-0" />
            <h1
              className="text-white text-3xl font-bold"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {festival.titulo}
            </h1>
          </div>
          <p className="text-white/40 text-sm mt-2 max-w-2xl">{festival.descripcion}</p>
        </div>

        <MovieSection label="Palmarés" movies={ganadoras} />

        <div className="mt-16">
          <MovieSection
            label="Fuera del palmarés, pero valen la pena"
            description="No se llevaron premio del jurado oficial, pero fueron de lo mejor recibido por la crítica en el festival."
            movies={recomendadas}
          />
        </div>

      </div>
    </main>
  );
}

