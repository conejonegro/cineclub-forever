// /lib/firebase.js o donde tengas la config

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB4inu3nJ8z6w9zLNyImLLpnBE_A-jnLKw",
  authDomain: "cineclub-forever.firebaseapp.com",
  projectId: "cineclub-forever",
  storageBucket: "cineclub-forever.appspot.com",
  messagingSenderId: "136815813538",
  appId: "1:136815813538:web:e33c7164516bb34a4448fb",
  databaseURL: "https://cineclub-forever-default-rtdb.firebaseio.com/"
};

// Inicializamos la app solo si no existe
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db }; // <-- ahora sí exporta app
