"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchReviewBySlug } from "@/lib/getReviews/reviews";

export default function ReviewPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [review, setReview] = useState(null);
  const [error, setError] = useState(null);

useEffect(() => {
  let active = true;

  if (!slug) return;

  const loadReview = async () => {
    try {
      const data = await fetchReviewBySlug(slug);
      if (!active) return;

      if (data) {
        setReview(data);
      } else {
        setError("No encontrada");
      }
    } catch (e) {
      console.error(e);
      if (active) setError("Error cargando la reseña");
    }
  };

  loadReview(); // llamamos la función async

  return () => {
    active = false;
  };
}, [slug]);


  if (error === "No encontrada") {
    return (
      <main className="max-w-3xl mx-auto px-4 py-10">
        <button
          onClick={() => router.back()}
          className="mb-6 text-blue-600 font-semibold"
        >
          ← Volver atrás
        </button>
        <p className="text-gray-600">No encontramos esa reseña.</p>
      </main>
    );
  }

  if (!review) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="animate-pulse bg-white rounded-xl shadow-lg h-96" />
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <button
          onClick={() => router.back()}
          className="mb-6 text-blue-600 font-semibold cursor-pointer"
        >
          ← Volver atrás
        </button>

        <img
          src={review.imagenUrl}
          alt={review.titulo}
          className="w-full h-72 object-cover rounded-lg shadow mb-8"
        />

        <h1 className="text-4xl font-extrabold mb-4 text-gray-900">
          {review.titulo}
        </h1>
        <p className="text-lg text-gray-900 font-semibold mb-6">
          {review.descripcion}
        </p>

        <div
          className="prose prose-lg text-gray-900 font-normal mb-8"
          dangerouslySetInnerHTML={{ __html: review.contenido }}
        />

        <div className="text-right text-base text-gray-700 font-semibold">
          Autor: <span className="font-bold">{review.autor}</span>
        </div>
      </div>
    </main>
  );
}
