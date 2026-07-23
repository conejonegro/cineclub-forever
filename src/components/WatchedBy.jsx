"use client";

import { useEffect, useState } from "react";
import { fetchWatchedBySlug } from "@/lib/getWatched/watched";

export default function WatchedBy({ movieSlug }) {
  const [watchers, setWatchers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWatchedBySlug(movieSlug).then((data) => {
      setWatchers(data);
      setLoading(false);
    });
  }, [movieSlug]);

  if (loading || watchers.length === 0) return null;

  return (
    <section className="mb-16 w-full md:max-w-[50%]">
      <h2
        className="text-white/60 text-[9px] md:text-xs uppercase tracking-[0.3em] mb-4"
        style={{ fontFamily: "var(--font-montserrat)" }}
      >
        Quién la ha visto
      </h2>
      <ul className="flex flex-col gap-2">
        {watchers.map((watcher) => (
          <li
            key={watcher.id}
            className="bg-zinc-900 border border-white/[0.07] rounded-lg px-4 py-3 flex items-center justify-between"
          >
            <span className="flex items-center gap-2 text-white text-sm md:text-base font-semibold">
              <span className="text-green-500">✓</span>
              {watcher.userName}
            </span>
            <span className="text-white/30 text-xs md:text-sm">{watcher.userEmail}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
