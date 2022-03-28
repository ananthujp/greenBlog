// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
const firebaseApp = initializeApp({
  apiKey: "AIzaSyDijiq3x9v4x9kLEnJnUlfsPN_ObCCHsco",
  authDomain: "greenclubblog-465f4.firebaseapp.com",
  projectId: "greenclubblog-465f4",
  storageBucket: "greenclubblog-465f4.appspot.com",
  messagingSenderId: "591521601587",
  appId: "1:591521601587:web:8698113786a238533eeb46",
  measurementId: "G-TS5PZKM079",
});

// Initialize Firebase
const provider = new GoogleAuthProvider();
const auth = getAuth();
const storage = getStorage();
export { auth, provider, storage };
export const db = getFirestore(firebaseApp);
