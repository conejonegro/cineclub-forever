"use client";

import { useEffect, useContext, useState } from "react";
import { auth } from "@/components/FirebaseSettings";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useRouter } from "next/navigation";
import { UserContext } from "@/components/UserProvider";

const provider = new GoogleAuthProvider();

export default function Login() {
  const router = useRouter();
  const { user } = useContext(UserContext);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Redirige si ya hay sesión activa
  useEffect(() => {
    if (user) router.push("/");
  }, [user, router]);

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithPopup(auth, provider);
      router.push("/");
    } catch (err) {
      console.error("[login] popup error:", err.code, err.message);
      setError("Hubo un error al iniciar sesión. Intenta de nuevo.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-6">
      <div className="w-full max-w-sm flex flex-col items-center gap-8">

        {/* Logo / título */}
        <div className="flex flex-col items-center gap-2 text-center">
          <p
            className="text-white/50 text-[10px] uppercase tracking-[0.3em] font-semibold"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Cineclub
          </p>
          <h1
            className="text-white text-2xl font-bold"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Iniciar sesión
          </h1>
          <p className="text-white/30 text-sm">
            Accede para solicitar películas, votar y más.
          </p>
        </div>

        {/* Botón Google */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white/[0.05] hover:bg-white/[0.09] disabled:opacity-40 border border-white/[0.08] hover:border-white/[0.14] text-white/80 text-sm font-semibold py-3 px-5 rounded-full transition-colors duration-200"
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          <GoogleIcon />
          {loading ? "Cargando..." : "Continuar con Google"}
        </button>

        {error && (
          <p className="text-red-400/80 text-xs text-center">{error}</p>
        )}

      </div>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.20455C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z" fill="#4285F4"/>
      <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z" fill="#34A853"/>
      <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z" fill="#FBBC05"/>
      <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335"/>
    </svg>
  );
}
