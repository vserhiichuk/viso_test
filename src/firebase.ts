import { initializeApp } from "firebase/app";
import { getFirestore, collection } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "visotest-3c61f.firebaseapp.com",
  projectId: "visotest-3c61f",
  storageBucket: "visotest-3c61f.appspot.com",
  messagingSenderId: "349587995601",
  appId: "1:349587995601:web:92523ef740a324075cbef0"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const questCollectionRef = collection(db, 'markers');