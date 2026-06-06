import { db } from "@/components/FirebaseSettings";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

function convertFirestoreData(data) {
  if (!data) return null;

  return JSON.parse(
    JSON.stringify(data, (key, value) => {
      if (value?.seconds) {
        return new Date(value.seconds * 1000).toISOString();
      }
      return value;
    })
  );
}

export async function fetchCommentsBySlug(slug) {
  const q = query(
    collection(db, "comments"),
    where("movieSlug", "==", slug),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,
    ...convertFirestoreData(d.data()),
  }));
}

export async function createComment(slug, user, content) {
  await addDoc(collection(db, "comments"), {
    movieSlug: slug,
    userId: user.uid,
    userEmail: user.email,
    userName: user.displayName || user.email,
    content,
    createdAt: serverTimestamp(),
  });
}
