// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
const firebaseApp = initializeApp({
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "greenclubblog-465f4.firebaseapp.com",
  projectId: "greenclubblog-465f4",
  storageBucket: "greenclubblog-465f4.appspot.com",
  messagingSenderId: process.env.REACT_APP_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
});

// Initialize Firebase
const provider = new GoogleAuthProvider();
const auth = getAuth();
const storage = getStorage();
export { auth, provider, storage };
export const db = getFirestore(firebaseApp);
