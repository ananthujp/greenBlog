import {} from "@heroicons/react/outline";
import { Pages } from "../Components/Colors";
import {
  AnnotationIcon,
  DocumentTextIcon,
  TrashIcon,
  PencilAltIcon,
} from "@heroicons/react/solid";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import user from "../images/user.png";
import useAuth from "../hooks/userAuth";
import Sidebar from "../Components/Sidebar";
import {
  doc,
  deleteDoc,
  query,
  where,
  collection,
  getDocs,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { setNotification } from "../Actions/setNotification";

function UserDash() {
  const scr = window.matchMedia("(min-width: 768px)");
  const navigate = useNavigate();
  const { userID, setUserID, switChId, ColorID } = useAuth();
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
      (dc) =>
        setPost(
          dc.docs.map((doc) => ({
            title: doc.data().title,
            status: doc.data().status,
            id: doc.id,
          }))
        )
    );
  }, []);
  const item =
    " rounded-md border border-gray-200 dark:border-slate-500 dark:bg-slate-700 shadow-sm";
  //console.log(posts);
  return (
    <>
      {/* <NavBar /> */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={
          " flex flex-col h-screen dark:from-slate-600 dark:to-gray-600 bg-gradient-to-br md:flex-row w-full px-8 md:px-16 pt-2 md:pt-12 bg-gray-50" +
          Pages[ColorID].pageBg
        }
      >
        <div className="flex flex-col items-left w-1/2">
          <img
            className="pr-8 lg:pr-16 max-w-sm mb-4 hidden md:flex"
            src={user}
            alt=""
          />

          <h1
            className={"font-poplg text-2xl text-left " + Pages[ColorID].head}
          >
            {"Hi " + userID?.name.split(" ")[0] + ", Welcome back!"}
          </h1>
          <h1 className={"font-popxs text-md " + Pages[ColorID].sub}>
            Green blog dashboard
          </h1>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-row justify-between">
            {!scr.matches && (
              <h1
                onClick={() => {
                  navigate("/");
                  localStorage.removeItem("user");
                  setUserID(null);
                }}
                className={
                  "font-pop cursor-pointer text-md " + Pages[ColorID].sub
                }
              >
                (Logout)
              </h1>
            )}
          </div>

          <div className="flex flex-row w-full">
            <div
              className={
                "flex flex-col w-1/2 bg-white dark:bg-slate-700 p-4" + item
              }
            >
              <h1 className={"font-pop text-md " + Pages[ColorID].head}>
                Articles
              </h1>
              <div className="flex md:flex-row w-full items-center md:justify-around flex-col mx-auto">
                <div className="flex flex-row">
                  <div className="w-3 h-3 my-1 mr-1 rounded-full bg-indigo-700"></div>
                  <div className="flex flex-col">
                    <h1 className="font-pop text-sm text-gray-300">
                      Submitted
                    </h1>
                    <h1 className="font-pop text-lg text-gray-500">
                      {post?.length}
                    </h1>
                  </div>
                </div>
                <div className="flex flex-row">
                  <div className="w-3 h-3 my-1 mr-1 rounded-full bg-cyan-400"></div>
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
                <div className="p-2 bg-gray-100 dark:bg-slate-500 rounded-full">
                  <DocumentTextIcon className="w-6 text-indigo-600" />
                </div>
                <div className="flex flex-col justify-center ml-4 mt-2">
                  <h1 className="font-popxl  my-auto text-lg text-gray-600">
                    0
                  </h1>
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
                  <h1 className="font-popxl  my-auto text-lg text-gray-600">
                    0
                  </h1>
                  <h1 className="font-popxs text-md text-gray-300">Comments</h1>
                </div>
              </div>
            </div>
          </div>
          <div
            className={"flex px-3 py-2 flex-row bg-white w-full mt-4" + item}
          >
            <table className=" w-full">
              <tbody>
                <tr
                  className={
                    "border-b text-left w-full border-gray-300 font-popxl " +
                    Pages[ColorID].head
                  }
                >
                  <th className="whitespace-nowrap pr-3">No</th>
                  <th className="whitespace-nowrap w-3/5">Title</th>
                  <th className="whitespace-nowrap hidden md:block">Tags</th>
                  <th className="whitespace-nowrap pl-3 w-2/5">Status</th>
                  <th className="whitespace-nowrap w-4/5">Edit</th>
                </tr>
                {post?.map((dc, i) => (
                  <tr
                    key={`data.jkey${i}`}
                    className={
                      "cursor-default py-3 h-12 font-pop transition-all rounded-md text-gray-700 dark:text-slate-400 dark:hover:bg-slate-600 " +
                      Pages[ColorID].hover2
                    }
                  >
                    <th className="pr-3 whitespace-nowrap">{i + 1}</th>
                    <th className="pr-3 whitespace-nowrap text-left">
                      {dc.title.length > 12
                        ? dc.title.slice(0, 12) + "..."
                        : dc.title}
                    </th>
                    <th className=" whitespace-nowrap hidden md:block">#</th>
                    <th className=" pr-3 text-left pl-3 whitespace-nowrap text-gray-400">
                      {dc.status}
                    </th>
                    <th className="pr-3 text-left h-12 text-gray-400 whitespace-nowrap flex flex-row">
                      {dc.status !== "Approved" ? (
                        <>
                          <div
                            onClick={() => navigate(`/Write/${dc.id}`)}
                            className={
                              " my-auto group rounded-full p-1" +
                              Pages[ColorID].icoHover
                            }
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
                                  dc.title +
                                  " has been removed.",
                                3
                              );
                            }}
                            className={
                              " my-auto group rounded-full p-1" +
                              Pages[ColorID].icoHover
                            }
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
      </motion.div>
      {/* <Sidebar /> */}
    </>
  );
}
export default UserDash;
