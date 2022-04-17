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
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";

function Feed() {
  const [posts, setPosts] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    onSnapshot(
      query(
        collection(db, "Posts"),
        where("status", "==", "Approved")
        // ,
        // orderBy("desc", "read")
      ),
      (dc) =>
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
  // <img
  //               className="w-36 "
  //               src={dc?.data.data?.split('<img src="')[1]?.split('"')[0]}
  //               alt=""
  //             />
  const getText = (txt) => {
    return txt.length > 64 ? txt.slice(0, 63) : txt;
  };
  const Author = ({ key, id }) => {
    const [auth, setAuth] = useState(null);
    getDoc(doc(db, "Profiles", id)).then((dc) => setAuth(dc.data()));
    return (
      <div
        onClick={() => navigate(`/Author/${id}`)}
        key={`auth.id.${key}`}
        className="flex flex-row cursor-pointer"
      >
        <img alt="" src={auth?.img} className="mr-2 h-4 w-4 rounded-full" />
        <h1 className="font-poplg text-xs my-auto">{auth?.name}</h1>
      </div>
    );
  };
  return (
    <div className="w-full flex flex-col px-4">
      <div className="border-y border-gray-400">
        <h1 className="mx-8">Popular posts</h1>
        <div className="flex flex-wrap -mt-4 flex-row">
          {posts?.map((dc, i) => (
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
                  className="font-popxl  text-md w-56 my-2 cursor-pointer"
                >
                  {dc.title}
                </h1>
                <div className="flex flex-row mt-1 font-popxs text-xs">
                  {dc.time}. 3 min read
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="border-b mt-6 flex w-full border-gray-400">
        <div className="flex flex-col -mt-4 w-full">
          {posts?.map((dc, i) => (
            <div className="flex flex-row w-full justify-between mx-4 my-6">
              <div className="flex flex-col flex-start ">
                <div className="flex flex-row items-center mr-1">
                  <Author key={`key.author${i}`} id={dc.user} />
                </div>

                <h1
                  onClick={() => navigate(`/Posts/${dc.id}`)}
                  className="font-popxl  text-xl mt-2 cursor-pointer"
                >
                  {dc.title}
                </h1>
                <h1
                  onClick={() => navigate(`/Posts/${dc.id}`)}
                  className="font-pop  text-md mb-2 text-gray-400 cursor-pointer"
                >
                  {dc?.txt + "..."}
                </h1>

                <div className="flex flex-row mt-1 font-popxs text-xs">
                  {dc.time}. 3 min read
                </div>
              </div>
              <img className="w-56 " src={dc?.img} alt="" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Feed;
