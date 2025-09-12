"use client";

import { useParams } from "next/navigation";
import Video from "@/components/Video";
import { useState, useEffect, useMemo } from "react";
import TMDBApiCall from "@/lib/TMBDApiCall";
import { Subtitles } from "@/lib/subtitles";
import Link from "next/link";
import { GrNext, GrPrevious } from "react-icons/gr";
import getCredits from "@/lib/TMDB_credits_call";
import "@/app/globals.css";
import Image from "next/image"; 
import { useContext } from "react";
import { UserContext } from "@/components/UserProvider";

function PeliculaDetalle() {
  const IMG_PATH = process.env.NEXT_PUBLIC_IMG_PATH;
  const [posts, setPosts] = useState([]);
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rDate, setRDate] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);

const { user: userData } = useContext(UserContext);


  const moviesData =  Subtitles();
  const router = useParams();
  const slug = router.slug;

  //console.log("moviesData:", moviesData);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const postsFromApi = await TMDBApiCall(moviesData);
        setPosts(postsFromApi);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los posts:", error);
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);


  const peliculaActual = useMemo(() => {
    return posts.find((post) => post.slug === slug) || {};
  }, [posts, slug]);

  //console.log("PeliculaActual:", peliculaActual);

  const sourceFound = useMemo(() => {
    return moviesData.find((subtitle) => subtitle.name === slug);
  }, [moviesData, slug]);

  const index = useMemo(() => {
    return posts.findIndex((post) => post.slug === slug);
  }, [posts, slug]);

  const prevPost = useMemo(() => {
    if (index === -1) return {};
    return posts[(index - 1 + posts.length) % posts.length] || {};
  }, [posts, index]);

  const nextPost = useMemo(() => {
    if (index === -1) return {};
    return posts[(index + 1) % posts.length] || {};
  }, [posts, index]);

  useEffect(() => {
    if (peliculaActual.release_date) {
      setRDate(peliculaActual.release_date.replace(/-/g, "/"));
    } else {
      setRDate(null);
    }
  }, [peliculaActual.release_date]);

  useEffect(() => {
    if (sourceFound) {
      setAlertMessage(
        `Esta película fue propuesta por ${sourceFound.propuestaPor} en el ciclo ${sourceFound.ciclo} y será retirada en dos meses.`
      );
    } else {
      setAlertMessage(null);
    }
  }, [sourceFound]);

  useEffect(() => {
    if (peliculaActual.id) {
      async function fetchCredits() {
        try {
          const fetchedCredits = await getCredits(peliculaActual.id);
          setCredits(fetchedCredits);
          //console.log("Pelicula ID:", peliculaActual);
          console.log("Creditos", fetchedCredits);
        } catch (error) {
          console.error("Error al obtener créditos:", error);
        }
      }
      fetchCredits();
    }
  }, [peliculaActual.id]);
  //console.log(peliculaActual)

  return (
    <>
      {loading ? (
        <div className="text-center py-12 text-xl text-gray-400">
          Cargando...
        </div>
      ) : (
        <section className="min-h-screen bg-gray-900 text-white py-12 px-4">
          <div className="max-w-6xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <Image
                  src={IMG_PATH + (peliculaActual.poster || "")}
                  alt="Poster descriptivo"
                  className="rounded-lg w-full shadow-md"
                  width={300}
                  height={450}
                />
              </div>
              <div className="md:w-2/3 space-y-4">
                <h1 className="text-4xl font-bold leading-tight">
                  {peliculaActual.original_title}
                </h1>
                <p>
                  <span className="font-semibold">Director:</span>{" "}
                  {credits || "Desconocido"}
                </p>
                <p>
                  <span className="font-semibold">Fecha de Lanzamiento:</span>{" "}
                  {rDate}
                </p>
                <p>
                  <span className="font-semibold">Género:</span>{" "}
                  {(peliculaActual.genero || []).map((g) => g).join(", ")}
                </p>
                <p className="text-gray-300">{peliculaActual.sinopsis}</p>
                {alertMessage && (
                  <div className="bg-yellow-100 text-black px-4 py-2 rounded shadow">
                    <p>{alertMessage}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-10">
              {userData ? (
                <Video
                  url={sourceFound?.videoSrc}
                  subtitle={sourceFound?.subtitlePath}
                  key={slug}
                />
              ) : (
                <p className="text-center text-lg text-red-400">
                  Hola!, Inicia Sesión para ver la Película...
                </p>
              )}
            </div>
            <div className="flex justify-between items-center mt-12">
              <Link
                href={`/peliculas-detalle/${prevPost.slug}`}
                className="flex items-center gap-2 text-blue-400 hover:underline"
              >
                <GrPrevious /> Anterior
              </Link>
              <Link
                href={`/peliculas-detalle/${nextPost.slug || ""}`}
                className="flex items-center gap-2 text-blue-400 hover:underline"
              >
                Siguiente <GrNext />
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default PeliculaDetalle;
