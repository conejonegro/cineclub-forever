"use client";

import { useEffect, useState, useContext } from "react";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/components/FirebaseSettings";
import { UserContext } from "@/components/UserProvider";
import Link from "next/link";

export default function PeliculasSolicitadasPage() {
  const [grouped, setGrouped] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [votedMovieKeys, setVotedMovieKeys] = useState(new Set());
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (!user?.email) return;
    const email = user.email.toLowerCase().trim();
    getDoc(doc(db, "admins", email)).then((snap) => {
      if (snap.exists()) setIsAdmin(true);
    });
  }, [user]);

  async function fetchRequests() {
    const [requestsSnapshot, votesSnapshot] = await Promise.all([
      getDocs(collection(db, "movie_requests")),
      getDocs(collection(db, "movie_votes")),
    ]);

    const voteCountsByKey = {};
    votesSnapshot.docs.forEach((voteDoc) => {
      const movieKey = voteDoc.data().movie_key;
      if (!movieKey) return;
      voteCountsByKey[movieKey] = (voteCountsByKey[movieKey] ?? 0) + 1;
    });

    if (user?.email) {
      const currentUserEmail = user.email.toLowerCase().trim();
      const userKeys = new Set(
        votesSnapshot.docs
          .filter((voteDoc) => voteDoc.data().user_email === currentUserEmail)
          .map((voteDoc) => voteDoc.data().movie_key)
      );
      setVotedMovieKeys(userKeys);
    }

    const counts = requestsSnapshot.docs.reduce((acc, movieDoc) => {
      const title = movieDoc.data().movie_title?.trim().toLowerCase();
      if (!title) return acc;
      const display = movieDoc.data().movie_title?.trim();
      if (!acc[title]) {
        acc[title] = { display, count: 0, ids: [], requesters: [] };
      }
      acc[title].count += 1;
      acc[title].ids.push(movieDoc.id);
      const { name, email } = movieDoc.data();
      if (name || email) acc[title].requesters.push({ name, email });
      return acc;
    }, {});

    const sorted = Object.values(counts).sort((a, b) => b.count - a.count);

    const tmdbResults = await Promise.all(
      sorted.map(async ({ display }) => {
        try {
          const res = await fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&query=${encodeURIComponent(display)}&language=es-MX`
          );
          const data = await res.json();
          return data.results?.[0] ?? null;
        } catch {
          return null;
        }
      })
    );

    const enriched = sorted.map((item, i) => ({
      ...item,
      tmdb: tmdbResults[i],
      voteCount: voteCountsByKey[item.display.trim().toLowerCase()] ?? 0,
    }));
    setGrouped(enriched);
  }

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleDelete(ids, key) {
    if (!confirm("¿Borrar todas las solicitudes de esta película?")) return;
    await Promise.all(ids.map((id) => deleteDoc(doc(db, "movie_requests", id))));
    setGrouped((prev) => prev.filter((item) => item.display.toLowerCase() !== key));
  }

  async function handleVote(movieKey) {
    const normalizedEmail = user.email.toLowerCase().trim();
    const voteDocId = `${movieKey}__${normalizedEmail}`;

    setVotedMovieKeys((prev) => new Set([...prev, movieKey]));
    setGrouped((prev) =>
      prev.map((item) =>
        item.display.trim().toLowerCase() === movieKey
          ? { ...item, voteCount: item.voteCount + 1 }
          : item
      )
    );

    await setDoc(doc(db, "movie_votes", voteDocId), {
      movie_key: movieKey,
      user_email: normalizedEmail,
      voted_at: serverTimestamp(),
    });
  }

  return (
    <main className="min-h-screen bg-[#0d0d0d]">
      <div className="max-w-6xl mx-auto px-6 md:px-14 py-14">

        {/* Header */}
        <div className="mb-10">
          <p
            className="text-white/50 text-[10px] uppercase tracking-[0.3em] mb-2 font-semibold"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Comunidad
          </p>
          <h1
            className="text-white text-3xl font-bold"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Películas solicitadas
          </h1>
          <p className="text-white/40 text-sm mt-2">
            Las películas que el cineclub ha propuesto hasta ahora.
          </p>
          {!user && (
            <p className="text-white/40 text-sm mt-1">
              Para solicitar una película y votar{" "}
              <Link
                href="/login"
                className="text-amber-400 hover:text-amber-300 transition-colors duration-200"
              >
                inicia sesión
              </Link>
              .
            </p>
          )}
        </div>

        {/* Section divider */}
        <div className="flex items-center gap-4 mb-8">
          <span
            className="text-white/35 text-[10px] font-semibold tracking-[0.35em] uppercase"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Solicitudes
          </span>
          <div className="h-px flex-1 bg-white/10" />
          {grouped && (
            <span className="text-white/20 text-[10px] tracking-widest">
              {grouped.length} {grouped.length === 1 ? "película" : "películas"}
            </span>
          )}
        </div>

        {/* Loading skeleton */}
        {grouped === null && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="animate-pulse flex flex-col gap-2">
                <div className="w-full aspect-[2/3] rounded-sm bg-white/[0.04]" />
                <div className="h-3 bg-white/[0.04] rounded w-3/4" />
                <div className="h-2.5 bg-white/[0.03] rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {grouped?.length === 0 && (
          <p className="text-white/30 text-sm text-center py-20">
            Aún no hay solicitudes. ¡Sé el primero en pedir una película!
          </p>
        )}

        {/* Grid */}
        {grouped?.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {grouped.map(({ display, ids, requesters, tmdb, voteCount }, index) => {
              const movieKey = display.trim().toLowerCase();
              const alreadyVoted = votedMovieKeys.has(movieKey);
              return (
                <div key={movieKey} className="flex flex-col gap-2">

                  {/* Poster */}
                  <div className="relative w-full aspect-[2/3] rounded-sm overflow-hidden bg-white/[0.04] border border-white/[0.08]">
                    {tmdb?.poster_path && (
                      <img
                        src={`${process.env.NEXT_PUBLIC_IMG_PATH}${tmdb.poster_path}`}
                        alt={tmdb?.title ?? display}
                        className="w-full h-full object-cover"
                      />
                    )}
                    {/* Rank badge */}
                    <span className="absolute top-2 left-2 text-[10px] font-bold text-white/60 bg-black/50 px-1.5 py-0.5 rounded font-mono">
                      {index + 1}
                    </span>
                    {/* Admin delete */}
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(ids, movieKey)}
                        className="absolute top-2 right-2 text-[10px] text-white/40 hover:text-red-400 bg-black/50 px-1.5 py-0.5 rounded transition-colors duration-200"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex flex-col gap-1 px-0.5">
                    <p
                      className="text-white/90 text-xs font-semibold leading-snug line-clamp-2"
                      style={{ fontFamily: "var(--font-montserrat)" }}
                    >
                      {tmdb?.title ?? display}
                    </p>
                    {requesters.length > 0 && (
                      <p className="text-white/30 text-[10px] truncate">
                        {requesters.map((r) => r.name ?? r.email).join(", ")}
                      </p>
                    )}

                    {/* Vote */}
                    {user ? (
                      <button
                        onClick={() => !alreadyVoted && handleVote(movieKey)}
                        disabled={alreadyVoted}
                        className={`mt-0.5 flex items-center gap-1 text-xs font-bold transition-colors duration-200 w-fit ${
                          alreadyVoted
                            ? "text-amber-400/50 cursor-default"
                            : "text-amber-400 hover:text-amber-300 cursor-pointer"
                        }`}
                        style={{ fontFamily: "var(--font-montserrat)" }}
                      >
                        <span>{alreadyVoted ? "✓" : "↑"}</span>
                        <span>{voteCount} {voteCount === 1 ? "voto" : "votos"}</span>
                      </button>
                    ) : (
                      <span className="text-white/25 text-[10px] tabular-nums mt-0.5">
                        {voteCount} {voteCount === 1 ? "voto" : "votos"}
                      </span>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </main>
  );
}
