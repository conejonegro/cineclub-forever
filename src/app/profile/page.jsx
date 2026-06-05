"use client";

import { auth } from "@/components/FirebaseSettings";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { UserContext } from "@/components/UserProvider";
import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";

function ProfilePage() {
  const router = useRouter();
  const { user: userData, setUser } = useContext(UserContext);

  async function logOutFromCineclub() {
    try {
      await signOut(auth);
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Error cerrando sesión:", error.message);
    }
  }

  if (userData === undefined) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <p className="text-white/30 text-xs tracking-[0.4em] uppercase">Cargando</p>
      </div>
    );
  }

  if (userData === null) return null;

  return (
    <main className="min-h-screen bg-[#0d0d0d]">
      <div className="max-w-6xl mx-auto px-6 md:px-14 py-14">

        {/* Header */}
        <div className="mb-10">
          <p
            className="text-white/50 text-[10px] uppercase tracking-[0.3em] mb-2 font-semibold"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Cuenta
          </p>
          <h1
            className="text-white text-3xl font-bold"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Mi perfil
          </h1>
        </div>

        {/* Card */}
        <div className="max-w-sm bg-white/[0.03] border border-white/[0.06] rounded-xl p-8 flex flex-col items-center gap-6">

          {/* Avatar */}
          {userData.photoURL ? (
            <Image
              src={userData.photoURL}
              width={80}
              height={80}
              alt={`Foto de ${userData.displayName ?? "usuario"}`}
              className="w-20 h-20 rounded-full object-cover ring-2 ring-white/10"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-white/[0.06] flex items-center justify-center ring-2 ring-white/10">
              <FaUserCircle className="text-white/20" size={40} />
            </div>
          )}

          {/* Info */}
          <div className="w-full flex flex-col divide-y divide-white/[0.06]">
            <div className="py-3 flex flex-col gap-0.5">
              <span
                className="text-white/40 text-[10px] uppercase tracking-[0.2em]"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                Nombre
              </span>
              <span className="text-white/90 text-sm font-medium">
                {userData.displayName ?? "Usuario"}
              </span>
            </div>
            <div className="py-3 flex flex-col gap-0.5">
              <span
                className="text-white/40 text-[10px] uppercase tracking-[0.2em]"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                Correo
              </span>
              <span className="text-white/90 text-sm font-medium">
                {userData.email ?? "Sin correo registrado"}
              </span>
            </div>
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={logOutFromCineclub}
            className="w-full border border-white/10 hover:border-red-400/40 text-white/40 hover:text-red-400 text-sm font-medium py-2.5 rounded-full transition-colors duration-200 cursor-pointer"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Cerrar sesión
          </button>

        </div>

      </div>
    </main>
  );
}

export default ProfilePage;
