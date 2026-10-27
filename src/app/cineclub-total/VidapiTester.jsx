"use client";

import { useEffect, useMemo, useState } from "react";

const BASE_URL = "https://vaplayer.ru/embed";

const inputClass =
  "w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-white/40";
const labelClass = "block text-white/50 text-[10px] uppercase tracking-[0.2em] mb-1 font-semibold";

// Builds the vaplayer.ru embed URL from the form state (see https://vidapi.ru/api)
function buildEmbedUrl({ type, id, season, episode, lang, color, startAt, autoplay, subUrl }) {
  if (!id) return null;
  const path =
    type === "tv"
      ? `${BASE_URL}/tv/${encodeURIComponent(id)}/${season || 1}/${episode || 1}`
      : `${BASE_URL}/movie/${encodeURIComponent(id)}`;

  const params = new URLSearchParams();
  if (lang) params.set("ds_lang", lang);
  if (color) params.set("primaryColor", color);
  if (startAt) params.set("startAt", startAt);
  if (autoplay) params.set("autoplay", "1");
  if (subUrl) {
    params.set("sub_url", subUrl);
    params.set("sub_lang", "es");
    params.set("sub_label", "Español");
    params.set("sub_default", "true");
  }
  const query = params.toString();
  return query ? `${path}?${query}` : path;
}

export default function VidapiTester({ catalogo }) {
  const [form, setForm] = useState({
    type: "movie",
    id: catalogo[0]?.id ?? "",
    season: "1",
    episode: "1",
    lang: "es",
    color: "#e50914",
    startAt: "",
    autoplay: false,
    subUrl: "",
  });
  const [src, setSrc] = useState(() => buildEmbedUrl(form));
  const [events, setEvents] = useState([]);

  const previewUrl = useMemo(() => buildEmbedUrl(form), [form]);

  // The player reports its state to the parent window via postMessage
  useEffect(() => {
    const onMessage = (e) => {
      if (e.data?.type !== "PLAYER_EVENT") return;
      const { player_status, player_progress, player_duration, quality } = e.data.data ?? {};
      setEvents((prev) =>
        [
          {
            at: new Date().toLocaleTimeString(),
            status: player_status,
            progress: player_progress,
            duration: player_duration,
            quality: quality?.label,
            raw: e.data.data,
          },
          ...prev,
        ].slice(0, 50)
      );
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const update = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const load = (e) => {
    e.preventDefault();
    setEvents([]);
    setSrc(previewUrl);
  };

  return (
    <div className="grid lg:grid-cols-[320px_1fr] gap-8" style={{ fontFamily: "var(--font-montserrat)" }}>
      <form onSubmit={load} className="space-y-4">
        <div>
          <label className={labelClass}>Del catálogo</label>
          <select
            className={inputClass}
            value=""
            onChange={(e) => e.target.value && setForm((f) => ({ ...f, type: "movie", id: e.target.value }))}
          >
            <option value="">Elegir película…</option>
            {catalogo.map((m) => (
              <option key={m.id} value={m.id} className="bg-[#0d0d0d]">
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Tipo</label>
            <select className={inputClass} value={form.type} onChange={update("type")}>
              <option value="movie" className="bg-[#0d0d0d]">Película</option>
              <option value="tv" className="bg-[#0d0d0d]">Serie</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>TMDB / IMDB ID</label>
            <input className={inputClass} value={form.id} onChange={update("id")} placeholder="1240889 o tt…" />
          </div>
        </div>

        {form.type === "tv" && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Temporada</label>
              <input type="number" min="1" className={inputClass} value={form.season} onChange={update("season")} />
            </div>
            <div>
              <label className={labelClass}>Episodio</label>
              <input type="number" min="1" className={inputClass} value={form.episode} onChange={update("episode")} />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Idioma subs</label>
            <input className={inputClass} value={form.lang} onChange={update("lang")} placeholder="es" />
          </div>
          <div>
            <label className={labelClass}>Color</label>
            <input type="color" className={`${inputClass} h-[38px] p-1`} value={form.color} onChange={update("color")} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Empezar en (segundos)</label>
          <input type="number" min="0" className={inputClass} value={form.startAt} onChange={update("startAt")} />
        </div>

        <div>
          <label className={labelClass}>Subtítulo remoto (.vtt / .srt)</label>
          <input
            className={inputClass}
            value={form.subUrl}
            onChange={update("subUrl")}
            placeholder="https://…/miasma-subs-esp.vtt"
          />
        </div>

        <label className="flex items-center gap-2 text-white/70 text-sm">
          <input type="checkbox" checked={form.autoplay} onChange={update("autoplay")} />
          Autoplay
        </label>

        <button
          type="submit"
          className="w-full bg-white text-black text-sm font-semibold rounded-md py-2 hover:bg-white/80 transition-colors"
        >
          Cargar reproductor
        </button>

        <p className="text-white/30 text-[11px] break-all">{previewUrl}</p>
      </form>

      <div className="space-y-6">
        <div className="aspect-video bg-black rounded-lg overflow-hidden border border-white/10">
          {src ? (
            <iframe
              key={src}
              src={src}
              className="w-full h-full"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/30 text-sm">
              Escribe un ID y carga el reproductor
            </div>
          )}
        </div>

        <div>
          <h2 className="text-white/50 text-[10px] uppercase tracking-[0.3em] mb-2 font-semibold">
            Eventos del reproductor ({events.length})
          </h2>
          <div className="bg-white/5 border border-white/10 rounded-lg max-h-72 overflow-y-auto text-xs font-mono">
            {events.length === 0 ? (
              <p className="text-white/30 p-3">Sin eventos todavía (dale play).</p>
            ) : (
              events.map((ev, i) => (
                <details key={i} className="border-b border-white/5 px-3 py-2 text-white/70">
                  <summary className="cursor-pointer">
                    {ev.at} · <span className="text-white">{ev.status}</span> ·{" "}
                    {Math.round(ev.progress ?? 0)}s / {Math.round(ev.duration ?? 0)}s
                    {ev.quality ? ` · ${ev.quality}` : ""}
                  </summary>
                  <pre className="mt-2 text-white/50 whitespace-pre-wrap">{JSON.stringify(ev.raw, null, 2)}</pre>
                </details>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
