"use client";

import { auth } from "@/components/FirebaseSettings";
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useContext } from "react";
import { toast, Toaster } from "react-hot-toast";
import { UserContext } from "@/components/UserProvider";
import Image from "next/image";

const provider = new GoogleAuthProvider();

function Login() {
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);

  const [email, setInputEmail] = useState("");
  const [password, setInputPassword] = useState("");

  function handleValueEmail(e) {
    setInputEmail(e.target.value);
  }

  function handleValuePassword(e) {
    setInputPassword(e.target.value);
  }

  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      localStorage.setItem("userData", JSON.stringify(user));
      setUser(true);
      toast.success("¡Inicio de sesión exitoso con Google! 🎉");
      router.push("/");
    } catch (error) {
      console.error(error.message);
      toast.error("Error al iniciar sesión con Google.");
    }
  };

  const userPasswordLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      localStorage.setItem("userData", JSON.stringify(user));
      setUser(true);
      toast.success("¡Inicio de sesión exitoso! 🎉");
      router.push("/");
    } catch (error) {
      const notifyError = (message) => {
        toast.error(message, { duration: 4000 });
      };

      if (error.code === "auth/invalid-email" || error.code === "auth/invalid-login-credentials") {
        notifyError("Email o contraseña incorrectos.");
      } else {
        notifyError("Error al iniciar sesión.");
      }
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Image
            src="/cineclub-logo.png"
            alt="Cineclub logo"
            className="w-32 h-auto"
            width={128}
            height={128}
          />
        </div>

        <h2 className="text-2xl font-bold text-center mb-6 text-black">Iniciar Sesión</h2>

        <div className="flex flex-col gap-4 mb-6">
          {/* Botón de Google */}
          <button
            onClick={googleLogin}
            className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-xl transition duration-200"
          >
            <i className="fab fa-google"></i> Iniciar sesión con Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-2">
            <hr className="flex-grow border-gray-300" />
            <span className="text-gray-400">o</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Inputs Email y Password 
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-gray-600 text-sm mb-1">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={handleValueEmail}
                className="w-full border border-gray-300 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                placeholder="Ingresa tu correo"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-600 text-sm mb-1">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={handleValuePassword}
                className="w-full border border-gray-300 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
                placeholder="Ingresa tu contraseña"
              />
            </div>
          </div> */}

          {/* Botón de login con correo y contraseña 
          <button
            onClick={userPasswordLogin}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-xl transition duration-200 mt-4"
          >
            Iniciar sesión con correo
          </button> */}
        </div>

        {/* Recordarme y Olvidaste contraseña 
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-2">
            <input type="checkbox" id="remember" className="accent-primary-500" />
            <label htmlFor="remember" className="text-sm text-gray-600">
              Recuérdame
            </label>
          </div>
          <a href="#!" className="text-sm text-primary-500 hover:underline">
            ¿Olvidaste tu contraseña?
          </a>
        </div> */}

        {/* Registro 
        <p className="text-center text-sm text-gray-600 mt-6">
          ¿No tienes cuenta?{" "}
          <Link href="/registro" className="text-primary-500 font-bold hover:underline">
            Regístrate
          </Link>
        </p>*/}

        {/* Toasts */}
        <Toaster />
      </div>
    </section>
  );
}

export default Login;
