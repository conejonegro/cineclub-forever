// layout.tsx o _app.tsx
import { Montserrat, Lato } from "next/font/google";
import "./globals.css";
import NavComponent from "@/components/NavComponent";
import Footer from "@/components/footer/Footer";
import { UserProvider } from "@/components/UserProvider";

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
  title: "Cineclub Forever | Trlvdsgn",
  description: "Cineclub Forever es un espacio para disfrutar y compartir películas de culto, cine independiente y obras maestras del séptimo arte. Únete a nuestra comunidad cinéfila.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${lato.variable} antialiased`}>
        <UserProvider>
          <NavComponent />

          {children}
          <Footer />
        </UserProvider>
      </body>
    </html>
  );
}
