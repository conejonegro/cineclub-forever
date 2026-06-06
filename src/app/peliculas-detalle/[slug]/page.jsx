export const revalidate = 3600;

import Image from "next/image";
import Link from "next/link";
import Video from "@/components/Video";
import Comments from "@/components/Comments";
import { Subtitles } from "@/lib/subtitles";
import TMDBApiCall from "@/lib/TMBDApiCall";
import getCredits from "@/lib/TMDB_credits_call";

const BACKDROP_PATH = "https://image.tmdb.org/t/p/w1280";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const moviesData = Subtitles();
  const posts = await TMDBApiCall(moviesData);
  const pelicula = posts.find((post) => post.slug === slug);
  const IMG_PATH = process.env.NEXT_PUBLIC_IMG_PATH;

  return {
    title: pelicula?.title ? `${pelicula.title} | Cineclub Forever` : "Película",
    description: pelicula?.sinopsis || "Mira esta película en nuestro sitio",
    openGraph: {
      title: pelicula?.title,
      description: pelicula?.sinopsis,
      images: [
        {
          url: IMG_PATH + (pelicula?.backdrop || pelicula?.poster || ""),
          width: 1280,
          height: 720,
          alt: pelicula?.title,
        },
      ],
    },
  };
}

export default async function PeliculaDetalle({ params }) {
  const { slug } = await params;
  const IMG_PATH = process.env.NEXT_PUBLIC_IMG_PATH;

  const moviesData = Subtitles();
  const posts = await TMDBApiCall(moviesData);
  const pelicula = posts.find((post) => post.slug === slug);

  const director = pelicula?.id ? await getCredits(pelicula.id) : null;

  const index = posts.findIndex((post) => post.slug === slug);
  const prevPost = posts[(index - 1 + posts.length) % posts.length];
  const nextPost = posts[(index + 1) % posts.length];

  const movieData = getMovieDataBySlug(slug);
  const year = pelicula?.release_date?.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">

      {/* ── BACKDROP ──────────────────────────────────────────── */}
      <div className="relative w-full h-[62vh] overflow-hidden">
        {pelicula?.backdrop && (
          <Image
            src={`${BACKDROP_PATH}${pelicula.backdrop}`}
            alt={pelicula.title}
            fill
            priority
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/30 to-[#0d0d0d]/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0d]/70 to-transparent" />
      </div>

      {/* ── INFO ──────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 md:px-14">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 -mt-40 relative z-10 mb-14">

          {/* Poster */}
          <div className="w-40 md:w-52 shrink-0">
            {pelicula?.poster && (
              <Image
                src={`${IMG_PATH}${pelicula.poster}`}
                alt={pelicula.title}
                width={300}
                height={450}
                className="rounded-sm shadow-[0_30px_80px_rgba(0,0,0,0.8)] w-full"
              />
            )}
          </div>

          {/* Meta */}
          <div className="flex flex-col gap-4 md:pt-40">
            {year && (
              <span
                className="text-amber-400 text-[10px] font-bold tracking-[0.35em] uppercase"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                {year}
              </span>
            )}

            <h1
              className="text-4xl md:text-[3.5rem] font-bold text-white leading-[1.05]"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {pelicula?.title}
            </h1>

            {/* Géneros */}
            {pelicula?.genero?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {pelicula.genero.map((g) => (
                  <span
                    key={g}
                    className="text-[11px] text-white/55 border border-white/15 px-3 py-1 rounded-full"
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}

            {/* Créditos */}
            <div className="flex flex-wrap gap-x-10 gap-y-2 text-sm text-white/60 mt-1">
              {director && (
                <div className="flex flex-col gap-0.5">
                  <span className="text-white/25 text-[9px] uppercase tracking-[0.25em]">Dirección</span>
                  <span>{director}</span>
                </div>
              )}
              {pelicula?.propuestaPor && (
                <div className="flex flex-col gap-0.5">
                  <span className="text-white/25 text-[9px] uppercase tracking-[0.25em]">Propuesta por</span>
                  <span>{pelicula.propuestaPor}</span>
                </div>
              )}
            </div>

            {/* Sinopsis */}
            <p className="text-white/50 text-sm leading-relaxed max-w-xl mt-2">
              {pelicula?.sinopsis}
            </p>
          </div>
        </div>

        {/* ── VIDEO ─────────────────────────────────────────────── */}
        <div className="mb-16">
          <p
            className="text-white/20 text-[9px] uppercase tracking-[0.3em] mb-3"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Reproducir
          </p>
          <div className="w-full aspect-video bg-black rounded-sm overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.7)]">
            <Video url={movieData?.videoSrc} subtitle={movieData?.subtitlePath} key={slug} />
          </div>
        </div>

        {/* ── COMMENTS ──────────────────────────────────────────── */}
        <Comments movieSlug={slug} />

        {/* ── PREV / NEXT ───────────────────────────────────────── */}
        <div className="border-t border-white/[0.07] pt-10 pb-20 grid grid-cols-2 gap-6">
          <Link href={`/peliculas-detalle/${prevPost.slug}`} className="group flex items-center gap-4">
            <div className="relative w-12 h-[4.5rem] shrink-0 overflow-hidden rounded-sm opacity-50 group-hover:opacity-90 transition-opacity duration-300">
              {prevPost.poster && (
                <Image
                  src={`${IMG_PATH}${prevPost.poster}`}
                  alt={prevPost.title}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <div>
              <p className="text-white/25 text-[9px] uppercase tracking-[0.3em] mb-1">← Anterior</p>
              <p
                className="text-white/55 text-sm font-semibold group-hover:text-white transition-colors line-clamp-2"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                {prevPost.title}
              </p>
            </div>
          </Link>

          <Link href={`/peliculas-detalle/${nextPost.slug}`} className="group flex items-center gap-4 justify-end text-right">
            <div>
              <p className="text-white/25 text-[9px] uppercase tracking-[0.3em] mb-1">Siguiente →</p>
              <p
                className="text-white/55 text-sm font-semibold group-hover:text-white transition-colors line-clamp-2"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                {nextPost.title}
              </p>
            </div>
            <div className="relative w-12 h-[4.5rem] shrink-0 overflow-hidden rounded-sm opacity-50 group-hover:opacity-90 transition-opacity duration-300">
              {nextPost.poster && (
                <Image
                  src={`${IMG_PATH}${nextPost.poster}`}
                  alt={nextPost.title}
                  fill
                  className="object-cover"
                />
              )}
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export function getMovieDataBySlug(slug) {
  const moviesData = Subtitles();
  const movie = moviesData.find((item) => item.name === slug);
  if (!movie) {
    console.warn("⚠️ No se encontró película con slug:", slug);
    return null;
  }
  return movie;
}
