import { Subtitles } from "@/lib/subtitles";

// Si la película (por su ID de TMDB) ya está en el catálogo, regresa su slug
// para armar el link a /peliculas-detalle/[slug]; si no, null.
export function getCatalogSlug(tmdbId) {
  if (!tmdbId) return null;
  const movie = Subtitles().find((m) => String(m.tmdb_ID) === String(tmdbId));
  return movie?.name ?? null;
}
