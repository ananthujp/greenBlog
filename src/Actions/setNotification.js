import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export const setNotification = (user, title, text) => {
  addDoc(collection(db, "Profiles", user, "Notifications"), {
    title: title,
    text: text,
    read: false,
    icon: 0,
    timestamp: serverTimestamp(),
  });
};
