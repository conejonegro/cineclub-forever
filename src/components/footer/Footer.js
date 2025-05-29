import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10 px-4 mt-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo + descripción */}
        <div>
          <Image
            src="/cineclub-logo.png"
            alt="Cineclub Logo"
            className="h-12 mb-4"
            width={48}
            height={48}
          />
          <p className="text-sm text-gray-300">
            Streaming de Películas seleccionadas por <strong>Cineclub Forever<sup>®</sup></strong> en Guadalajara, Jalisco, México. Sitio creado por <strong>TRLVDSGN<sup>™</sup></strong>.
          </p>
        </div>

        {/* Sitemap */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Sitemap</h2>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>
              <Link href="/" className="hover:text-white">Inicio</Link>
            </li>
            <li>
              <Link href="/peliculas" className="hover:text-white">Películas</Link>
            </li>
            <li>
              <Link href="/contacto" className="hover:text-white">Contacto</Link>
            </li>
          </ul>
        </div>

        {/* Friend sites */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Friend Sites</h2>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>
              <a href="https://trlvdsgn.website/" target="_blank" rel="noreferrer" className="hover:text-white">
                True Love Design = TRLVDSGN
              </a>
            </li>
            <li>
              <a href="https://store.trlvdsgn.website/" target="_blank" rel="noreferrer" className="hover:text-white">
                TRLVDSGN Store
              </a>
            </li>
          </ul>
        </div>

        {/* Contacto */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Contáctanos</h2>
          <p className="text-sm text-gray-300">Tel: +52 33-2343-1091</p>
          <p className="text-sm text-gray-300">
            Email: <a href="mailto:trlvdsgn@gmail.com" className="text-blue-400 hover:underline">trlvdsgn@gmail.com</a>
          </p>
          <p className="text-sm text-gray-300">
            Dirección: Lerdo de Tejada 2407 B, Col. Arcos Vallarta, Guadalajara, Jalisco, México
          </p>
        </div>
      </div>
    </footer>
  );
}