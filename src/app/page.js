"use client"

import { useEffect, useState } from "react";
import "@/app/globals.css";
import TMDBApiCall from "../lib/TMBDApiCall";
import { Subtitles } from "../lib/subtitles";
import Image from "next/image";
import Link from "next/link";

const BACKDROP_PATH = "https://image.tmdb.org/t/p/w1280";

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const moviesData = Subtitles();
  const IMG_PATH = process.env.NEXT_PUBLIC_IMG_PATH;

  useEffect(() => {
    async function fetchData() {
      const tmdbdata = await TMDBApiCall(moviesData);
      setPosts(tmdbdata);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <p className="text-white/30 text-xs tracking-[0.4em] uppercase">Cargando</p>
      </div>
    );
  }

  const [hero, ...rest] = posts;

  return (
    <div className="min-h-screen bg-[#0d0d0d]">

      {/* ── HERO ──────────────────────────────────────────────── */}
      {hero && (
        <Link href={`/peliculas-detalle/${hero.slug}`}>
          <div className="relative w-full h-[88vh] overflow-hidden cursor-pointer">
            {hero.backdrop && (
              <Image
                src={`${BACKDROP_PATH}${hero.backdrop}`}
                alt={hero.title}
                fill
                priority
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0d]/80 via-[#0d0d0d]/20 to-transparent" />

            <div className="absolute bottom-0 left-0 p-8 md:p-16 max-w-2xl">
              <span
                className="text-amber-400 text-[10px] font-bold tracking-[0.35em] uppercase mb-5 block"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                Película destacada
              </span>

              <h1
                className="text-5xl md:text-[4.5rem] font-bold text-white leading-[1.05] mb-5"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                {hero.title}
              </h1>

              {hero.genero?.length > 0 && (
                <div className="flex gap-2 mb-5 flex-wrap">
                  {hero.genero.slice(0, 3).map((g) => (
                    <span
                      key={g}
                      className="text-[11px] text-white/60 border border-white/20 px-3 py-1 rounded-full"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              )}

              <p className="text-white/60 text-sm leading-relaxed line-clamp-2 mb-7 max-w-lg">
                {hero.sinopsis}
              </p>

              <div className="flex items-center gap-6 flex-wrap">
                <span className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-black text-sm font-bold px-7 py-3 rounded-full transition-colors">
                  Ver película →
                </span>
                {hero.propuestaPor && (
                  <span className="text-white/35 text-xs tracking-wide">
                    Propuesta por {hero.propuestaPor}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* ── CICLO ACTUAL ──────────────────────────────────────── */}
      <div className="px-6 md:px-14 pt-14">
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-8 md:p-10">
          <div className="flex items-center gap-4 mb-6">
            <span
              className="text-amber-400 text-[10px] font-bold tracking-[0.35em] uppercase"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              Ciclo actual
            </span>
            <div className="h-px flex-1 bg-white/10" />
            <span className="inline-flex items-center gap-2 text-white/35 text-[10px] tracking-[0.15em] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_0_3px_rgba(52,211,153,0.15)]" />
              En curso
            </span>
          </div>

          <h2
            className="text-4xl md:text-5xl font-bold text-white leading-[1.05] mb-4"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Ciclo Snob
          </h2>

          <p className="text-white/65 text-[15px] leading-relaxed max-w-2xl mb-7">
            Estamos en el <span className="text-white/85 font-semibold">Ciclo Snob</span>: un grupo
            de gente de Chihuahua con más cultura que humildad se reúne a recomendarse películas
            entre sí. No hay reglas de género ni década: puede ser una dosmilera under o una obra
            maestra que quieran presumir haber visto. Cada quien trae lo suyo y el resto decide qué
            tanto trae.
          </p>

          <p className="text-white/30 text-[10px] font-semibold tracking-[0.25em] uppercase mb-3">
            Quién propone en este ciclo
          </p>
          <div className="flex flex-wrap gap-2 mb-8">
            {["Jonathan", "Diego", "Walter", "Payo", "Alfred", "Luis"].map((name) => (
              <span
                key={name}
                className="text-xs text-white/70 border border-white/15 px-3.5 py-1.5 rounded-full"
              >
                {name}
              </span>
            ))}
            <span className="text-xs text-amber-400 border border-amber-400/30 px-3.5 py-1.5 rounded-full">
              + el que se quiera sumar
            </span>
          </div>

          <div className="flex items-center gap-5 flex-wrap">
            <Link
              href="/ciclos/snob"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-black text-sm font-bold px-7 py-3 rounded-full transition-colors"
            >
              Ver ciclo Snob →
            </Link>
            <Link
              href="/solicitar-pelicula"
              className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 text-white text-sm font-bold px-7 py-3 rounded-full transition-colors"
            >
              Proponer una película →
            </Link>
          </div>
        </div>
      </div>

      {/* ── GRID ──────────────────────────────────────────────── */}
      <div className="px-6 md:px-14 py-14">
        <div className="flex items-center gap-4 mb-8">
          <h2
            className="text-white/35 text-[10px] font-semibold tracking-[0.35em] uppercase"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            En cartelera
          </h2>
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-white/20 text-[10px] tracking-widest">{posts.length} películas</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {rest.map((movie) => (
            <Link key={movie.id} href={`/peliculas-detalle/${movie.slug}`}>
              <div className="group relative overflow-hidden rounded-sm aspect-[2/3] bg-white/5">
                {movie.poster && (
                  <Image
                    src={`${IMG_PATH}${movie.poster}`}
                    alt={movie.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                  <p
                    className="text-white text-[13px] font-semibold leading-tight mb-1"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                  >
                    {movie.title}
                  </p>
                  {movie.genero?.[0] && (
                    <p className="text-white/45 text-[11px]">{movie.genero[0]}</p>
                  )}
                  {movie.propuestaPor && (
                    <p className="text-white/55 text-[11px] mt-1">
                      Propuesta por {movie.propuestaPor}
                    </p>
                  )}
                  {movie.ciclo && (
                    <span className="inline-block w-fit mt-1.5 text-[10px] text-amber-400/90 border border-amber-400/25 px-3 py-1 rounded-full">
                      Ciclo {movie.ciclo}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
