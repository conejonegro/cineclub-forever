import { db } from "@/components/FirebaseSettings";
import {
  collection,
  doc,
  setDoc,
  query,
  where,
  orderBy,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

function convertFirestoreData(data) {
  if (!data) return null;

  return JSON.parse(
    JSON.stringify(data, (_key, value) => {
      if (value?.seconds) {
        return new Date(value.seconds * 1000).toISOString();
      }
      return value;
    })
  );
}

export async function fetchWatchedBySlug(slug) {
  const q = query(
    collection(db, "watched"),
    where("movieSlug", "==", slug),
    orderBy("watchedAt", "desc")
  );
  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...convertFirestoreData(d.data()),
  }));
}

export async function markAsWatched(slug, user) {
  const ref = doc(db, "watched", `${slug}_${user.uid}`);
  await setDoc(ref, {
    movieSlug: slug,
    userId: user.uid,
    userEmail: user.email,
    userName: user.displayName || user.email,
    watchedAt: serverTimestamp(),
  });
}
