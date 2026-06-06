"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchPublishedReviews } from "@/lib/getReviews/reviews";

function ReviewCard({ slug, titulo, descripcion, imagenUrl, autor }) {
  return (
    <Link href={`/reviews/${slug}`} className="group block">
      <div className="bg-zinc-900 border border-white/[0.07] rounded-sm overflow-hidden flex flex-col h-full transition-colors hover:border-white/20">
        <div className="relative h-48 overflow-hidden">
          <img
            src={imagenUrl}
            alt={titulo}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 to-transparent" />
        </div>
        <div className="p-5 flex-1 flex flex-col gap-2">
          <h2
            className="text-white font-bold text-lg leading-snug group-hover:text-amber-400 transition-colors"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            {titulo}
          </h2>
          <p className="text-white/50 text-sm leading-relaxed flex-1 line-clamp-3">{descripcion}</p>
          <span className="text-white/25 text-xs uppercase tracking-[0.2em]">{autor}</span>
          <span className="self-start mt-2 text-[10px] uppercase tracking-[0.25em] font-bold text-black bg-amber-400 px-3 py-1 rounded-sm group-hover:bg-amber-300 transition-colors">
            Leer
          </span>
        </div>
      </div>
    </Link>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-zinc-900 border border-white/[0.07] rounded-sm overflow-hidden animate-pulse">
      <div className="h-48 bg-zinc-800" />
      <div className="p-5 flex flex-col gap-3">
        <div className="h-5 bg-zinc-800 rounded w-3/4" />
        <div className="h-3 bg-zinc-800 rounded w-full" />
        <div className="h-3 bg-zinc-800 rounded w-5/6" />
        <div className="h-3 bg-zinc-800 rounded w-1/3 mt-2" />
      </div>
    </div>
  );
}

export default function ReviewsBlogPage() {
  const [reviews, setReviews] = useState(null);

  useEffect(() => {
    fetchPublishedReviews().then(setReviews).catch(console.error);
  }, []);

  return (
    <main className="min-h-screen bg-[#0d0d0d] text-white">
      <div className="max-w-6xl mx-auto px-6 md:px-14 py-16">

        <div className="mb-12">
          <p
            className="text-white/20 text-[9px] uppercase tracking-[0.3em] mb-3"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Cineclub Forever
          </p>
          <h1
            className="text-4xl md:text-5xl font-bold text-white"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Reseñas
          </h1>
        </div>

        {!reviews && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {reviews && reviews.length === 0 && (
          <p className="text-white/30 text-sm">Aún no hay reseñas publicadas.</p>
        )}

        {reviews && reviews.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {reviews.map((r) => (
              <ReviewCard key={r.id} {...r} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
