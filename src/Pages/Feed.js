import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";

function Feed() {
  const [posts, setPosts] = useState();
  useEffect(() => {
    onSnapshot(
      query(
        collection(db, "Posts"),
        where("status", "==", "Approved")
        // ,
        // orderBy("desc", "read")
      ),
      (dc) => setPosts(dc.docs.map((dic) => ({ data: dic.data() })))
    );
  }, []);
  return (
    <div className="w-full flex flex-col px-4">
      <h1>Popular posts</h1>
      {/* {posts?.map((dc, i) => (
        <div key={`Posts.key${i}`}>{dc.data.title}</div>
      ))} */}
      <div className="flex flex-wrap flex-row">
        {[0, 0, 0, 0, 0].map((dc, i) => (
          <div className="flex flex-row flex-start px-4 py-4">
            <h1 className="font-popxl text-2xl mr-4 text-gray-400">0{i + 1}</h1>
            <div className="flex flex-col flex-start">
              <div className="flex flex-row items-center mr-1">
                <div className="mr-2 h-4 w-4 bg-black rounded-full" />
                <h1 className="font-poplg text-xs my-auto">Ananthu J P</h1>
              </div>
              <h1 className="font-popxl text-md w-44 my-2">
                Title of the post and the second post asd
              </h1>
              <div className="flex flex-row font-popxs text-xs">
                {new Date().toString().slice(4, 10)} . 3 min read
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Feed;
