import axios from "axios";

export default async function getDirector(movie_id) {
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  try {
    //console.log("➡️ Fetching credits for movie_id:", movie_id);

    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${movie_id}/credits?api_key=${API_KEY}&language=es-MX`
    );

    const crew = response.data.crew;
    //console.log("👥 Crew length:", crew.length);

    // 🔍 Buscar el director de forma directa
    const director = crew.find((person) => person.job === "Director");

    if (director) {
      console.log("🎬 Director encontrado:", director.name, director);
      return director.name; // solo el nombre
    } else {
      console.warn("⚠️ No se encontró director en los créditos.");
      return null;
    }
  } catch (error) {
    console.error("❌ Error fetching credits:", error);
    return null;
  }
}
