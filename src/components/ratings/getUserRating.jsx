import { doc, getDoc, getFirestore } from "firebase/firestore";
import FirebaseSettings from "../FirebaseSettings";

const firestore = getFirestore(FirebaseSettings);

export default async function getUserRating(userId, movieId) {

    const ratingRef = doc(firestore, "ratings", `${userId}_${movieId}`);
    const ratingSnap = await getDoc(ratingRef);

    if (ratingSnap.exists()) {

       // console.log("Rating encontrado:", ratingSnap.data());
        return ratingSnap.data();

    } else {
        console.log("No hay rating para esta película.");
        return null;
    }

}


