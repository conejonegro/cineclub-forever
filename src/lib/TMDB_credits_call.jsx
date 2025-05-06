import axios from "axios";
export default function getCredits(movie_id) {

  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movie_id}/credits?api_key=${API_KEY}&language=es-MX`
      );
      const crewMember = response.data.crew[2]; // Obtener el cuarto elemento del array crew
      return crewMember;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return fetchData();
  
}
