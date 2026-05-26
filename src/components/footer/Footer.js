import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#161616] border-t border-white/[0.08]">
      <div className="max-w-6xl mx-auto px-6 md:px-14 py-14">

        {/* Fila principal */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Logo + descripción */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/cineclub-logo.png"
                alt="Cineclub Logo"
                width={28}
                height={28}
                className="w-7 h-7 object-contain opacity-80"
              />
              <span
                className="text-white/70 text-sm font-bold tracking-wide"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                Cineclub Forever
              </span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              Streaming de películas seleccionadas por{" "}
              <span className="text-white/50">Cineclub Forever<sup>®</sup></span>{" "}
              en Guadalajara, Jalisco, México. Sitio creado por{" "}
              <span className="text-white/50">TRLVDSGN<sup>™</sup></span>.
            </p>
          </div>

          {/* Sitemap */}
          <div className="flex flex-col gap-4">
            <p
              className="text-white/50 text-[10px] uppercase tracking-[0.3em]"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              Sitemap
            </p>
            <ul className="flex flex-col gap-2">
              {[
                { label: "Inicio", href: "/" },
                { label: "Reviews", href: "/reviews" },
                { label: "Películas solicitadas", href: "/peliculas-solicitadas" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-white/70 hover:text-white text-sm transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div className="flex flex-col gap-4">
            <p
              className="text-white/50 text-[10px] uppercase tracking-[0.3em]"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              Contacto
            </p>
            <ul className="flex flex-col gap-2">
              <li>
                <a
                  href="mailto:trlvdsgn@gmail.com"
                  className="text-white/70 hover:text-amber-400 text-sm transition-colors duration-200"
                >
                  trlvdsgn@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://trlvdsgn.website/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-white/70 hover:text-white text-sm transition-colors duration-200"
                >
                  trlvdsgn.website
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Línea inferior */}
        <div className="border-t border-white/[0.08] pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-white/60 text-xs">
            © {new Date().getFullYear()} Cineclub Forever. Todos los derechos reservados.
          </p>
          <p className="text-white/15 text-[11px]">
            Guadalajara, Jalisco, México
          </p>
        </div>

      </div>
    </footer>
  );
}
