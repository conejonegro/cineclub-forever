// layout.tsx o _app.tsx
import { Montserrat, Lato } from "next/font/google";
import "./globals.css";
import NavComponent from "@/components/NavComponent";
import Footer from "@/components/footer/Footer";
import  UserProvider  from "@/components/UserProvider";
import { Analytics } from "@vercel/analytics/next";
export const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "700"], // Ajusta los pesos según necesidad
});

export const lato = Lato({
  subsets: ["latin"],
  variable: "--font-lato",
  weight: ["400", "700"],
});

export const metadata = {
  metadataBase: new URL("https://cineclub-forever.vercel.app"),
  title: "Cineclub Forever | Trlvdsgn",
  description: "Cineclub Forever es un espacio para disfrutar y compartir películas de culto, cine independiente y obras maestras del séptimo arte. Únete a nuestra comunidad cinéfila.",
  openGraph: {
    title: "Cineclub Forever",
    description: "Cineclub Forever es un espacio para disfrutar y compartir películas de culto, cine independiente y obras maestras del séptimo arte.",
    url: "https://cineclub-forever.vercel.app",
    siteName: "Cineclub Forever",
    images: [
      {
        url: "/cineclub-logo.png",
        width: 1200,
        height: 630,
        alt: "Cineclub Forever",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cineclub Forever",
    description: "Cineclub Forever es un espacio para disfrutar y compartir películas de culto, cine independiente y obras maestras del séptimo arte.",
    images: ["/cineclub-logo.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${lato.variable} antialiased`}>
        <UserProvider>
          <NavComponent />

          {children}
          <Analytics />
          <Footer />
        </UserProvider>
      </body>
    </html>
  );
}
