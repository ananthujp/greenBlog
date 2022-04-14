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
      (dc) => setPosts(dc.docs.map((dic) => ({ data: dic.data(), id: dic.id })))
    );
  }, []);
  const Author = ({ id }) => {
    const [auth, setAuth] = useState(null);
    getDoc(doc(db, "Profiles", id)).then((dc) => setAuth(dc.data()));
    return (
      <>
        <img alt="" src={auth?.img} className="mr-2 h-4 w-4 rounded-full" />
        <h1 className="font-poplg text-xs my-auto">{auth?.name}</h1>
      </>
    );
  };
  return (
    <div className="w-full flex flex-col px-4">
      <h1>Popular posts</h1>
      <div className="flex flex-wrap flex-row">
        {posts?.map((dc, i) => (
          <div className="flex flex-row flex-start px-4 py-4">
            <h1 className="font-popxl text-2xl mr-4 text-gray-400">0{i + 1}</h1>
            <div className="flex flex-col flex-start">
              <div className="flex flex-row items-center mr-1">
                <Author id={dc.data.user} />
              </div>
              <h1
                onClick={() => navigate(`/Posts/${dc.id}`)}
                className="font-popxl text-md w-44 my-2 cursor-pointer"
              >
                {dc.data.title}
              </h1>
              <div className="flex flex-row font-popxs text-xs">
                {dc.data.timestamp
                  .toDate()
                  .toLocaleDateString(
                    {},
                    { timeZone: "UTC", month: "long", day: "2-digit" }
                  ) + " "}
                . 3 min read
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Feed;
