import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";

function Feed() {
  const [posts, setPosts] = useState();
  useEffect(() => {
    getDocs(collection(db, "Posts")).then((dc) =>
      setPosts(dc.docs.map((dic) => ({ id: dic.id, data: dic.data() })))
    );
  }, []);
  return (
    <div className="w-full flex flex-col">
      <h1>Popular posts</h1>
      {posts.map((dc) => (
        <div>{dc.id}</div>
      ))}
    </div>
  );
}

export default Feed;
