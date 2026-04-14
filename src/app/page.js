"use client"

import { useEffect, useState } from "react";
import "@/app/globals.css";
import TMDBApiCall from "../lib/TMBDApiCall";
import { Subtitles } from "../lib/subtitles";
import Image from "next/image";
import Link from "next/link";




// Componente principal que renderiza la página de inicio
export default function HomePage() {
  // Estado para almacenar las películas obtenidas
  const [posts, setPosts] = useState([]);

  // Estado para indicar si se están cargando los datos
  const [loading, setLoading] = useState(true);

  // Se obtienen los datos de subtítulos (podría ser un arreglo de títulos de películas)
  const moviesData = Subtitles();

  // Ruta base para las imágenes, definida en variables de entorno
  const IMG_PATH = process.env.NEXT_PUBLIC_IMG_PATH;

  // Hook que se ejecuta una vez al montar el componente
  useEffect(() => {
    async function fetchData() {
      // Llamada a la API de TMDB con los títulos proporcionados
      const tmdbdata = await TMDBApiCall(moviesData);

      // Se actualiza el estado con las películas formateadas
      setPosts(tmdbdata);
      setLoading(false); // Se indica que ya no se está cargando
    }

    // Se invoca la función al montar el componente
    fetchData();
  }, []);

  posts.forEach((movie) => {
    // Se verifica si la película tiene un póster
    if (!movie.poster) {
      // Si no tiene, se asigna una imagen por defecto
     
      movie.poster = "default-poster.jpg"; // Asegúrate de tener esta imagen en tu carpeta pública
    }
  } );

  // Mientras los datos se están cargando, se muestra un mensaje
  if (loading) {
    return <h5 className="text-center mt-10 text-lg">Cargando...</h5>;
  }

  // Una vez cargados, se renderiza la lista de películas
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Películas Recomendadas</h1>

      {/* Grid de películas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {posts.map((movie) => (
          // Enlace hacia la página de detalle de cada película
          <Link key={movie.id} href={`/peliculas-detalle/${movie.slug}`}>

            {/* Tarjeta de la película */}
            <div
              className="bg-white shadow rounded-lg overflow-hidden hover:scale-105 transform transition"
            >
              {/* Imagen del póster de la película */}
              <Image
                src={IMG_PATH + movie.poster}
                priority
                alt={movie.title}
                width={500}
                height={750}
                className="w-full object-cover"
              />

              {/* Información de la película */}
              <div className="p-4">
                <h2 className="text-xl font-semibold text-black">{movie.title}</h2>
                <p className="text-sm text-gray-600">{movie.release_date}</p>
                <p className="mt-2 text-sm text-gray-700 line-clamp-3">
                  {movie.sinopsis}
                </p>
                {movie.propuestaPor && (
                  <p className="mt-2 text-xs text-gray-500">
                    Propuesta por {movie.propuestaPor}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
