"use client";

import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { UserContext } from "@/components/UserProvider";
import { fetchCommentsBySlug, createComment } from "@/lib/getComments/comments";

function relativeDate(isoString) {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (days >= 1) return `hace ${days} ${days === 1 ? "día" : "días"}`;
  if (hours >= 1) return `hace ${hours} ${hours === 1 ? "hora" : "horas"}`;
  if (minutes >= 1) return `hace ${minutes} ${minutes === 1 ? "minuto" : "minutos"}`;
  return "justo ahora";
}

const MAX_CHARS = 500;

export default function Comments({ movieSlug }) {
  const { user } = useContext(UserContext);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCommentsBySlug(movieSlug).then((data) => {
      setComments(data);
      setLoading(false);
    });
  }, [movieSlug]);

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed || submitting) return;

    setSubmitting(true);
    try {
      await createComment(movieSlug, user, trimmed);

      const optimistic = {
        id: `optimistic-${Date.now()}`,
        movieSlug,
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || user.email,
        content: trimmed,
        createdAt: new Date().toISOString(),
      };

      setComments((prev) => [optimistic, ...prev]);
      setContent("");
      toast.success("Comentario publicado");
    } catch {
      toast.error("No se pudo publicar el comentario");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mt-10 mb-16">
      <h2
        className="text-white/20 text-[9px] uppercase tracking-[0.3em] mb-6"
        style={{ fontFamily: "var(--font-montserrat)" }}
      >
        Comentarios
      </h2>

      {user && (
        <form onSubmit={handleSubmit} className="mb-8">
          <h2
            className="text-white/50 text-sm font-semibold mb-3"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Deja un comentario
          </h2>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value.slice(0, MAX_CHARS))}
            placeholder="Escribe tu comentario…"
            rows={3}
            className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-3 text-sm resize-none placeholder:text-white/30 focus:outline-none focus:border-amber-400 transition-colors"
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-white/30 text-xs">
              {content.length} / {MAX_CHARS}
            </span>
            <button
              type="submit"
              disabled={!content.trim() || submitting}
              className="bg-amber-400 text-black text-xs font-bold uppercase tracking-widest px-5 py-2 rounded-lg hover:bg-amber-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? "Enviando…" : "Comentar"}
            </button>
          </div>
        </form>
      )}

      {!user && user !== undefined && (
        <p className="text-white/40 text-sm mb-8">Inicia sesión para comentar</p>
      )}

      {loading ? (
        <div className="flex items-center gap-3 text-white/30 text-sm">
          <span className="w-4 h-4 border-2 border-white/20 border-t-amber-400 rounded-full animate-spin" />
          Cargando comentarios…
        </div>
      ) : comments.length === 0 ? (
        <p className="text-white/30 text-sm">Sé el primero en comentar</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {comments.map((comment) => (
            <li key={comment.id} className="bg-zinc-900 border border-white/[0.07] rounded-lg px-5 py-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white text-sm font-semibold">{comment.userName}</span>
                <span className="text-white/30 text-xs">
                  {comment.createdAt ? relativeDate(comment.createdAt) : ""}
                </span>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">{comment.content}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
