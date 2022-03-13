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
} from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

function UserDash() {
  const navigate = useNavigate();
  const { userID } = useAuth();
  const [posts, setPosts] = useState([]);
  const [post, setPost] = useState();
  const docRef = doc(db, "Profiles", userID.id);
  const Data = [
    {
      title: "Lorem Ipsum is simply dummy text of the printing",
      tag: "lorem",
      status: "Waiting for review",
    },
    {
      title: "Lorem Ipsum is simply dummy text of the printing",
      tag: "lorem",
      status: "Waiting for review",
    },
    {
      title: "Lorem Ipsum is simply dummy text of the printing",
      tag: "lorem",
      status: "Waiting for review",
    },
  ];
  const PostRef = collection(db, "Posts");
  // useEffect(() => {
  //   getDoc(docRef).then((doc) => {
  //     //setPosts(doc.data().posts);
  //     doc.data().posts.map((dc) => console.log(dc));
  //   });
  // }, []);
  useEffect(() => {
    onSnapshot(query(PostRef, where("user", "==", userID.id)), (dc) =>
      setPost(dc.docs.map((doc) => ({ data: doc.data(), id: doc.id })))
    );
  }, []);

  //console.log(posts);
  return (
    <div className="flex flex-row h-screen w-full justify-between">
      <NavBar />
      <div className="flex flex-col w-full px-16 pt-12 bg-gray-50">
        <h1 className="font-poplg text-2xl text-left text-indigo-900">
          {"Hi " + userID.name.split(" ")[0] + ", Welcome back!"}
        </h1>
        <h1 className="font-popxs text-md text-indigo-300">
          Green blog dashboard
        </h1>
        <div className="flex flex-row w-full">
          <div className="flex flex-col w-1/2 bg-white p-4">
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
            <div className="flex flex-row bg-white pl-4 pr-16 items-center">
              <div className="p-2 bg-gray-100 rounded-full">
                <DocumentTextIcon className="w-6 text-indigo-600" />
              </div>
              <div className="flex flex-col justify-center ml-4 mt-2">
                <h1 className="font-popxl  my-auto text-lg text-gray-600">0</h1>
                <h1 className="font-popxs text-md text-gray-300">Reads</h1>
              </div>
            </div>
            <div className="flex flex-row bg-white mt-4 pl-4 pr-16 items-center">
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
        <div className="flex px-3 py-2 flex-row bg-white w-full mt-4">
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
                  className="cursor-default py-3 font-pop text-gray-400 hover:text-gray-600"
                >
                  <th className="pr-3 whitespace-nowrap">{i + 1}</th>
                  <th className="pr-3 whitespace-nowrap text-left">
                    {dc.data.title}
                  </th>
                  <th className=" whitespace-nowrap ">#</th>
                  <th className="pr-3 text-left pl-3 whitespace-nowrap text-gray-300">
                    {dc.data.status}
                  </th>
                  <th className="pr-3 text-left whitespace-nowrap flex flex-row">
                    {dc.data.status !== "Approved" ? (
                      <>
                        <div
                          onClick={() => navigate(`/Write/${dc.id}`)}
                          className="hover:bg-gray-200 rounded-full p-1"
                        >
                          <PencilAltIcon className="w-5 hover:text-indigo-600" />
                        </div>
                        <div
                          onClick={() => deleteDoc(doc(db, "Posts", dc.id))}
                          className="hover:bg-gray-200 rounded-full p-1"
                        >
                          <TrashIcon className="w-5 hover:text-indigo-600" />
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
