import Link from "next/link";
import { getCatalogSlug } from "@/lib/catalogo";

// Grilla de películas armada con datos locales + TMDB (Premiadas, Posibles películas).

// Póster, año y sinopsis vienen de TMDB; se refrescan una vez al día
async function fetchTmdbMovie(tmdbId) {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=es-MX`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function withTmdbData(list) {
  const tmdbMovies = await Promise.all(list.map((m) => fetchTmdbMovie(m.tmdbId)));
  return list.map((m, i) => ({
    ...m,
    posterPath: tmdbMovies[i]?.poster_path ?? null,
    year: tmdbMovies[i]?.release_date?.slice(0, 4) ?? null,
    overview: tmdbMovies[i]?.overview || null,
    catalogSlug: getCatalogSlug(m.tmdbId),
  }));
}

export function MovieSection({ label, description, movies }) {
  return (
    <section>
      {/* Section divider */}
      <div className={`flex items-center gap-4 ${description ? "mb-3" : "mb-8"}`}>
        <span
          className="text-white/35 text-[10px] font-semibold tracking-[0.35em] uppercase"
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          {label}
        </span>
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-white/20 text-[10px] tracking-widest">
          {movies.length} películas
        </span>
      </div>
      {description && <p className="text-white/40 text-sm mb-8">{description}</p>}

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {movies.map((movie) => (
          <MovieCard key={movie.tmdbId} movie={movie} />
        ))}
      </div>
    </section>
  );
}

function MovieCard({ movie }) {
  const badge = movie.premio ?? movie.seccion;

  return (
    <div className="flex flex-col gap-2">

      {/* Poster */}
      <div className="relative w-full aspect-[2/3] rounded-sm overflow-hidden bg-white/[0.04] border border-white/[0.08]">
        {movie.posterPath && (
          <img
            src={`${process.env.NEXT_PUBLIC_IMG_PATH}${movie.posterPath}`}
            alt={movie.titulo}
            className="w-full h-full object-cover"
          />
        )}
        {/* Award (amber) or festival section (neutral) badge */}
        {badge && (
          <span
            className={`absolute top-2 left-2 right-2 w-fit text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded ${
              movie.premio ? "text-black bg-amber-400" : "text-white/70 bg-black/60"
            }`}
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            {badge}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 px-0.5">
        <p
          className="text-white/90 text-xs font-semibold leading-snug line-clamp-2"
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          {movie.titulo}
        </p>
        <p className="text-white/30 text-[10px] truncate">
          {[movie.tituloAlt, movie.year].filter(Boolean).join(" · ")}
        </p>
        <p className="text-white/50 text-[10px] truncate">{movie.director}</p>
        {movie.yts && (
          <p className="text-white/40 text-[10px] leading-snug">
            En YTS: <span className="text-white/60">{movie.yts}</span>
          </p>
        )}
        {movie.nota && (
          <p className="text-amber-400/60 text-[10px] leading-snug">{movie.nota}</p>
        )}
        {movie.overview && (
          <p className="text-white/35 text-[10px] leading-relaxed line-clamp-3 mt-0.5">
            {movie.overview}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 mt-1">
          <a
            href={`https://www.themoviedb.org/movie/${movie.tmdbId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/50 hover:text-white text-[11px] transition-colors duration-200"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Ver ficha ↗
          </a>
          {movie.catalogSlug ? (
            <Link
              href={`/peliculas-detalle/${movie.catalogSlug}`}
              className="text-emerald-400 hover:text-emerald-300 text-[11px] font-bold transition-colors duration-200"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              Verla ahora →
            </Link>
          ) : (
            <Link
              href={`/solicitar-pelicula?tmdb=${movie.tmdbId}`}
              className="text-amber-400 hover:text-amber-300 text-[11px] font-bold transition-colors duration-200"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              Solicitarla →
            </Link>
          )}
        </div>
      </div>

    </div>
  );
}
