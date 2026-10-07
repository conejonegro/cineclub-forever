"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/components/FirebaseSettings";
import { getCatalogSlug } from "@/lib/catalogo";
import { searchFirstTmdbMovie } from "@/lib/tmdbSearch";

// Lista las solicitudes del usuario y marca las que ya subimos al catálogo
export default function MisSolicitudes({ email }) {
  const [requests, setRequests] = useState(null);

  useEffect(() => {
    if (!email) return;

    async function fetchMyRequests() {
      const normalizedEmail = email.trim().toLowerCase();
      const snapshot = await getDocs(
        query(collection(db, "movie_requests"), where("email", "==", normalizedEmail))
      );

      const mine = await Promise.all(
        snapshot.docs.map(async (requestDoc) => {
          const data = requestDoc.data();
          // Solicitudes viejas (solo título): resolvemos su tmdb_id por título (ver docs/adr/0003)
          const legacyMatch = data.tmdb_id ? null : await searchFirstTmdbMovie(data.movie_title ?? "");
          const tmdbId = data.tmdb_id ?? legacyMatch?.id ?? null;
          return {
            id: requestDoc.id,
            title: data.movie_title,
            posterPath: data.poster_path ?? legacyMatch?.poster_path ?? null,
            createdAt: data.created_at?.toMillis?.() ?? 0,
            catalogSlug: getCatalogSlug(tmdbId),
          };
        })
      );

      // Primero las disponibles, luego las más recientes
      mine.sort(
        (a, b) => Number(Boolean(b.catalogSlug)) - Number(Boolean(a.catalogSlug)) || b.createdAt - a.createdAt
      );
      setRequests(mine);
    }

    fetchMyRequests().catch(() => setRequests([]));
  }, [email]);

  return (
    <section className="mt-12 max-w-xl">
      {/* Section divider */}
      <div className="flex items-center gap-4 mb-6">
        <span
          className="text-white/35 text-[10px] font-semibold tracking-[0.35em] uppercase"
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          Mis solicitudes
        </span>
        <div className="h-px flex-1 bg-white/10" />
        {requests && (
          <span className="text-white/20 text-[10px] tracking-widest">
            {requests.length} de 5
          </span>
        )}
      </div>

      {requests === null && (
        <p className="text-white/30 text-xs tracking-[0.3em] uppercase">Cargando</p>
      )}

      {requests?.length === 0 && (
        <p className="text-white/40 text-sm">
          Aún no has solicitado películas.{" "}
          <Link
            href="/solicitar-pelicula"
            className="text-amber-400 hover:text-amber-300 transition-colors duration-200"
          >
            Propón una
          </Link>
          .
        </p>
      )}

      {requests?.length > 0 && (
        <ul className="flex flex-col gap-2">
          {requests.map((request) => (
            <li
              key={request.id}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md bg-white/[0.03] border ${
                request.catalogSlug ? "border-emerald-400/30" : "border-white/[0.06]"
              }`}
            >
              {request.posterPath ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_IMG_PATH}${request.posterPath}`}
                  alt={request.title}
                  className="w-8 h-12 object-cover rounded-sm flex-shrink-0"
                />
              ) : (
                <div className="w-8 h-12 rounded-sm bg-white/[0.04] flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p
                  className="text-white/85 text-xs font-semibold truncate"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  {request.title}
                </p>
                <p
                  className={`text-[10px] mt-0.5 ${
                    request.catalogSlug ? "text-emerald-400/80" : "text-white/30"
                  }`}
                >
                  {request.catalogSlug ? "¡Ya está disponible!" : "Pendiente"}
                </p>
              </div>
              {request.catalogSlug && (
                <Link
                  href={`/peliculas-detalle/${request.catalogSlug}`}
                  className="text-emerald-400 hover:text-emerald-300 text-xs font-bold flex-shrink-0 transition-colors duration-200"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  Ver ahora →
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
