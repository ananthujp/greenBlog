import React, { useEffect, useState } from "react";
//import validator from "validator";
import * as emailValidation from "nodejs-email-validation";
import Rating from "react-star-rating-lite";
import SubLogo from "../images/rating.svg";
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
function Feedback({ change, state }) {
  const [feedbackq, setFeed] = useState({});
  const ratingHandler = (val, e) => {
    switch (val) {
      case 0:
        setFeed({ ...feedbackq, q1: e });
        break;
      case 1:
        setFeed({ ...feedbackq, q2: e });
        break;
      case 2:
        setFeed({ ...feedbackq, q3: e });
        break;
      default:
    }
  };
  const handleSubscribe = () => {
    addDoc(collection(db, "Feedback"), feedbackq).then(() => {
      change(false);
    });
  };
  return (
    <div
      className={
        " bg-white/60  z-50 w-screen h-screen flex items-center justify-center " +
        (state ? " fixed" : " hidden")
      }
    >
      <div className="flex bg-white/40 backdrop-blur-lg p-4 rounded-xl w-[95%] md:w-3/5 h-auto shadow-md">
        <div
          className="cursor-pointer flex items-center justify-center md:text-3xl h-4 w-4 md:w-8 md:h-8 hover:bg-indigo-200 rounded-full p-1"
          onClick={() => change(false)}
        >
          &times;
        </div>
        <div className="flex flex-col w-full my-auto items-center justify-between">
          <img src={SubLogo} className="w-3/5 mx-auto" alt="" />
          <h1 className="font-popxl text-xl md:text-3xl mt-4">Feedback</h1>
          <h1
            className={"font-pop font-bold text-gray-700 text-xs text-center"}
          >
            Enter your email address and subscribe to the newsletter.
          </h1>
          <div className="grid grid-cols-2 gap-y-2 my-2 w-[90%] md:w-[80%] items-center justify-around">
            <h1
              className={
                "font-pop text-gray-500 my-auto text-xs md:text-sm text-right mr-2"
              }
            >
              Overall look and feel :
            </h1>
            <Rating
              horizontal
              weight="19"
              onClick={(e) => ratingHandler(0, e)}
            />
            <h1
              className={
                "font-pop text-gray-500 my-auto text-xs md:text-sm text-right mr-2"
              }
            >
              Ease of navigation :
            </h1>
            <Rating
              horizontal
              weight="19"
              onClick={(e) => ratingHandler(1, e)}
            />
            <h1
              className={
                "font-pop text-gray-500 my-auto text-xs md:text-sm text-right mr-2"
              }
            >
              Features :
            </h1>
            <Rating
              horizontal
              weight="19"
              onClick={(e) => ratingHandler(2, e)}
            />
          </div>
          <div className="  w-[90%] md:w-[80%] mt-4 flex flex-col items-left">
            <h1
              className={
                "font-pop text-gray-500 my-2 text-xs md:text-sm text-left mr-2"
              }
            >
              Any other comments :
            </h1>

            <textarea
              onChange={(e) =>
                setFeed({ ...feedbackq, comment: e.target.value })
              }
              className="w-full mx-auto p-3 rounded-lg border border-gray-300 h-44"
            />
          </div>
          <button
            onClick={() => handleSubscribe()}
            className="bg-indigo-600 rounded-full mt-2 transition-all active:bg-indigo-500 hover:bg-indigo-400 border border-indigo-600 px-4 text-white"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default Feedback;
