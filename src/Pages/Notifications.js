import React, { useState, useEffect } from "react";
import NavBar from "../Components/NavBar";
import Sidebar from "../Components/Sidebar";
import { CheckCircleIcon } from "@heroicons/react/outline";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import useAuth from "../hooks/userAuth";
function Notifications() {
  const [notif, setNotif] = useState();
  const { userID } = useAuth();
  useEffect(() => {
    onSnapshot(
      query(
        collection(db, "Profiles", userID.id, "Notifications"),
        orderBy("timestamp", "desc")
      ),
      (dc) => setNotif(dc.docs.map((doc) => ({ data: doc.data(), id: doc.id })))
    );
  }, []);
  return (
    <div className="flex flex-row h-screen w-full justify-between">
      <NavBar />
      <div className="flex flex-col w-full px-8 pt-12 bg-gray-50">
        <h1 className="font-poplg text-2xl text-left text-indigo-900">
          Notifications
        </h1>
        <h1 className="font-popxs text-md text-indigo-300">
          Green blog dashboard
        </h1>
        <div className="flex px-3 py-2 flex-row bg-white w-full mt-4">
          <table className=" w-full">
            <tbody>
              <tr className="border-b text-left w-full border-gray-300 font-popxl text-indigo-900">
                <th className="whitespace-nowrap w-16 mx-auto">Type</th>
                <th className="whitespace-nowrap ">Date</th>
                <th className="whitespace-nowrap text-left">Type</th>
              </tr>
              {notif?.map((dc) => (
                <tr
                  key={`data.jkey.${dc.id}`}
                  className="cursor-default py-3 h-12 font-pop text-gray-400 rounded-lg hover:bg-indigo-50"
                >
                  <th className="whitespace-nowrap w-12 mx-auto">
                    <CheckCircleIcon className="w-8 my-auto  text-green-400" />
                  </th>
                  <th className="whitespace-nowrap  text-left">
                    {dc.data.timestamp.toDate().toLocaleDateString()}
                  </th>
                  <th className="whitespace-nowrap my-auto text-left flex flex-col justify-center">
                    <h1 className="font-pop text-indigo-700 mt-2 text-md">
                      {dc.data.title}
                    </h1>
                    <h1 className="font-pop text-gray-400 text-xs -mt-2 w-full whitespace-normal">
                      {dc.data.text}
                    </h1>
                  </th>
                </tr>
              ))}
              {notif?.length === 0 && (
                <tr className="cursor-default py-3 h-12 font-pop text-gray-400 rounded-lg hover:bg-indigo-50">
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
      </div>
      <Sidebar />
    </div>
  );
}

export default Notifications;
