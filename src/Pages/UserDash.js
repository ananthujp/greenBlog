import {} from "@heroicons/react/outline";
import {
  AnnotationIcon,
  DocumentTextIcon,
  TrashIcon,
  PencilAltIcon,
} from "@heroicons/react/solid";
import React, { useEffect, useState } from "react";
import NavBar from "../Components/NavBar";
import useAuth from "../hooks/userAuth";
import Sidebar from "../Components/Sidebar";
import {
  updateDoc,
  doc,
  getDoc,
  deleteDoc,
  query,
  where,
  collection,
  getDocs,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { setNotification } from "../Actions/setNotification";

function UserDash() {
  const scr = window.matchMedia("(min-width: 768px)");
  const navigate = useNavigate();
  const { userID, setUserID, switChId } = useAuth();
  const [post, setPost] = useState();
  const PostRef = collection(db, "Posts");
  useEffect(() => {
    switChId(0);
    onSnapshot(
      query(
        PostRef,
        where("user", "==", userID?.back),
        orderBy("timestamp", "desc")
      ),
      (dc) => setPost(dc.docs.map((doc) => ({ data: doc.data(), id: doc.id })))
    );
  }, []);
  const item = " rounded-md border border-gray-200 shadow-sm";
  //console.log(posts);
  return (
    <div className="flex flex-col md:flex-row h-screen w-full md:justify-between">
      <NavBar />
      <div className=" flex flex-col w-full px-8 md:px-16 pt-2 md:pt-12 bg-gray-50">
        <h1 className="font-poplg text-2xl text-left text-indigo-900">
          {"Hi " + userID?.name.split(" ")[0] + ", Welcome back!"}
        </h1>
        <div className="flex flex-row justify-between">
          <h1 className="font-popxs text-md text-indigo-300">
            Green blog dashboard
          </h1>
          {!scr.matches && (
            <h1
              onClick={() => {
                navigate("/");
                localStorage.removeItem("user");
                setUserID(null);
              }}
              className="font-pop cursor-pointer text-md text-indigo-300"
            >
              (Logout)
            </h1>
          )}
        </div>
        <div className="flex flex-row w-full">
          <div className={"flex flex-col w-1/2 bg-white p-4" + item}>
            <h1 className="font-pop text-md text-indigo-900">Articles</h1>
            <div className="flex flex-row mx-auto">
              <div className="flex flex-row">
                <div className="w-3 h-3 my-1 mr-1 rounded-full bg-indigo-700"></div>
                <div className="flex flex-col">
                  <h1 className="font-pop text-sm text-gray-300">Submitted</h1>
                  <h1 className="font-pop text-lg text-gray-500">
                    {post?.length}
                  </h1>
                </div>
              </div>
              <div className="flex flex-row">
                <div className="w-3 h-3 my-1 mr-1 ml-8 rounded-full bg-cyan-400"></div>
                <div className="flex flex-col">
                  <h1 className="font-pop text-sm text-gray-300">Approved</h1>
                  <h1 className="font-pop text-lg text-gray-500">0</h1>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-1/2 ml-4">
            <div
              className={
                "flex flex-row bg-white pl-4 pr-16 items-center" + item
              }
            >
              <div className="p-2 bg-gray-100 rounded-full">
                <DocumentTextIcon className="w-6 text-indigo-600" />
              </div>
              <div className="flex flex-col justify-center ml-4 mt-2">
                <h1 className="font-popxl  my-auto text-lg text-gray-600">0</h1>
                <h1 className="font-popxs text-md text-gray-300">Reads</h1>
              </div>
            </div>
            <div
              className={
                "flex flex-row bg-white mt-4 pl-4 pr-16 items-center" + item
              }
            >
              <div className="p-2 bg-gray-100 rounded-full">
                <AnnotationIcon className="w-6 text-sky-400" />
              </div>
              <div className="flex flex-col justify-center ml-4 mt-2">
                <h1 className="font-popxl  my-auto text-lg text-gray-600">0</h1>
                <h1 className="font-popxs text-md text-gray-300">Comments</h1>
              </div>
            </div>
          </div>
        </div>
        <div className={"flex px-3 py-2 flex-row bg-white w-full mt-4" + item}>
          <table className=" w-full">
            <tbody>
              <tr className="border-b text-left w-full border-gray-300 font-popxl text-indigo-900">
                <th className="whitespace-nowrap pr-3">No</th>
                <th className="whitespace-nowrap w-3/5">Title</th>
                <th className="whitespace-nowrap">Tags</th>
                <th className="whitespace-nowrap pl-3 w-2/5">Status</th>
                <th className="whitespace-nowrap w-4/5">Edit</th>
              </tr>
              {post?.map((dc, i) => (
                <tr
                  key={`data.jkey${i}`}
                  className="cursor-default py-3 h-12 font-pop transition-all rounded-md text-gray-700 hover:bg-indigo-100"
                >
                  <th className="pr-3 whitespace-nowrap">{i + 1}</th>
                  <th className="pr-3 whitespace-nowrap text-left">
                    {dc.data.title}
                  </th>
                  <th className=" whitespace-nowrap ">#</th>
                  <th className=" pr-3 text-left pl-3 whitespace-nowrap text-gray-400">
                    {dc.data.status}
                  </th>
                  <th className="pr-3 text-left h-12 text-gray-400 whitespace-nowrap flex flex-row">
                    {dc.data.status !== "Approved" ? (
                      <>
                        <div
                          onClick={() => navigate(`/Write/${dc.id}`)}
                          className="hover:bg-indigo-400 my-auto group rounded-full p-1"
                        >
                          <PencilAltIcon className="w-5 flex group-hover:text-white" />
                        </div>
                        <div
                          onClick={() => {
                            deleteDoc(doc(db, "Posts", dc.id));
                            setNotification(
                              userID?.id,
                              "Your article is  removed",
                              "Your article titled " +
                                dc.data.title +
                                " has been removed.",
                              3
                            );
                          }}
                          className="hover:bg-indigo-400 my-auto group rounded-full p-1"
                        >
                          <TrashIcon className="w-5 group-hover:text-white" />
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Sidebar />
    </div>
  );
}

export default UserDash;
