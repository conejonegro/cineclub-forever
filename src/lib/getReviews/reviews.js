import { db } from "@/components/FirebaseSettings";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";

// Normaliza títulos/strings a un slug en minúsculas sin espacios
function toSlug(str = "") {
  return String(str)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // quita acentos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// 🔧 Helper: convierte Firestore Timestamps u objetos no serializables a JSON plano
function convertFirestoreData(data) {
  if (!data) return null;

  return JSON.parse(
    JSON.stringify(data, (key, value) => {
      // convierte los timestamps en strings ISO legibles
      if (value?.seconds) {
        return new Date(value.seconds * 1000).toISOString();
      }
      return value;
    })
  );
}

export async function fetchPublishedReviews({ take = 24 } = {}) {
  const q = query(
    collection(db, "reviews"),
    where("published", "==", true),
    orderBy("createdAt", "desc"),
    limit(take)
  );
  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...convertFirestoreData(d.data()),
  }));
}

export async function fetchReviewBySlug(slug) {
  if (!slug) return null;
  const id = toSlug(slug);

  // Intento principal
  const ref = doc(db, "reviews", id);
  const snap = await getDoc(ref);
  if (snap.exists()) return { id: snap.id, ...convertFirestoreData(snap.data()) };

  // Fallback: probar con el slug original (por compatibilidad)
  if (id !== String(slug)) {
    const refRaw = doc(db, "reviews", String(slug));
    const snapRaw = await getDoc(refRaw);
    if (snapRaw.exists()) return { id: snapRaw.id, ...convertFirestoreData(snapRaw.data()) };
  }

  return null;
}

// Ejemplo para crear (útil en un script local o página admin)
export function newReviewPayload(data) {
  const now = serverTimestamp();
  return {
    ...data,
    createdAt: now,
    updatedAt: now,
  };
}

// Export util
export { toSlug };



