import React, { useEffect, useState, useRef } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useLocation } from "react-router-dom";
import { FillingBottle, Messaging } from "react-cssfx-loading/lib";
import Clap from "../images/clap.svg";
import Read from "../images/read.svg";
import party from "party-js";
import useAuth from "../hooks/userAuth";
function Post() {
  const route = useLocation();
  const ref = useRef([]);
  const { userID } = useAuth();
  const [editorState, setEditorState] = useState();
  const [title, setTitle] = useState(null);
  const [author, setAuthor] = useState(null);
  const [load, setLoad] = useState(false);
  const docID = route.pathname.split("/")[2]
    ? route.pathname.split("/")[2]
    : "Create";
  function confetti(id) {
    party.confetti(ref.current[id], {
      count: party.variation.range(50, 100),
      size: party.variation.range(0.1, 1.4),
    });

    ref.current[id].style.animation = "explode 100ms forwards";
  }
  useEffect(() => {
    getDoc(doc(db, "Posts", docID)).then((dc) => {
      setEditorState(dc.data().data ? dc.data().data : "");
      getDoc(doc(db, "Profiles", dc.data().user)).then((dic) =>
        setAuthor({ id: dic.id, data: dic.data() })
      );
      setTitle(dc?.data()?.title);
    });
  }, []);

  return (
    <>
      {load === true ? (
        <div className="w-full h-full   bg-white flex flex-col items-center justify-center">
          {load ? (
            <Messaging
              color="#818cf8"
              width="15px"
              height="15px"
              duration="0.5s"
            />
          ) : (
            <FillingBottle
              color="#818cf8"
              width="100px"
              height="100px"
              duration="2s"
            />
          )}
          <h1 className="font-pop text-gray-500 text-center md:text-2xl lg:text-3xl mt-8">
            {load ? "Saving..." : "Creating New Post"}
          </h1>
        </div>
      ) : (
        <div className="flex  bg-white px-16 flex-col mt-4 md:mt-16 w-full h-full justify-start">
          <div className="flex flex-row items-center mb-8">
            <div className="mr-1">
              <img
                src={author?.data.img}
                alt=""
                className="w-8 h-8 rounded-full"
              />
            </div>
            <div className="flex flex-col ml-1">
              <h1 className="font-poplg text-md my-auto">
                {author?.data.name}
              </h1>
              <h1 className=" font-popxs text-xs my-auto">
                {Date().slice(4, 9)} . 6 min read
              </h1>
            </div>
          </div>
          <h1 className="font-pop text-4xl">{title}</h1>
          <div
            className="ql-viewer -mt-8"
            dangerouslySetInnerHTML={{
              __html: editorState,
            }}
          ></div>

          <div className="flex flex-row justify-between w-full mt-4">
            <div
              onClick={() => confetti(`id.${1}`)}
              ref={(el) => (ref.current[`id.${1}`] = el)}
              key={`id.${1}`}
              className="flex flex-col cursor-pointer items-center rounded-lg hover:bg-indigo-200 "
            >
              <img className="w-12 h-12 p-2" src={Clap} alt="" />
              <h1 className=" font-pop text-gray-400 text-xxs -mt-2">Claps</h1>
              <h1 className="font-popxl -mt-2">25</h1>
            </div>
            <div
              onClick={() => confetti(`id.${2}`)}
              ref={(el) => (ref.current[`id.${2}`] = el)}
              key={`id.${2}`}
              className="flex cursor-pointer flex-col items-center rounded-lg hover:bg-indigo-200 "
            >
              <img className="w-12 h-12 p-2" src={Read} alt="" />
              <h1 className=" font-pop text-gray-400 text-xxs -mt-2">Reads</h1>
              <h1 className="font-popxl -mt-2">25</h1>
            </div>
          </div>

          <div className="flex flex-col mt-5 border-t">
            <div className="flex justify-center mt-4">
              {!userID ? (
                <div className="cursor-pointer bg-gradient-to-br hover:shadow-md text-white font-pop from-orange-400 to-orange-600 p-2 rounded-md">
                  Login to post your comment
                </div>
              ) : (
                <div className="flex flex-col w-full rounded-md bg-indigo-100 border border-indigo-200 mb-4">
                  <div className="flex flex-row w-full items-center justify-between">
                    <div className="mt-2 ml-2 flex flex-row items-center">
                      <img
                        className="w-8 h-8 object-cover rounded-full"
                        alt=""
                        src={userID?.img}
                      />
                      <div className="flex flex-col">
                        <h1 className="ml-2 font-poplg my-auto">
                          {userID?.name}
                        </h1>
                        <h1 className="ml-2 text-xs font-popxs my-auto">Now</h1>
                      </div>
                    </div>
                    <div className="mr-2 cursor-pointer hover:shadow-md bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-md font-pop h-6 text-white px-4">
                      Post
                    </div>
                  </div>
                  <textarea className="h-24 text-sm font-pop w-full bg-transparent p-4 outline-none" />
                </div>
              )}
            </div>
            {[0, 0, 0].map((dc) => (
              <div className="flex flex-col my-2">
                <div className="flex flex-row items-center">
                  <img
                    className="w-8 h-8 object-cover rounded-full"
                    alt=""
                    src={
                      "https://ichef.bbci.co.uk/news/976/cpsprodpb/5FEF/production/_123295542_hi073181766.jpg"
                    }
                  />
                  <div className="flex flex-col">
                    <h1 className="ml-2 font-poplg my-auto">Elon</h1>
                    <h1 className="ml-2 text-xs font-popxs my-auto">
                      About 1 hr ago
                    </h1>
                  </div>
                </div>
                <h1 className="mt-2 font-popxs italic text-sm">
                  "Recommend monitoring and track suspected cheating
                  wive/husband and activities at work. However some great app
                  couldn't grant all access I needed to detect and catch my
                  spouse red handed in deceptive ways. It all started when I had
                  a suspicion on my…..."
                </h1>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default Post;
