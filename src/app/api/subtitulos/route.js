// Busca subtítulos en Wyzie Subs (https://docs.wyzie.io/subs/usage/direct) desde el servidor
// para no exponer la llave, ej: /api/subtitulos?id=1240889&lang=es
export async function GET(request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const lang = url.searchParams.get("lang") || "es";
  const season = url.searchParams.get("season");
  const episode = url.searchParams.get("episode");

  if (!id) {
    return Response.json({ subtitles: [] });
  }

  const params = new URLSearchParams({ id, language: lang, key: process.env.WYZIE_API_KEY ?? "" });
  if (season && episode) {
    params.set("season", season);
    params.set("episode", episode);
  }

  try {
    const response = await fetch(`https://sub.wyzie.io/search?${params}`, { cache: "no-store" });
    if (!response.ok) {
      console.error("[subtitulos] wyzie responded", response.status);
      return Response.json({ subtitles: [] });
    }

    const data = await response.json();
    // Dejamos solo los campos que usa la página
    const subtitles = (Array.isArray(data) ? data : []).map((s) => ({
      id: s.id,
      url: s.url,
      format: s.format,
      language: s.language,
      release: s.release,
      source: s.source,
      isHearingImpaired: s.isHearingImpaired,
    }));

    return Response.json({ subtitles });
  } catch (error) {
    console.error("[subtitulos] fetch failed:", error.message);
    return Response.json({ subtitles: [] });
  }
}
