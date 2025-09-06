"use client";

import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/components/UserProvider";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/components/FirebaseSettings";
import SubirReviewDashboard from "./Dashboard";

export default function ProtectedSubirReviewsPage() {
  const { user } = useContext(UserContext);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

useEffect(() => {
  if (user === undefined) {
    console.log("[Protected] user === undefined (cargando auth)");
    return;
  }

  (async () => {
    const userEmail = (user?.email || "").toLowerCase().trim();
    console.log("[Protected] user:", user);
    console.log("[Protected] userEmail:", userEmail);

    if (!userEmail) {
      console.log("[Protected] No hay email -> redirect");
      router.replace("/");
      return;
    }
    try {
      const ref = doc(db, "admins", userEmail);
      console.log("[Protected] consultando:", `admins/${userEmail}`);
      const snap = await getDoc(ref);
      console.log("[Protected] snap.exists:", snap.exists());
      if (!snap.exists()) {
        console.log("[Protected] No es admin -> redirect");
        router.replace("/");
        return;
      }
      console.log("[Protected] Es admin, acceso OK");
      setLoading(false);
    } catch (e) {
      console.error("[Protected] Error verificando admin:", e);
      router.replace("/");
    }
  })();
}, [user, router]);


  if (loading) return <div className="p-6">Verificando acceso…</div>;
  return <SubirReviewDashboard />;
}
