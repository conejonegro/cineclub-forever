"use client";

import { useRouter } from "next/navigation";

export default function ReviewContent({ review }) {
  const router = useRouter();

  return (
    <div className="max-w-3xl mx-auto px-6 md:px-14 py-16">

      <button
        onClick={() => router.back()}
        className="text-white/40 text-xs uppercase tracking-[0.25em] hover:text-amber-400 transition-colors mb-10 flex items-center gap-2"
        style={{ fontFamily: "var(--font-montserrat)" }}
      >
        ← Volver
      </button>

      <img
        src={review.imagenUrl}
        alt={review.titulo}
        className="w-full h-72 object-cover rounded-sm shadow-[0_20px_60px_rgba(0,0,0,0.7)] mb-10"
      />

      <p
        className="text-white/20 text-[9px] uppercase tracking-[0.3em] mb-3"
        style={{ fontFamily: "var(--font-montserrat)" }}
      >
        Reseña
      </p>

      <h1
        className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6"
        style={{ fontFamily: "var(--font-montserrat)" }}
      >
        {review.titulo}
      </h1>

      <div
        className="prose prose-invert prose-lg max-w-none mb-10
          prose-p:text-white/70 prose-p:leading-relaxed
          prose-headings:text-white prose-headings:font-bold
          prose-strong:text-white
          prose-a:text-amber-400 prose-a:no-underline hover:prose-a:underline
          prose-blockquote:border-l-amber-400 prose-blockquote:text-white/50"
        dangerouslySetInnerHTML={{ __html: review.contenido }}
      />

      <div className="border-t border-white/[0.07] pt-6 text-right">
        <span className="text-white/25 text-xs uppercase tracking-[0.25em]" style={{ fontFamily: "var(--font-montserrat)" }}>
          {review.autor}
        </span>
      </div>
    </div>
  );
}
