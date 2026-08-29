import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Subtitles } from "@/lib/subtitles";
import TMDBApiCall from "@/lib/TMBDApiCall";
import { getCiclos } from "@/lib/ciclos/ciclosData";
import CiclosHeroPattern from "@/components/CiclosHeroPattern";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const ciclos = getCiclos();
  const ciclo = ciclos.find((c) => c.slug === slug);

  return {
    title: ciclo?.nombre ? `Ciclo ${ciclo.nombre} | Cineclub Forever` : "Ciclo",
    description: ciclo?.descripcion || "Películas de este ciclo en Cineclub Forever",
  };
}

export default async function CicloDetalle({ params }) {
  const { slug } = await params;
  const IMG_PATH = process.env.NEXT_PUBLIC_IMG_PATH;

  const ciclos = getCiclos();
  const ciclo = ciclos.find((c) => c.slug === slug);
  if (!ciclo) notFound();

  const moviesData = Subtitles();
  const posts = await TMDBApiCall(moviesData);
  const peliculasDelCiclo = posts.filter((p) => p.ciclo === ciclo.nombre);

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
            Ciclo {ciclo.nombre}
          </h1>

          {ciclo.descripcion && (
            <p className="text-white/65 text-[15px] leading-relaxed max-w-2xl">
              {ciclo.descripcion}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-14 pb-16">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-white/20 text-[10px] tracking-widest">
            {peliculasDelCiclo.length} película{peliculasDelCiclo.length === 1 ? "" : "s"}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {peliculasDelCiclo.map((movie) => (
            <Link key={movie.id} href={`/peliculas-detalle/${movie.slug}`} className="group block">
              <div className="relative overflow-hidden rounded-sm aspect-[2/3] bg-white/5">
                {movie.poster && (
                  <Image
                    src={`${IMG_PATH}${movie.poster}`}
                    alt={movie.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                )}
              </div>
              <div className="pt-2">
                <p
                  className="text-white text-[13px] font-semibold leading-tight mb-1"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  {movie.title}
                </p>
                {movie.genero?.[0] && (
                  <p className="text-white/45 text-[11px]">{movie.genero[0]}</p>
                )}
                {movie.propuestaPor && (
                  <p className="text-white/55 text-[11px] mt-1">
                    Propuesta por {movie.propuestaPor}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
