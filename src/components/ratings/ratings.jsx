import FirebaseSettings from "../FirebaseSettings";
import { doc, setDoc, serverTimestamp, getFirestore } from "firebase/firestore";

const firestore = getFirestore(FirebaseSettings);

async function saveRating(userId, movieId, rating) {
  if (!userId || !movieId || rating === undefined) {
    console.error("Invalid arguments provided to saveRating");
    return;
  }

  try {
    const ratingRef = doc(firestore, "ratings", `${userId}_${movieId}`);
    await setDoc(ratingRef, {
      userId,
      movieId,
      rating,
      timestamp: serverTimestamp(),
    });
    console.log("Rating guardado correctamente!");
  } catch (error) {
    console.error("Error guardando el rating:", error);
  }
}

export default saveRating;