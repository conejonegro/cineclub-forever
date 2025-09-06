"use client";

import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/components/UserProvider";
import { useRouter } from "next/navigation";
import SubirReviewDashboard from "./Dashboard";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

export default function ProtectedSubirReviewsPage() {
  const { user } = useContext(UserContext);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Esperar a que el user se cargue
    if (user === undefined) return;

    // Si no hay sesión o no es el admin, redirigir
    if (!user || user.email !== ADMIN_EMAIL) {
      router.replace("/");
    } else {
      setLoading(false);
    }
  }, [user, router]);

  if (loading) return <div className="p-6">Verificando acceso...</div>;

  return <SubirReviewDashboard />;
}
