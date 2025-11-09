
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBNUhIGbPRwtMXJpbidaS4kqBn9tLWyqRM",
  authDomain: "dobby-leaderboard.firebaseapp.com",
  projectId: "dobby-leaderboard",
  storageBucket: "dobby-leaderboard.appspot.com",
  messagingSenderId: "184671600483",
  appId: "1:184671600483:web:d19df358ed60a8b183dd56",
  measurementId: "G-WMM797FMF8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function submitScore(name, score) {
  await addDoc(collection(db, "scores"), {
    name,
    score,
    timestamp: serverTimestamp()
  });
}

export async function loadLeaderboard() {
  const q = query(collection(db, "scores"), orderBy("score", "desc"), limit(10));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data());
}
