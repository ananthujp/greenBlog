import React, { useState } from "react";
//import validator from "validator";
import * as emailValidation from "nodejs-email-validation";

import SubLogo from "../images/subscribe.svg";
import {
  addDoc,
  collection,
  getDocs,
  where,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
function Subscribe({ change, state }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState();
  const handleSubscribe = () => {
    email &&
      emailValidation.validate(email) &&
      getDocs(
        query(collection(db, "Subscribers"), where("email", "==", email))
      ).then((dc) =>
        dc.docs.length
          ? setEmail("")
          : addDoc(collection(db, "Subscribers"), { email: email }).then(() => {
              setEmail("");
              setStatus("Subscribed Successfully!");
            })
      );
  };
  return (
    <div
      className={
        " bg-white/60  z-50 w-screen h-screen flex items-center justify-center " +
        (state ? " fixed" : " hidden")
      }
    >
      <div className="flex bg-white/40 backdrop-blur-lg p-4 rounded-xl w-2/5 h-auto shadow-md">
        <div
          className="cursor-pointer flex items-center justify-center h-4 w-4 hover:bg-indigo-200 rounded-full p-1"
          onClick={() => change(false)}
        >
          &times;
        </div>
        <div className="flex flex-col w-full my-auto items-center justify-between">
          <img src={SubLogo} className="w-3/5 mx-auto" alt="" />
          <h1 className="font-popxl text-xl mt-4">Don't Miss a thing</h1>
          <h1 className={"font-pop text-gray-500 text-xs text-center"}>
            Enter your email address and subscribe to the newsletter.
          </h1>
          <h1
            className={
              "font-pop text-red-500 text-xs text-center" +
              (status ? " flex" : " hidden")
            }
          >
            {status}
          </h1>
          <div className="border border-gray-300 w-3/5 flex flex-row bg-indigo-100 rounded-lg overflow-hidden ">
            <input
              type="text"
              value={email}
              onBlur={() =>
                !emailValidation.validate(email)
                  ? setStatus("Invalid Email Address")
                  : setStatus(null)
              }
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full py-2 bg-transparent outline-none text-md px-2"
            />
            <button
              onClick={() => handleSubscribe()}
              className="bg-indigo-600 transition-all active:bg-indigo-500 hover:bg-indigo-400 border border-indigo-600 px-2 text-white"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Subscribe;
