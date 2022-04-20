import { PencilAltIcon, TrashIcon } from "@heroicons/react/outline";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../firebase";

function Author() {
  const [auth, setAuth] = useState();
  const [post, setPosts] = useState();
  const route = useLocation();
  const navigate = useNavigate();
  const id = route.pathname.split("/")[2];
  useEffect(() => {
    getDoc(doc(db, "Profiles", id)).then((dc) =>
      setAuth({
        name: dc.data().name,
        email: dc.data().email,
        img: dc.data().img,
        bio: dc.data().Bio,
      })
    );
    getDocs(
      query(
        collection(db, "Posts"),
        where("status", "==", "Approved"),
        where("user", "==", id)
        // ,
        // orderBy("desc", "read")
      )
    ).then((dc) =>
      setPosts(
        dc.docs.map((dic) => ({
          data: dic.data(),
          user: dic.data().user,
          title: dic.data().title,
          img: dic.data().data?.split('<img src="')[1]?.split('"')[0],
          time:
            dic
              .data()
              .timestamp.toDate()
              .toLocaleDateString(
                {},
                { timeZone: "UTC", month: "long", day: "2-digit" }
              ) + " ",
          id: dic.id,
        }))
      )
    );
  }, []);
  return (
    <div className="flex flex-col items-center w-full">
      <>
        <div className="mt-12 border-indigo-400 border-8 shadow-md rounded-full">
          <img src={auth?.img} className="w-36 h-36 rounded-full" alt="" />
        </div>
        <h1 className="font-poplg mt-2 mb-0 text-2xl text-indigo-500">
          {auth?.name}
        </h1>
        <h1 className="font-pop text-md text-gray-400">PhD Student</h1>
      </>
      <div className="w-3/4 mt-1">
        <div class="mb-2 flex flex-row justify-center">
          <div class="-mt-2 text-5xl text-left text-gray-600">“</div>
          <p class="px-2 text-sm text-center text-gray-600">
            {auth?.bio ? auth.bio : "No Bio"}
          </p>
          <div class="mb-1 text-3xl text-right text-gray-600">”</div>
        </div>
      </div>
      <h1 className="text-left font-poplg text-lg w-3/4 mt-4">Articles</h1>
      <table className=" w-3/4">
        <tbody>
          {/* <tr className="border-b text-left w-full border-gray-300 font-popxl text-indigo-900">
            <th className="whitespace-nowrap pr-3">No</th>
            <th className="whitespace-nowrap w-3/5">Title</th>
            <th className="whitespace-nowrap">Tags</th>
            <th className="whitespace-nowrap pl-3 w-2/5">Status</th>
            <th className="whitespace-nowrap w-4/5">Edit</th>
          </tr> */}
          {post?.map((dc, i) => (
            <tr
              key={`data.jkey${i}`}
              className="cursor-default border-y border-gray-200 py-3 h-12 font-pop transition-all rounded-lg text-gray-700 hover:bg-indigo-100"
            >
              <th className="pr-3 whitespace-nowrap">{i + 1}</th>
              <th className="pr-3 whitespace-nowrap text-left">{dc.title}</th>
              <th className=" pr-3 text-left pl-3 whitespace-nowrap text-gray-400">
                {dc.time}
              </th>
              <th
                onClick={() => navigate(`/Posts/${dc.id}`)}
                className="flex h-12 items-center justify-center text-left whitespace-nowrap text-gray-400"
              >
                <div className="flex cursor-pointer my-auto text-white bg-gradient-to-br from-blue-400 to-blue-600 py-0.5 px-2 rounded-md">
                  View
                </div>
              </th>
            </tr>
          ))}
          {post?.length < 1 && (
            <tr className="cursor-default border-y border-gray-200 py-3 h-12 font-pop transition-all rounded-lg text-gray-700 hover:bg-indigo-100">
              <th className="pr-3 whitespace-nowrap italic text-gray-400">
                No articles
              </th>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Author;
