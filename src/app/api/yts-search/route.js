export async function GET(request) {
  // Leemos el parámetro "q" de la URL, ej: /api/yts-search?q=the+matrix
  const url = new URL(request.url);
  const query = url.searchParams.get("q");

  // Si no viene ninguna búsqueda, regresamos lista vacía
  if (!query || query.trim() === "") {
    return Response.json({ movies: [] });
  }

  try {
    // Le preguntamos a YTS por películas que coincidan con el texto buscado
    const ytsUrl = `https://movies-api.accel.li/api/v2/list_movies.json?query_term=${encodeURIComponent(query.trim())}&limit=8`;
    const response = await fetch(ytsUrl, { cache: "no-store" });

    // Si YTS respondió con error, regresamos lista vacía
    if (!response.ok) {
      return Response.json({ movies: [] });
    }

    // Convertimos la respuesta a JSON y sacamos el array de películas
    const data = await response.json();
    const movies = data?.data?.movies ?? [];

    return Response.json({ movies });

  } catch (error) {
    // Si hubo un problema de red o YTS no respondió
    console.error("[yts-search] fetch failed:", error.message);
    return Response.json({ movies: [] });
  }
}
