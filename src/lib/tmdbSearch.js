// Busca un título en TMDB (es-MX) y regresa el primer resultado, o null.
// Se usa para resolver solicitudes viejas que solo guardaron el título (ver docs/adr/0003).
export async function searchFirstTmdbMovie(title) {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${encodeURIComponent(title)}&language=es-MX`
    );
    const data = await res.json();
    return data.results?.[0] ?? null;
  } catch {
    return null;
  }
}
