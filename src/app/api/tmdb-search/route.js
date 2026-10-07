// Dejamos solo los campos que usa el formulario
function toMovie(movie) {
  return {
    id: movie.id,
    title: movie.title,
    original_title: movie.original_title,
    year: movie.release_date ? movie.release_date.slice(0, 4) : null,
    poster_path: movie.poster_path ?? null,
  };
}

export async function GET(request) {
  // Leemos el parámetro "q" de la URL, ej: /api/tmdb-search?q=the+matrix
  // o "id" para traer una sola película, ej: /api/tmdb-search?id=603
  const url = new URL(request.url);
  const query = url.searchParams.get("q");
  const id = url.searchParams.get("id");

  if (id) {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${encodeURIComponent(id)}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=es-MX`,
        { cache: "no-store" }
      );
      if (!response.ok) {
        return Response.json({ movies: [] });
      }
      return Response.json({ movies: [toMovie(await response.json())] });
    } catch (error) {
      console.error("[tmdb-search] fetch by id failed:", error.message);
      return Response.json({ movies: [] });
    }
  }

  // Si no viene ninguna búsqueda, regresamos lista vacía
  if (!query || query.trim() === "") {
    return Response.json({ movies: [] });
  }

  try {
    // Le preguntamos a TMDB por películas que coincidan con el texto buscado (en español)
    const tmdbUrl = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${encodeURIComponent(query.trim())}&language=es-MX&include_adult=false`;
    const response = await fetch(tmdbUrl, { cache: "no-store" });

    // Si TMDB respondió con error, regresamos lista vacía
    if (!response.ok) {
      return Response.json({ movies: [] });
    }

    const data = await response.json();
    const movies = (data?.results ?? []).slice(0, 8).map(toMovie);

    return Response.json({ movies });

  } catch (error) {
    // Si hubo un problema de red o TMDB no respondió
    console.error("[tmdb-search] fetch failed:", error.message);
    return Response.json({ movies: [] });
  }
}
