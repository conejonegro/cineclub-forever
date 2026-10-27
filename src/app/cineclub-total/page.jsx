import VidapiTester from "./VidapiTester";

export const metadata = {
  title: "VidAPI (prueba) | Cineclub Forever",
  robots: { index: false, follow: false },
};

export default function VidapiTestPage() {
  return (
    <main className="min-h-screen bg-[#0d0d0d]">
      <div className="max-w-6xl mx-auto px-6 md:px-14 py-14">
        <div className="mb-8">
          <p
            className="text-white/50 text-[10px] uppercase tracking-[0.3em] mb-2 font-semibold"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Experimento
          </p>
          <h1
            className="text-white text-3xl font-bold"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            VidAPI
          </h1>
          <p className="text-white/40 text-sm mt-2 max-w-2xl">
            Página de prueba del reproductor embebido de vaplayer.ru (TMDB o IMDB ID). Solo para
            testear, no está enlazada en el sitio.
          </p>
        </div>

        <VidapiTester />
      </div>
    </main>
  );
}
