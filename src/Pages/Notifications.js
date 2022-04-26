import React, { useState, useEffect } from "react";
import NavBar from "../Components/NavBar";
import { Pages } from "../Components/Colors";
import Sidebar from "../Components/Sidebar";
import bell from "../images/bell.png";
import { motion } from "framer-motion";
import {
  ArchiveIcon,
  CheckCircleIcon,
  SaveIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import {
  collection,
  deleteCollection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import useAuth from "../hooks/userAuth";
function Notifications() {
  const [notif, setNotif] = useState();
  const { userID, switChId, ColorID } = useAuth();
  useEffect(() => {
    switChId(0);
    onSnapshot(
      query(
        collection(db, "Profiles", userID?.id, "Notifications"),
        orderBy("timestamp", "desc")
      ),
      (dc) => {
        setNotif(dc.docs.map((doc) => ({ data: doc.data(), id: doc.id })));
      }
    );
  }, []);
  const switchIcon = (n) => {
    switch (n) {
      case 0:
        return <CheckCircleIcon className="w-8 my-auto  text-green-400" />;
      case 1:
        return <SaveIcon className="w-8 my-auto  text-green-400" />;
      case 2:
        return <ArchiveIcon className="w-8 my-auto  text-blue-400" />;
      case 3:
        return <TrashIcon className="w-8 my-auto  text-red-400" />;
      default:
        return <CheckCircleIcon className="w-8 my-auto  text-green-400" />;
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={
        "flex flex-col  bg-gradient-to-br dark:from-slate-600 dark:to-gray-600 md:flex-row w-full h-screen md:h-full px-8 pt-2 md:pt-12 bg-gray-50 " +
        Pages[ColorID].pageBg
      }
    >
      <div className="flex flex-col w-1/2">
        <img className="pr-8 lg:pr-16 mb-4 hidden md:flex" src={bell} alt="" />
        <h1 className={"font-poplg text-2xl text-left " + Pages[ColorID].head}>
          Notifications
        </h1>
        <h1
          onClick={() =>
            onSnapshot(
              query(collection(db, "Profiles", userID?.id, "Notifications")),
              (dc) => dc.docs.forEach((snapshot) => snapshot.ref.delete())
            )
          }
          className={
            "font-popxs cursor-pointer flex flex-row text-md " +
            Pages[ColorID].sub
          }
        >
          Clear all notifications
          <TrashIcon className="w-4" />
        </h1>
      </div>
      <div className="flex px-3  h-screen overflow-y-auto py-2 flex-row bg-white  dark:bg-slate-800/60 w-full rounded-md border shadow-sm border-gray-200 dark:border-slate-500">
        <table className=" w-full">
          <tbody>
            <tr
              className={
                "border-b text-left w-full border-gray-300 dark:border-slate-700 font-popxl " +
                Pages[ColorID].text
              }
            >
              <th className="whitespace-nowrap w-16 mx-auto hidden md:table-cell">
                Type
              </th>
              <th className="whitespace-nowrap hidden md:table-cell">Date</th>
              <th className="whitespace-nowrap text-left">Type</th>
            </tr>
            {notif?.map((dc) => (
              <tr
                onClick={() =>
                  setDoc(
                    doc(db, "Profiles", userID?.id, "Notifications", dc.id),
                    { read: true },
                    { merge: true }
                  )
                }
                key={`data.jkey.${dc.id}`}
                className={
                  "cursor-default my-3 border-b border-gray-200 dark:border-slate-700 h-12 md:h-4 font-pop text-gray-400 dark:text-gray-200 rounded-lg dark:hover:bg-slate-600" +
                  Pages[ColorID].hover +
                  (dc.data.read ? " " : " bg-yellow-100 dark:bg-gray-600")
                }
              >
                <th className="whitespace-nowrap w-12 mx-auto hidden md:table-cell">
                  {switchIcon(dc.data.icon)}
                </th>
                <th className="whitespace-nowrap  text-left hidden md:table-cell">
                  {dc.data.timestamp.toDate().toLocaleDateString()}
                </th>
                <th className="whitespace-nowrap my-auto text-left flex flex-col justify-center">
                  <h1
                    className={"font-pop mt-2 text-md" + Pages[ColorID].subText}
                  >
                    {dc.data.title}
                  </h1>
                  <h1 className="font-pop text-gray-400 text-xs -mt-2 w-full whitespace-normal">
                    {dc.data.text}
                  </h1>
                </th>
                <th>
                  <TrashIcon
                    onClick={() =>
                      deleteDoc(
                        doc(db, "Profiles", userID?.id, "Notifications", dc.id)
                      )
                    }
                    className={
                      "w-8 p-2 text-gray-500 hover:text-white rounded-full" +
                      Pages[ColorID].icoHover
                    }
                  />
                </th>
              </tr>
            ))}
            {notif?.length === 0 && (
              <tr
                className={
                  "cursor-default py-3 h-12 md:h-4 font-pop text-gray-400 rounded-lg " +
                  Pages[ColorID].hover
                }
              >
                <th className="whitespace-nowrap w-12 mx-auto"></th>
                <th className="whitespace-nowrap  text-left"></th>
                <th className="whitespace-nowrap my-auto text-left flex flex-col justify-center">
                  <h1 className="font-pop text-gray-400 mt-2 text-md">
                    No notifications
                  </h1>
                </th>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

export default Notifications;
