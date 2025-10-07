"use client";

import { useRouter } from "next/navigation";

export default function ReviewContent({ review }) {
  const router = useRouter();

  return (
    <>
      <button
        onClick={() => router.back()}
        className="mb-6 text-blue-600 font-semibold cursor-pointer hover:underline flex items-center gap-1"
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
    </>
  );
}
