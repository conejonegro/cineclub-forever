import { db } from "@/components/FirebaseSettings";
import {
  collection, doc, getDoc, getDocs,
  query, where, orderBy, limit, serverTimestamp
} from "firebase/firestore";

export async function fetchPublishedReviews({ take = 24 } = {}) {
  const q = query(
    collection(db, "reviews"),
    where("published", "==", true),
    orderBy("createdAt", "desc"),
    limit(take)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function fetchReviewBySlug(slug) {
  const q = query(
    collection(db, "reviews"),
    where("slug", "==", slug),
    limit(1)
  );
  const qsnap = await getDocs(q);
  if (!qsnap.empty) {
    const d = qsnap.docs[0];
    return { id: d.id, ...d.data() };
  }
  return null;
}

// Ejemplo para crear (útil en un script local o página admin)
// requiere auth activa según reglas
export function newReviewPayload(data) {
  const now = serverTimestamp();
  return {
    ...data,
    createdAt: now,
    updatedAt: now,
  };
}
