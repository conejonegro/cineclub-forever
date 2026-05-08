"use client";

import { useEffect, useState, useContext } from "react";
import { collection, getDocs, doc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "@/components/FirebaseSettings";
import { UserContext } from "@/components/UserProvider";

export default function PeliculasSolicitadasPage() {
  const [grouped, setGrouped] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (!user?.email) return;
    const email = user.email.toLowerCase().trim();
    getDoc(doc(db, "admins", email)).then((snap) => {
      if (snap.exists()) setIsAdmin(true);
    });
  }, [user]);

  async function fetchRequests() {
    const snapshot = await getDocs(collection(db, "movie_requests"));
    const counts = snapshot.docs.reduce((acc, d) => {
      const title = d.data().movie_title?.trim().toLowerCase();
      if (!title) return acc;
      const display = d.data().movie_title?.trim();
      if (!acc[title]) {
        acc[title] = { display, count: 0, ids: [], requesters: [] };
      }
      acc[title].count += 1;
      acc[title].ids.push(d.id);
      const { name, email } = d.data();
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

    const enriched = sorted.map((item, i) => ({ ...item, tmdb: tmdbResults[i] }));
    setGrouped(enriched);
  }

  useEffect(() => {
    fetchRequests();
  }, []);

  async function handleDelete(ids, key) {
    if (!confirm("¿Borrar todas las solicitudes de esta película?")) return;
    await Promise.all(ids.map((id) => deleteDoc(doc(db, "movie_requests", id))));
    setGrouped((prev) => prev.filter((item) => item.display.toLowerCase() !== key));
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2 text-center">Películas solicitadas</h1>
      <p className={`text-gray-500 text-center ${!user ? "mb-2" : "mb-8"}`}>
        Las películas que el cineclub ha propuesto hasta ahora.
      </p>
      {!user && (
        <p className="text-center text-sm text-gray-400 mb-8">
          Para solicitar una película{" "}
          <a href="/login" className="text-blue-400 hover:underline">
            inicia sesión
          </a>
          .
        </p>
      )}

      {grouped === null ? null : grouped.length === 0 ? (
        <p className="text-gray-500 text-center">
          Aún no hay solicitudes. ¡Sé el primero en pedir una película!
        </p>
      ) : (
        <ul className="bg-white rounded-lg shadow-md divide-y divide-gray-100">
          {grouped.map(({ display, count, ids, requesters, tmdb }) => (
            <li key={display.toLowerCase()} className="flex items-center gap-4 px-6 py-4">
              {tmdb?.poster_path ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_IMG_PATH}${tmdb.poster_path}`}
                  alt={tmdb.title}
                  className="w-12 rounded object-cover shrink-0"
                  style={{ height: "72px" }}
                />
              ) : (
                <div className="w-12 shrink-0 rounded bg-gray-200" style={{ height: "72px" }} />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {tmdb?.title ?? display}
                </p>
                {tmdb && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    ★ {tmdb.vote_average.toFixed(1)}{" "}
                    ({tmdb.vote_count.toLocaleString("es-MX")} votos)
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  {count} {count === 1 ? "solicitud" : "solicitudes"}
                </p>
                {isAdmin && requesters.length > 0 && (
                  <ul className="mt-1 space-y-0.5">
                    {requesters.map((r, i) => (
                      <li key={i} className="text-xs text-gray-400">
                        {r.name && r.email
                          ? `${r.name} — ${r.email}`
                          : r.name ?? r.email}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {isAdmin && (
                <button
                  onClick={() => handleDelete(ids, display.toLowerCase())}
                  className="ml-2 text-red-400 hover:text-red-600 text-xs shrink-0"
                  title="Borrar película"
                >
                  Borrar
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
