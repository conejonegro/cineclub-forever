"use client";

import React from "react";
import { useRouter } from "next/navigation";

// Ejemplo de datos de una reseña individual
const review = {
  titulo: "El arte de contar historias en el cine",
  descripcion: "Una reflexión sobre cómo el cine transforma emociones y conecta culturas.",
  contenido: `
    El cine es una de las formas más poderosas de expresión artística. A través de la pantalla, los directores y guionistas logran transmitir emociones, ideas y perspectivas únicas. 
    Desde los primeros días del cine mudo hasta las producciones modernas, la narrativa visual ha evolucionado constantemente, conectando culturas y generaciones.
    <br/><br/>
    En esta reseña exploramos cómo el lenguaje cinematográfico puede transformar la percepción del espectador y abrir nuevas puertas a la empatía y la creatividad.
  `,
  imagen: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
  autor: "Conejo Negro"
};

export default function ReviewPage() {
  const router = useRouter();

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
          src={review.imagen}
          alt={review.titulo}
          className="w-full h-72 object-cover rounded-lg shadow mb-8"
        />
        <h1 className="text-4xl font-extrabold mb-4 text-gray-900">{review.titulo}</h1>
        <p className="text-lg text-gray-900 font-semibold mb-6">{review.descripcion}</p>
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
