export const revalidate = 3600; 

import Image from "next/image";
import Link from "next/link";
import { GrNext, GrPrevious } from "react-icons/gr";
import Video from "@/components/Video";
import { Subtitles } from "@/lib/subtitles";
import TMDBApiCall from "@/lib/TMBDApiCall";
import getCredits from "@/lib/TMDB_credits_call";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  // 👉 Llamada a tu API interna de TMDB
  const moviesData = Subtitles();
  const posts = await TMDBApiCall(moviesData);
  console.log("misposts", posts);
  const peliculaActual = posts.find((post) => post.slug === slug);
  console.log("Pelicula actual:", peliculaActual);

  const IMG_PATH = process.env.NEXT_PUBLIC_IMG_PATH;

  return {
    title: peliculaActual?.title + " | Cineclub Forever" || "Película",
    description: peliculaActual?.sinopsis || "Mira esta película en nuestro sitio",
    openGraph: {
      title: peliculaActual?.title,
      description: peliculaActual?.sinopsis,
      images: [
        {
          url: IMG_PATH + (peliculaActual?.backdrop || peliculaActual?.poster || ""),
          width: 600,
          height: 900,
          alt: peliculaActual?.title,
        },
      ],
    },
  };
}

export default async function PeliculaDetalle({ params }) {
  const { slug } = await params;
  const IMG_PATH = process.env.NEXT_PUBLIC_IMG_PATH;

  // Fetch posts
  const moviesData = Subtitles();
  console.log("moviesData", moviesData);
  const posts = await TMDBApiCall(moviesData);
  const peliculaActual = posts.find((post) => post.slug === slug);



  // Fetch credits
  const director = peliculaActual?.id
    ? await getCredits(peliculaActual.id)
    : null;




  const index = posts.findIndex((post) => post.slug === slug);
  const prevPost = posts[(index - 1 + posts.length) % posts.length];
  const nextPost = posts[(index + 1) % posts.length];

  const movieData = getMovieDataBySlug(slug);

  return (
    <section className="min-h-screen bg-gray-900 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <Image
              src={IMG_PATH + (peliculaActual?.poster || "")}
              alt="Poster descriptivo"
              className="rounded-lg w-full shadow-md"
              width={300}
              height={450}
            />
          </div>
          <div className="md:w-2/3 space-y-4">
            <h1 className="text-4xl font-bold leading-tight">
              {peliculaActual?.title}
            </h1>
            <p>
              <span className="font-semibold">Director:</span>{" "}
              {director || "Desconocido"}
            </p>
            <p>
              <span className="font-semibold">Fecha de Lanzamiento:</span>{" "}
              {peliculaActual?.release_date?.replace(/-/g, "/") || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Género:</span>{" "}
              {(peliculaActual?.genero || []).join(", ")}
            </p>
            {movieData?.propuestaPor && (
              <p>
                <span className="font-semibold">Propuesta por:</span>{" "}
                {movieData.propuestaPor}
              </p>
            )}
            <h5 className="font-bold mb-0">Sinopsis:</h5>
            <p className="text-gray-300">{peliculaActual?.sinopsis}</p>
          </div>
        </div>

        <div className="mt-10">
          <Video
            url={movieData?.videoSrc}
            subtitle={movieData?.subtitlePath}
            key={slug}
          />
        </div>

        <div className="flex justify-between items-center mt-12">
          <Link
            href={`/peliculas-detalle/${prevPost.slug}`}
            className="flex items-center gap-2 text-blue-400 hover:underline"
          >
            <GrPrevious /> Anterior
          </Link>
          <Link
            href={`/peliculas-detalle/${nextPost.slug}`}
            className="flex items-center gap-2 text-blue-400 hover:underline"
          >
            Siguiente <GrNext />
          </Link>
        </div>
      </div>
    </section>
  );
}


export function getMovieDataBySlug(slug) {
  const moviesData = Subtitles();

  // Buscar el objeto que coincida con el slug (campo "name")
  const movie = moviesData.find((item) => item.name === slug);

  if (!movie) {
    console.warn("⚠️ No se encontró película con slug:", slug);
    return null;
  }

  console.log("🎬 Película encontrada:", movie);
  console.log("▶️ Ruta del video:", movie.videoSrc);
  console.log("📄 Ruta de subtítulos:", movie.subtitlePath);

  return movie;
}
