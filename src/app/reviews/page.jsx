"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchPublishedReviews } from "@/lib/getReviews/reviews";

function ReviewCard({ slug, titulo, descripcion, imagenUrl, autor }) {
  return (
    <Link href={`/reviews/${slug}`} className="hover:scale-[1.03] transition-transform">
      <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col cursor-pointer h-full">
        <img src={imagenUrl} alt={titulo} className="h-40 w-full object-cover" />
        <div className="p-4 flex-1 flex flex-col">
          <h2 className="text-xl font-bold mb-1 text-gray-900">{titulo}</h2>
          <p className="text-gray-700 mb-2 flex-1 font-medium line-clamp-3">{descripcion}</p>
          <span className="text-sm text-gray-500 mt-auto">Autor: {autor}</span>
        </div>
      </div>
    </Link>
  );
}

export default function ReviewsBlogPage() {
  const [reviews, setReviews] = useState(null);

  useEffect(() => {
    fetchPublishedReviews().then(setReviews).catch(console.error);
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Reseñas de Cine</h1>

      {!reviews && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-lg shadow-md h-64" />
          ))}
        </div>
      )}

      {reviews && reviews.length === 0 && (
        <p className="text-center text-gray-500">Aún no hay reseñas publicadas.</p>
      )}

      {reviews && reviews.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {reviews.map((r) => (
            <ReviewCard key={r.id} {...r} />
          ))}
        </div>
      )}
    </main>
  );
}
