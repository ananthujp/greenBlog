import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import useAuth from "../hooks/userAuth";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { Pages } from "../Components/Colors";
import PostElement from "../Components/PostElement";
const Author = ({ id }) => {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(null);
  useEffect(() => {
    getDoc(doc(db, "Profiles", id)).then((dc) => setAuth(dc.data()));
  }, []);

  return (
    <div
      onClick={() => navigate(`/Author/${id}`)}
      className="flex flex-row cursor-pointer p-1 rounded-md hover:bg-white dark:hover:bg-slate-900"
    >
      <img alt="" src={auth?.img} className="mr-2 h-4 w-4 rounded-full" />
      <h1 className="font-poplg text-xs my-auto dark:text-slate-200">
        {auth?.name}
      </h1>
    </div>
  );
};
function Feed() {
  const [posts, setPosts] = useState();
  const [popposts, setPopPosts] = useState();
  const navigate = useNavigate();
  const { ColorID } = useAuth();
  useEffect(() => {
    getDocs(
      query(
        collection(db, "Posts"),
        orderBy("read", "desc"),
        where("status", "==", "Approved")
      )
    ).then((dc) =>
      setPopPosts(
        dc.docs.map((dic) => ({
          data: dic.data(),
          user: dic.data().user,
          title: dic.data().title,
          img: dic.data().data?.split('<img src="')[1]?.split('"')[0],
          txt: getText(dic.data().data?.split("<p>")[1]?.split("</p>")[0]),
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
    getDocs(
      query(
        collection(db, "Posts"),
        orderBy("timestamp", "desc"),
        where("status", "==", "Approved")
      )
    ).then((dc) =>
      setPosts(
        dc.docs.map((dic) => ({
          data: dic.data(),
          user: dic.data().user,
          title: dic.data().title,
          img: dic.data().data?.split('<img src="')[1]?.split('"')[0],
          txt: getText(dic.data().data?.split("<p>")[1]?.split("</p>")[0]),
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

  const getText = (txt) => {
    return txt.length > 64 ? txt.slice(0, 63) : txt;
  };

  return (
    <div className="w-full flex flex-col ">
      <div className="mt-1 bg-white dark:bg-slate-600 dark:border-slate-500 rounded-lg border border-slate-200 py-2 mx-3">
        <h1 className="mx-8 mt-2 dark:text-white">Popular posts</h1>
        <div className="flex flex-wrap -mt-4 flex-row">
          {popposts?.map((dc, i) => (
            <div
              key={`pop.posts.${i}`}
              className="flex flex-row flex-start mx-4 my-2 px-4 py-4"
            >
              <h1 className="font-popxl text-2xl mr-4 text-indigo-200">
                0{i + 1}
              </h1>
              <div className="flex flex-col flex-start">
                <div className="flex flex-row items-center mr-1">
                  <Author key={`key.author${i}`} id={dc.user} />
                </div>
                <h1
                  onClick={() => navigate(`/Posts/${dc.id}`)}
                  className="font-popxl  text-md w-56 my-2 dark:text-slate-100 cursor-pointer"
                >
                  {dc.title}
                </h1>
                <div className="flex flex-row mt-1 dark:text-slate-300 font-popxs text-xs">
                  {dc.time}. 3 min read
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="border-y mt-3 pt-2 flex w-full mx-auto">
        <div className="flex flex-row flex-wrap w-full justify-center">
          {posts?.map((dc, i) => (
            <PostElement i={i} dc={dc} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Feed;
