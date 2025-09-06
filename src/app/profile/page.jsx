"use client";

import { auth } from "@/components/FirebaseSettings";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "@/components/UserProvider"; // 🔥 Importar el contexto
import Image from "next/image";

function Logout() {
  const router = useRouter();
  const { setUser } = useContext(UserContext); // 🔥 Tomamos setUser global


const { user: userData } = useContext(UserContext);


async function logOutFromCineclub() {
  try {
    await signOut(auth);
    setUser(null);           // ✅ Esto es lo correcto
    router.push("/");        // ✅ Redirige a home
  } catch (error) {
    console.error("Error cerrando sesión:", error.message);
  }
}


  if (userData === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <h1 className="text-xl font-semibold text-gray-700">
          Cargando perfil...
        </h1>
      </div>
    );
  }

  if (userData === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <h1 className="text-xl font-semibold text-gray-700">
          Esta ruta debería estar protegida si no hay usuario.
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Perfil</h1>

        {userData.photoURL && (
          <Image
            src={userData.photoURL}
            width={96}
            height={96}
            alt={`${userData.displayName} Photo`}
            className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
          />
        )}

        {userData.displayName && (
          <p className="text-gray-700 font-medium mb-2">
            <b>Nombre:</b> {userData.displayName}
          </p>
        )}

        <p className="text-gray-600 mb-4">
          <b>Email:</b> {userData.email}
        </p>

        <button
          type="button"
          onClick={logOutFromCineclub}
          className="w-full bg-red-500 hover:bg-red-600 cursor-pointer text-white font-semibold py-2 px-4 rounded-xl transition duration-200"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

export default Logout;
