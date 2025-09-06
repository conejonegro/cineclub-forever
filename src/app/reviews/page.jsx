import React from "react";
import Link from "next/link"; // Si usas Next.js

// Dummy data: array de reseñas
const reviews = [
  {
    titulo: "El arte de contar historias en el cine",
    descripcion:
      "Una reflexión sobre cómo el cine transforma emociones y conecta culturas.",
    imagen:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
    autor: "Conejo Negro",
  },
  {
    titulo: "Cine independiente: creatividad sin límites",
    descripcion: "Exploramos el impacto de las películas fuera de Hollywood.",
    imagen:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
    autor: "Ana Luna",
  },
  {
    titulo: "La evolución del cine de terror",
    descripcion: "De los clásicos a los nuevos sustos psicológicos.",
    imagen:
      "https://images.unsplash.com/photo-1517602302552-471fe67acf66?auto=format&fit=crop&w=800&q=80",
    autor: "Luis Fantasma",
  },
  {
    titulo: "Comedia en pantalla grande",
    descripcion: "¿Por qué reímos en el cine? Un análisis de la comedia.",
    imagen:
      "https://images.unsplash.com/photo-1465101178521-c1a4c8a0f8a0?auto=format&fit=crop&w=800&q=80",
    autor: "Sofía Risas",
  },
  // Puedes agregar más reseñas aquí
];

// Componente Card para cada review
function ReviewCard({ titulo, descripcion, imagen, autor }) {
  const slug = titulo.slice(0, 2).toLowerCase();
  return (
    <Link
      href={`/reviews/${slug}`}
      className="hover:scale-[1.03] transition-transform"
    >
      <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col cursor-pointer h-full">
        <img src={imagen} alt={titulo} className="h-40 w-full object-cover" />
        <div className="p-4 flex-1 flex flex-col">
          <h2 className="text-xl font-bold mb-1 text-gray-900">{titulo}</h2>
          <p className="text-gray-700 mb-2 flex-1 font-medium">
            {descripcion}
          </p>
          <span className="text-sm text-gray-500 mt-auto">Autor: {autor}</span>
        </div>
      </div>
    </Link>
  );
}

// Página principal de reviews en grid
export default function ReviewsBlogPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Reseñas de Cine</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {reviews.map((review, idx) => (
          <ReviewCard key={idx} {...review} />
        ))}
      </div>
    </main>
  );
}