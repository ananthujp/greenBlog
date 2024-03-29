import {
  AnnotationIcon,
  DocumentTextIcon,
  PencilAltIcon,
  TrashIcon,
  EyeIcon,
} from "@heroicons/react/outline";
import { Pages } from "../Components/Colors";
import { motion } from "framer-motion";

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setNotification } from "../Actions/setNotification";
import NavBar from "../Components/NavBar";
import Sidebar from "../Components/Sidebar";
import { db } from "../firebase";
import useAuth from "../hooks/userAuth";

function AdminPanel() {
  const navigate = useNavigate();
  const { userID, role, switChId, ColorID } = useAuth();
  const [post, setPost] = useState();
  const [approvedpost, setapprovedPost] = useState();
  const [feedbacks, setfeedbacks] = useState();
  const PostRef = collection(db, "Posts");
  const item =
    " rounded-md border border-gray-200 shadow-sm dark:border-slate-500 dark:bg-slate-700";
  const handleDelete = ({ dc }) => {
    if (false) {
      deleteDoc(doc(db, "Posts", dc.id));
      setNotification(
        dc.user,
        "Your article is  removed",
        "Your article titled " + dc.title + " has been removed.",
        3
      );
    } else {
      alert(
        "You dont have the permission for this operation. Please contact the administrator"
      );
    }
  };

  useEffect(() => {
    switChId(1);
    onSnapshot(
      query(PostRef, where("status", "==", "Waiting for Review")),
      (dc) => {
        setPost(
          dc.docs.map((doc) => ({
            title: doc.data().title,
            user: doc.data().user,
            status: doc.data().status,
            id: doc.id,
          }))
        );
      }
    );
    onSnapshot(query(PostRef, where("status", "==", "Approved")), (dc) => {
      setapprovedPost(
        dc.docs.map((doc) => ({
          title: doc.data().title,
          user: doc.data().user,
          status: doc.data().status,
          id: doc.id,
        }))
      );
    });
    getDocs(collection(db, "Feedback")).then((dc) =>
      setfeedbacks(
        dc.docs.map((doc) => ({
          data: doc.data(),
        }))
      )
    );
  }, []);
  const HandleAuthor = ({ user }) => {
    const [author, setAuthor] = useState("Loading..");
    useEffect(() => {
      return getDoc(doc(db, "Profiles", user)).then((dc) =>
        setAuthor(dc.data().name)
      );
      //setAuthor(handleAuthor(user));
    }, []);
    return <div>{author}</div>;
  };

  return (
    <>
      {/* <div className="flex flex-col  md:flex-row  w-full">
        <NavBar /> */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={
          "flex  md:mx-2 md:my-3 md:border h-screen md:border-slate-200 md:dark:border-slate-500 md:rounded-lg  dark:from-slate-600 dark:to-gray-600 flex-col w-full px-8 md:px-16  pt-2 md:pt-12 bg-gradient-to-br " +
          Pages[ColorID].pageBg
        }
      >
        <h1 className={"font-poplg text-2xl text-left " + Pages[ColorID].head}>
          {"Hi " + userID?.name.split(" ")[0] + ", Welcome back!"}
        </h1>
        <h1 className={"font-popxs text-md " + Pages[ColorID].sub}>
          Admin Panel
        </h1>
        <div className="flex flex-row w-full">
          <div className={"flex flex-col w-1/2 bg-white p-4 " + item}>
            <h1 className={"font-pop text-md " + Pages[ColorID].head}>
              Articles
            </h1>
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
                  <h1 className="font-pop text-lg text-gray-500">
                    {approvedpost?.length}
                  </h1>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-1/2 ml-4">
            <div
              className={
                "flex flex-row bg-white pl-4 pr-16 items-center " + item
              }
            >
              <div className="p-2 bg-gray-100 dark:bg-slate-500 rounded-full">
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
              <div className="p-2 bg-gray-100 dark:bg-slate-500 rounded-full">
                <AnnotationIcon className="w-6 text-sky-400" />
              </div>
              <div className="flex flex-col justify-center ml-4 mt-2">
                <h1 className="font-popxl  my-auto text-lg text-gray-600">0</h1>
                <h1 className="font-popxs text-md text-gray-300">Comments</h1>
              </div>
            </div>
          </div>
        </div>
        <h1 className={"font-poplg text-lg text mt-4 " + Pages[ColorID].head}>
          Waiting for approval
        </h1>
        <div className={"flex px-3 py-2 flex-row bg-white w-full " + item}>
          <table className=" w-full">
            <tbody>
              <tr
                className={
                  "border-b text-left w-full border-gray-300 font-popxl " +
                  Pages[ColorID].head
                }
              >
                <th className="whitespace-nowrap pr-3">No</th>
                <th className="whitespace-nowrap w-1/5">Title</th>
                <th className="whitespace-nowrap w-1/5 ">Author</th>
                <th className="whitespace-nowrap">Tags</th>
                <th className="whitespace-nowrap pl-3 w-2/5">Status</th>
                <th className="whitespace-nowrap w-4/5">Edit</th>
              </tr>
              {post?.map((dc, i) => (
                <tr
                  key={`data.jkey${i}`}
                  className="cursor-default py-3 font-pop text-gray-400 hover:text-gray-600 dark:hover:text-slate-200"
                >
                  <th className="pr-3 whitespace-nowrap">{i + 1}</th>
                  <th className="pr-3 whitespace-nowrap text-left">
                    {dc.title}
                  </th>
                  <th className="pr-3 whitespace-nowrap text-left">
                    <HandleAuthor user={dc.user} />
                  </th>
                  <th className=" whitespace-nowrap ">#</th>
                  <th className="pr-3 text-left pl-3 whitespace-nowrap text-gray-300">
                    {dc.status}
                  </th>
                  <th className="pr-3 text-left whitespace-nowrap flex flex-row">
                    {dc.status !== "Approved" ? (
                      <div
                        onClick={() => navigate(`/Write/${dc.id}`)}
                        className="hover:bg-gray-200 dark:hover:bg-slate-600 rounded-full p-1"
                      >
                        <PencilAltIcon
                          className={
                            "w-5 dark:hover:text-white" +
                            Pages[ColorID].hoverTxt
                          }
                        />
                      </div>
                    ) : (
                      <></>
                    )}
                    {dc.status !== "Approved" || role === "admin" ? (
                      <div
                        onClick={() => handleDelete({ dc })}
                        className="hover:bg-gray-200 dark:hover:bg-slate-600 rounded-full p-1"
                      >
                        <TrashIcon
                          className={
                            "w-5 dark:hover:text-white" +
                            Pages[ColorID].hoverTxt
                          }
                        />
                      </div>
                    ) : (
                      <></>
                    )}
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h1 className={"font-poplg text-lg  text mt-4" + Pages[ColorID].head}>
          Approved Articles
        </h1>
        <div className={"flex px-3 py-2 flex-row bg-white w-full " + item}>
          <table className=" w-full">
            <tbody>
              <tr
                className={
                  "border-b text-left w-full border-gray-300 font-popxl " +
                  Pages[ColorID].head
                }
              >
                <th className="whitespace-nowrap pr-3">No</th>
                <th className="whitespace-nowrap w-1/5">Title</th>
                <th className="whitespace-nowrap w-1/5 ">Author</th>
                <th className="whitespace-nowrap">Tags</th>
                <th className="whitespace-nowrap pl-3 w-2/5">Status</th>
                <th className="whitespace-nowrap w-4/5">Edit</th>
              </tr>
              {approvedpost?.map((dc, i) => (
                <tr
                  key={`data.jkey${i}`}
                  className="cursor-default py-3 font-pop text-gray-400 hover:text-gray-600 dark:hover:text-slate-200"
                >
                  <th className="pr-3 whitespace-nowrap">{i + 1}</th>
                  <th className="pr-3 whitespace-nowrap text-left">
                    {dc.title}
                  </th>
                  <th className="pr-3 whitespace-nowrap text-left">
                    <button>
                      <HandleAuthor user={dc.user} />
                    </button>
                  </th>
                  <th className=" whitespace-nowrap ">#</th>
                  <th className="pr-3 text-left pl-3 whitespace-nowrap text-gray-300">
                    {dc.status}
                  </th>
                  <th className="pr-3 text-left whitespace-nowrap flex flex-row">
                    {dc.status !== "Approved" || role === "admin" ? (
                      <>
                        <div
                          onClick={() => navigate(`/Write/${dc.id}`)}
                          className="hover:bg-gray-200 dark:hover:bg-slate-600 rounded-full p-1"
                        >
                          <PencilAltIcon className="w-5 hover:text-indigo-600 dark:hover:text-white" />
                        </div>
                        <div
                          onClick={() => navigate(`/Posts/${dc.id}`)}
                          className="hover:bg-gray-200 dark:hover:bg-slate-600 rounded-full p-1"
                        >
                          <EyeIcon
                            className={
                              "w-5 dark:hover:text-white " +
                              Pages[ColorID].hoverTxt
                            }
                          />
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                    {dc.status !== "Approved" || role === "admin" ? (
                      <div
                        onClick={() => deleteDoc(doc(db, "Posts", dc.id))}
                        className="hover:bg-gray-200 dark:hover:bg-slate-600 rounded-full p-1"
                      >
                        <TrashIcon
                          className={
                            "w-5 dark:hover:text-white" +
                            Pages[ColorID].hoverTxt
                          }
                        />
                      </div>
                    ) : (
                      <></>
                    )}
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h1 className={"font-poplg text-lg  text mt-4" + Pages[ColorID].head}>
          Feedback
        </h1>
        <div className={"flex px-3 py-2 flex-row bg-white w-full " + item}>
          <table className=" w-full">
            <tbody>
              <tr
                className={
                  "border-b text-left w-full border-gray-300 font-popxl " +
                  Pages[ColorID].head
                }
              >
                <th className="whitespace-nowrap pr-3">No</th>
                <th className="whitespace-nowrap w-1/5">Q1</th>
                <th className="whitespace-nowrap w-1/5">Q2</th>
                <th className="whitespace-nowrap w-1/5">Q3</th>
                <th className="whitespace-nowrap pl-3 w-2/5">Comment</th>
              </tr>
              {feedbacks?.map((dc, i) => (
                <tr
                  key={`data.jkey${i}`}
                  className="cursor-default py-3 font-pop text-gray-400 hover:text-gray-600 dark:hover:text-slate-200"
                >
                  <th className="pr-3 whitespace-nowrap">{i + 1}</th>
                  <th className="pr-3 whitespace-nowrap text-left">
                    {dc.data.q1}
                  </th>
                  <th className="pr-3 whitespace-nowrap text-left">
                    {dc.data.q2}
                  </th>
                  <th className="pr-3 whitespace-nowrap text-left">
                    {dc.data.q3}
                  </th>
                  <th className="pr-3 whitespace-nowrap text-left">
                    {dc.data.comment}
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </>
  );
}

export default AdminPanel;
