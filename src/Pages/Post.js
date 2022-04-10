import React, { useEffect, useState, useRef } from "react";
import { db } from "../firebase";
import ReactGiphySearchbox from "react-giphy-searchbox";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";
import { FillingBottle, Messaging } from "react-cssfx-loading/lib";
import Clap from "../images/clap.svg";
import Read from "../images/read.svg";
import Write from "../images/write.svg";
import party from "party-js";
import useAuth from "../hooks/userAuth";
import { TrashIcon } from "@heroicons/react/outline";
function Post() {
  const route = useLocation();
  const ref = useRef([]);
  const { userID, setLogin } = useAuth();
  const [editorState, setEditorState] = useState();
  const [title, setTitle] = useState(null);
  const [clap, setClap] = useState({ clap: 0, flag: false });
  const [read, setRead] = useState(0);
  const [gif, toggleGif] = useState(false);
  const [author, setAuthor] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [load, setLoad] = useState(false);
  const navigate = useNavigate();
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

  const AddClap = () => {
    confetti(`id.${1}`);
    !clap.flag &&
      updateDoc(
        doc(db, "Posts", docID),
        { clap: clap.clap + 1 },
        { merge: true }
      );
    !clap.flag && setClap({ clap: clap.clap + 1, flag: true });
  };
  const deleteComment = (id) => {
    deleteDoc(doc(db, "Posts", docID, "Comments", id));
  };
  const AddComment = (img) => {
    img
      ? addDoc(collection(db, "Posts", docID, "Comments"), {
          name: userID.name,
          img: userID.img,
          auth: userID.id,
          timestamp: serverTimestamp(),
          comment: img.images.fixed_height.url,
          image: true,
        })
          .then(() => toggleGif(false))
          .then(() => confetti(`idcom.${1}`))
      : comment &&
        addDoc(collection(db, "Posts", docID, "Comments"), {
          name: userID.name,
          img: userID.img,
          auth: userID.id,
          timestamp: serverTimestamp(),
          comment: comment,
          image: false,
        })
          .then(() => setComment(""))
          .then(() => confetti(`idcom.${1}`));
  };
  useEffect(() => {
    getDoc(doc(db, "Posts", docID)).then((dc) => {
      setEditorState(dc.data().data ? dc.data().data : "");
      getDoc(doc(db, "Profiles", dc.data().user)).then((dic) =>
        setAuthor({ id: dic.id, data: dic.data() })
      );
      setTitle(dc?.data()?.title);
      setClap(
        dc?.data().clap
          ? { clap: dc?.data().clap, flag: false }
          : { clap: 0, flag: false }
      );
      setRead(dc?.data().read ? dc?.data().read : 0);
      updateDoc(
        doc(db, "Posts", docID),
        { read: (dc?.data().read ? dc?.data().read : 0) + 1 },
        { merge: true }
      );
    });

    onSnapshot(
      query(
        collection(db, "Posts", docID, "Comments"),
        orderBy("timestamp", "desc")
      ),
      (dc) =>
        setComments(
          dc.docs.map((dic) => ({
            id: dic.id,
            name: dic.data().name,
            img: dic.data().img,
            comment: dic.data().comment,
            auth: dic.data().auth,
            image: dic.data().image,
            time: parseInt(
              (new Date().getTime() - dic.data().timestamp) / 1000
            ),
          }))
        )
    );
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
            <div className="flex flex-row">
              <div
                onClick={() => AddClap()}
                ref={(el) => (ref.current[`id.${1}`] = el)}
                key={`id.${1}`}
                className={
                  "flex flex-row px-2 group cursor-pointer items-center rounded-lg  shadow-sm hover:bg-indigo-600 bg-indigo-50 " +
                  (clap.flag && " bg-indigo-100")
                }
              >
                <img className="w-12 p-2" src={Clap} alt="" />
                <div className="flex flex-col items-center justify-center">
                  <h1 className=" font-pop group-hover:text-white text-indigo-600 my-auto text-xxs">
                    Claps
                  </h1>
                  <h1 className="font-popxl group-hover:text-white text-indigo-600  my-auto">
                    {clap.clap}
                  </h1>
                </div>
              </div>
              <div
                onClick={() => navigate("/MailBox/to$" + author.id)}
                ref={(el) => (ref.current[`id.${1}`] = el)}
                key={`id.${1}`}
                className={
                  "flex ml-4 flex-row px-2 cursor-pointer items-center rounded-lg group shadow-sm hover:bg-indigo-600 bg-indigo-50 " +
                  (clap.flag && " bg-indigo-100")
                }
              >
                <img className="w-12 h-12 p-2" src={Write} alt="" />
                <div className="flex flex-col items-center justify-center">
                  <h1 className=" font-pop group-hover:text-white text-indigo-600 text-xxs my-auto">
                    Write to
                  </h1>
                  <h1 className="font-popxl group-hover:text-white text-indigo-600 text-xs my-auto">
                    Author
                  </h1>{" "}
                </div>
              </div>
            </div>
            <div
              onClick={() => confetti(`id.${2}`)}
              ref={(el) => (ref.current[`id.${2}`] = el)}
              key={`id.${2}`}
              className="flex cursor-pointer flex-row px-2 items-center rounded-lg group shadow-sm hover:bg-indigo-600 bg-indigo-50 "
            >
              <img className="w-12 h-12 p-2" src={Read} alt="" />
              <div className="flex flex-col items-center justify-center">
                <h1 className=" font-pop group-hover:text-white text-indigo-600 text-xxs my-auto">
                  Reads
                </h1>
                <h1 className="font-popxl group-hover:text-white text-indigo-600 my-auto">
                  {read}
                </h1>
              </div>
            </div>
          </div>

          <div className="flex flex-col mt-5 border-t">
            <div className="flex justify-center mt-4">
              {!userID ? (
                <div
                  onClick={() => setLogin(true)}
                  className="cursor-pointer bg-gradient-to-br hover:shadow-md text-white font-pop from-orange-400 to-orange-600 p-2 rounded-md"
                >
                  Login to post your comment
                </div>
              ) : (
                <div
                  ref={(el) => (ref.current[`idcom.${1}`] = el)}
                  key={`idcom.${1}`}
                  className="flex flex-col w-full rounded-md bg-indigo-100 border border-indigo-200 mb-4"
                >
                  <div className="flex flex-row border-b border-indigo-200 pb-2 w-full items-center justify-between">
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
                    <div className="flex flex-row">
                      <div
                        onClick={() => toggleGif(!gif)}
                        className={
                          "mr-2 cursor-pointer hover:shadow-md rounded-md font-pop h-6 text-white px-4" +
                          (gif
                            ? " bg-gradient-to-br from-orange-400 to-orange-600"
                            : " bg-gradient-to-br from-orange-200 to-orange-400")
                        }
                      >
                        Gif
                      </div>
                      <div
                        onClick={() => AddComment()}
                        className="mr-2 cursor-pointer hover:shadow-md bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-md font-pop h-6 text-white px-4"
                      >
                        Post
                      </div>
                    </div>
                  </div>
                  {!gif ? (
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="h-24 text-sm font-pop w-full bg-transparent p-4 outline-none"
                    />
                  ) : (
                    <div className="flex justify-center mb-2">
                      <ReactGiphySearchbox
                        apiKey="9Ixlv3DWC1biJRI57RanyL7RTbfzz0o7"
                        onSelect={(item) => AddComment(item)}
                        masonryConfig={[
                          { columns: 2, imageWidth: 110, gutter: 5 },
                          {
                            mq: "700px",
                            columns: 3,
                            imageWidth: 120,
                            gutter: 5,
                          },
                        ]}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
            {comments?.map((dc) => (
              <div className="flex flex-col p-1 rounded-lg hover:bg-indigo-50 my-2">
                <div className="flex flex-row items-center w-full justify-between">
                  <div className="flex flex-row items-center">
                    <img
                      className="w-8 h-8 object-cover rounded-full"
                      alt=""
                      src={dc.img}
                    />
                    <div className="flex flex-col">
                      <h1 className="ml-2 font-poplg my-auto">{dc.name}</h1>
                      <h1 className="ml-2 text-xs font-popxs my-auto">
                        {dc.time}
                      </h1>
                    </div>
                  </div>
                  <h1
                    className={
                      "hover:bg-indigo-600 p-1 hover:text-white rounded-full" +
                      (dc.auth === userID?.id ? " flex" : " hidden")
                    }
                    onClick={() => deleteComment(dc.id)}
                  >
                    <TrashIcon className="w-4" />
                  </h1>
                </div>
                {dc.image ? (
                  <img className="w-1/2" src={dc.comment} alt="" />
                ) : (
                  <h1 className="mt-2 font-popxs italic text-sm">
                    {dc.comment}
                  </h1>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default Post;
