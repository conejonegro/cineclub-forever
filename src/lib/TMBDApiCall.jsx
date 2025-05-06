// Importamos Axios para hacer peticiones HTTP
import axios from "axios";

// Función para convertir un string en un "slug" (formato URL-friendly)
function slugify(str) {
  if (!str) return ""; // Si el string es nulo o vacío, retornamos una cadena vacía

  return str
    .toString() // Convertimos el valor a string por seguridad
    .normalize("NFD") // Normalizamos para separar caracteres con tilde
    .replace(/[\u0300-\u036f]/g, "") // Eliminamos los acentos
    .toLowerCase() // Convertimos todo a minúsculas
    .replace(/\s+/g, "-") // Reemplazamos espacios por guiones
    .replace(/[^a-z0-9-]/g, "") // Quitamos cualquier carácter que no sea letra, número o guión
    .replace(/-+/g, "-") // Reemplazamos múltiples guiones consecutivos por uno solo
    .replace(/^-+|-+$/g, ""); // Eliminamos guiones al inicio o final de la cadena
}

// Función principal que consulta la API de TMDB
export default function TMDBApiCall(dataArray) {
  // Obtenemos la API Key de las variables de entorno
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  // Definimos una función asíncrona para hacer la consulta
  const fetchData = async () => {
    try {
      // Usamos Promise.all para hacer todas las peticiones en paralelo
      const responses = await Promise.all(
        dataArray.map((movie) =>
          axios.get(
            `https://api.themoviedb.org/3/movie/${movie.tmdb_ID}?api_key=${API_KEY}&language=es-MX`
          )
        )
      );

      // Extraemos la data de cada respuesta
      const postData = responses.map((response) => response.data);

      // Formateamos la data para quedarnos solo con los campos necesarios
      const postDataFormated = postData?.map((post) => ({
        title: post.title, // Título original de la película
        slug: slugify(post.title), // Slug generado a partir del título
        id: post.id, // ID de TMDB
        poster: post.poster_path, // Imagen del póster
        sinopsis: post.overview, // Sinopsis de la película
        release_date: post.release_date, // Fecha de estreno
        genero: post.genres.map((g) => g.name), // Géneros de la película
      }));

      console.log("postData TMDB", postData)

      // Retornamos la data formateada
      return postDataFormated;
    } catch (error) {
      // Si ocurre un error, lo mostramos en consola
      console.error("Error fetching data:", error);
    }
  };

  // Ejecutamos y retornamos la función fetchData
  return fetchData();
}
