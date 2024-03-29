import React, { useEffect, useState, useRef } from "react";
import { Pages } from "../Components/Colors";
import { db } from "../firebase";
import moment from "moment";
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
import {
  WhatsappShareButton,
  WhatsappIcon,
  TwitterShareButton,
  TwitterIcon,
  FacebookShareButton,
  FacebookIcon,
} from "react-share";
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
  const { userID, setLogin, setPostAuthor, ColorID } = useAuth();
  const [editorState, setEditorState] = useState();
  const [title, setTitle] = useState(null);
  const [cover, setCover] = useState(null);
  const [url, setUrl] = useState(null);
  const [titleMsg, setTitleMsg] = useState(null);
  const [time, setTime] = useState(null);
  const [readtime, setRTime] = useState(4);
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
    setLoad(true);
    getDoc(doc(db, "Posts", docID))
      .then((dc) => {
        setCover(dc.data().data?.split('<img src="')[1]?.split('"')[0]);
        setEditorState(dc.data().data ? dc.data().data : "");
        getDoc(doc(db, "Profiles", dc.data().user)).then((dic) =>
          setAuthor({ id: dic.id, data: dic.data() })
        );
        setPostAuthor(dc.data().user);
        setTime(
          dc
            .data()
            .timestamp.toDate()
            .toLocaleDateString(
              {},
              { timeZone: "UTC", month: "long", day: "2-digit" }
            )
        );
        setRTime(dc.data().time ? dc.data().time : 4);
        setTitle(dc?.data()?.title);
        setTitleMsg(dc?.data()?.title);
        setUrl("https://students.iitgn.ac.in/greenclub/blog/#/Posts/" + docID);
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
      })
      .then(() => setLoad(false));

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
            time: moment(dic.data().timestamp.toDate()).fromNow(),
          }))
        )
    );
  }, []);

  return (
    <>
      {load === true ? (
        // <div className="w-full h-screen md:h-full dark:bg-slate-700  bg-white flex flex-col items-center justify-center">
        //   {load ? (
        //     <Messaging
        //       color="#818cf8"
        //       width="15px"
        //       height="15px"
        //       duration="0.5s"
        //     />
        //   ) : (
        //     <FillingBottle
        //       color="#818cf8"
        //       width="100px"
        //       height="100px"
        //       duration="2s"
        //     />
        //   )}
        //   <h1 className="font-pop text-gray-500 text-center md:text-2xl lg:text-3xl mt-8">
        //     {load ? "Loading.." : "Creating New Post"}
        //   </h1>
        // </div>
        <div className="flex  mx-2 my-3 border border-slate-200 dark:border-slate-500 rounded-lg  bg-white dark:bg-slate-700 px-6 md:px-16 flex-col pt-4 md:pt-16 w-full h-full justify-start">
          <div className="flex flex-row items-center mb-8 w-full justify-between">
            <div className="flex flex-row items-center cursor-pointer">
              <div className="mr-1">
                <div className="w-8 h-8 rounded-full bg-gray-400 animate-pulse" />
              </div>
              <div className="flex flex-col ml-1">
                <div className="font-poplg text-md my-auto dark:text-slate-100 bg-gray-400 animate-pulse h-3 w-20" />
                <div className=" font-popxs text-xs mt-2 dark:text-slate-200 bg-gray-300 animate-pulse h-2 w-24" />
              </div>
            </div>
            <div className="flex flex-row justify-between w-32">
              <div className="w-8 h-8 rounded-full bg-gray-400 animate-pulse" />
              <div className="w-8 h-8 rounded-full bg-gray-400 animate-pulse" />
              <div className="w-8 h-8 rounded-full bg-gray-400 animate-pulse" />
            </div>
          </div>
          <div className="font-pop text-4xl animate-pulse dark:text-slate-100 h-10 bg-gray-200 w-56" />
          <div className="w-full mt-8 animate-pulse bg-gray-200 h-96 dark:text-slate-200" />
        </div>
      ) : (
        <div className="flex mx-2 my-3 border border-slate-200 dark:border-slate-500 rounded-lg bg-white dark:bg-slate-700 flex-col overflow-hidden w-full h-full justify-start">
          <div className="overflow-hidden">
            <img
              src={cover}
              className="h-44 w-full object-cover saturate-200 shadow-inner"
              alt=""
            />
          </div>
          <div className="px-6 md:px-16 pt-4 md:pt-4 flex flex-col">
            <div className="flex flex-row items-center mb-8 w-full justify-between">
              <div
                onClick={() => navigate("/Author/" + author?.id)}
                className="flex flex-row items-center cursor-pointer"
              >
                <div className="mr-1">
                  <img
                    src={author?.data.img}
                    alt=""
                    className="w-8 h-8 rounded-full"
                  />
                </div>
                <div className="flex flex-col ml-1">
                  <h1 className="font-poplg text-md my-auto dark:text-slate-100">
                    {author?.data.name}
                  </h1>
                  <h1 className=" font-popxs text-xs my-auto dark:text-slate-200">
                    {time} . {readtime} min read
                  </h1>
                </div>
              </div>
              <div className="flex flex-row justify-between w-32">
                <WhatsappShareButton title={titleMsg} url={url} separator="">
                  <WhatsappIcon round size={32} />
                </WhatsappShareButton>
                <FacebookShareButton
                  url={url}
                  quote={titleMsg}
                  hashtag={"#iitgn"}
                  description={"fbDesc"}
                >
                  <FacebookIcon round size={32} />
                </FacebookShareButton>
                <TwitterShareButton
                  title={titleMsg}
                  url={url}
                  hashtags={["iitgn", "greenclub"]}
                >
                  <TwitterIcon round size={32} />
                </TwitterShareButton>
              </div>
            </div>
            <h1 className="font-pop text-4xl dark:text-slate-100">{title}</h1>
            <div
              className="ql-viewer dark:text-slate-200"
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
                    "flex flex-row px-2 group dark:hover:bg-slate-600 dark:bg-slate-500 cursor-pointer items-center rounded-lg  shadow-sm  " +
                    Pages[ColorID].active +
                    Pages[ColorID].postButtonHover +
                    (clap.flag && Pages[ColorID].active2)
                  }
                >
                  <img className="w-12 p-2" src={Clap} alt="" />
                  <div className="flex flex-col items-center justify-center">
                    <h1
                      className={
                        " font-pop group-hover:text-white my-auto text-xxs" +
                        Pages[ColorID].postText
                      }
                    >
                      Claps
                    </h1>
                    <h1
                      className={
                        "font-popxl group-hover:text-white  my-auto" +
                        Pages[ColorID].postText
                      }
                    >
                      {clap.clap}
                    </h1>
                  </div>
                </div>
                <div
                  onClick={() => navigate("/MailBox/to$" + author.id)}
                  className={
                    "flex ml-4 flex-row px-2  dark:hover:bg-slate-600 dark:bg-slate-500 cursor-pointer items-center rounded-lg group shadow-sm " +
                    Pages[ColorID].active +
                    Pages[ColorID].postButtonHover +
                    (clap.flag && Pages[ColorID].active2)
                  }
                >
                  <img className="w-12 h-12 p-2" src={Write} alt="" />
                  <div className="flex flex-col items-center justify-center">
                    <h1
                      className={
                        " font-pop group-hover:text-white text-xxs my-auto" +
                        Pages[ColorID].postText
                      }
                    >
                      Write to
                    </h1>
                    <h1
                      className={
                        "font-popxl group-hover:text-white text-xs my-auto" +
                        Pages[ColorID].postText
                      }
                    >
                      Author
                    </h1>{" "}
                  </div>
                </div>
              </div>
              <div
                onClick={() => confetti(`id.${2}`)}
                ref={(el) => (ref.current[`id.${2}`] = el)}
                key={`id.${2}`}
                className={
                  "flex cursor-pointer  dark:bg-slate-500  dark:hover:bg-slate-600 flex-row px-2 items-center rounded-lg group shadow-sm  " +
                  Pages[ColorID].postButtonHover +
                  Pages[ColorID].active
                }
              >
                <img className="w-12 h-12 p-2" src={Read} alt="" />
                <div className="flex flex-col items-center justify-center">
                  <h1
                    className={
                      " font-pop group-hover:text-white text-xxs my-auto" +
                      Pages[ColorID].postText
                    }
                  >
                    Reads
                  </h1>
                  <h1
                    className={
                      "font-popxl group-hover:text-white my-auto" +
                      Pages[ColorID].postText
                    }
                  >
                    {read}
                  </h1>
                </div>
              </div>
            </div>

            <div className="flex flex-col mt-5 border-t">
              <div className="flex flex-col justify-center mt-4">
                <h1 className="flex font-poplg text-lg text-gray-600 mb-4">
                  Comments({comments?.length})
                </h1>
                {!userID ? (
                  // <div
                  //   onClick={() => setLogin(true)}
                  //   className="cursor-pointer bg-gradient-to-br hover:shadow-md text-white font-pop from-orange-400 to-orange-600 p-2 rounded-md"
                  // >
                  //   Login to post your comment
                  // </div>
                  <div
                    ref={(el) => (ref.current[`idcom.${1}`] = el)}
                    key={`idcom.${1}`}
                    className={
                      "flex flex-col w-full rounded-md dark:bg-slate-500 border dark:border-slate-600 mb-4 " +
                      Pages[ColorID].border +
                      Pages[ColorID].active2
                    }
                  >
                    <div
                      className={
                        "flex flex-row border-b dark:border-slate-700 pb-2 w-full items-center justify-between " +
                        Pages[ColorID].border
                      }
                    >
                      <div className="mt-2 ml-2 flex flex-row items-center">
                        <img
                          className="w-8 h-8 object-cover rounded-full"
                          alt=""
                          src={
                            "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png"
                          }
                        />
                        <div className="flex flex-col">
                          <h1 className="ml-2 font-poplg dark:text-slate-100 my-auto">
                            Unknown user
                          </h1>
                          <h1 className="ml-2 text-xs font-popxs my-auto dark:text-slate-300">
                            Now
                          </h1>
                        </div>
                      </div>
                      <div className="flex flex-row">
                        <div
                          onClick={() => toggleGif(!gif)}
                          className={
                            "mr-2 cursor-pointer hover:shadow-md rounded-md font-pop h-6 text-white px-4" +
                            (gif
                              ? " bg-gradient-to-br from-orange-400 to-orange-600 dark:from-orange-600 dark:to-orange-800"
                              : " bg-gradient-to-br from-orange-200 to-orange-400 dark:from-orange-400 dark:to-orange-600")
                          }
                        >
                          Gif
                        </div>
                        <div
                          onClick={() => setLogin(true)}
                          className={
                            "mr-2 cursor-pointer hover:shadow-md bg-gradient-to-br rounded-md font-pop h-6 text-white px-4" +
                            Pages[ColorID].border +
                            Pages[ColorID].commentButton
                          }
                        >
                          Comment
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
                          onSelect={(item) => setLogin(true)}
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
                ) : (
                  <div
                    ref={(el) => (ref.current[`idcom.${1}`] = el)}
                    key={`idcom.${1}`}
                    className={
                      "flex flex-col w-full rounded-md dark:bg-slate-500 border dark:border-slate-600 mb-4 " +
                      Pages[ColorID].border +
                      Pages[ColorID].active2
                    }
                  >
                    <div
                      className={
                        "flex flex-row border-b dark:border-slate-700 pb-2 w-full items-center justify-between " +
                        Pages[ColorID].border
                      }
                    >
                      <div className="mt-2 ml-2 flex flex-row items-center">
                        <img
                          className="w-8 h-8 object-cover rounded-full"
                          alt=""
                          src={userID?.img}
                        />
                        <div className="flex flex-col">
                          <h1 className="ml-2 font-poplg dark:text-slate-100 my-auto">
                            {userID?.name}
                          </h1>
                          <h1 className="ml-2 text-xs font-popxs my-auto dark:text-slate-300">
                            Now
                          </h1>
                        </div>
                      </div>
                      <div className="flex flex-row">
                        <div
                          onClick={() => toggleGif(!gif)}
                          className={
                            "mr-2 cursor-pointer hover:shadow-md rounded-md font-pop h-6 text-white px-4" +
                            (gif
                              ? " bg-gradient-to-br from-orange-400 to-orange-600 dark:from-orange-600 dark:to-orange-800"
                              : " bg-gradient-to-br from-orange-200 to-orange-400 dark:from-orange-400 dark:to-orange-600")
                          }
                        >
                          Gif
                        </div>
                        <div
                          onClick={() => AddComment()}
                          className={
                            "mr-2 cursor-pointer hover:shadow-md bg-gradient-to-br rounded-md font-pop h-6 text-white px-4" +
                            Pages[ColorID].border +
                            Pages[ColorID].commentButton
                          }
                        >
                          Comment
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
              {comments?.map((dc, ind) => (
                <div
                  key={`comments.post.${ind}`}
                  className={
                    "flex flex-col px-2 pt-1 pb-3 border dark:border-slate-600 rounded-lg hover:dark:bg-slate-600 my-2"
                  }
                >
                  <div className="flex flex-row items-center w-full justify-between">
                    <div
                      onClick={() => navigate("/Author/" + dc?.auth)}
                      className="flex flex-row items-center mb-1 cursor-pointer hover:bg-white hover:dark:bg-slate-800 p-1 rounded-md"
                    >
                      <img
                        className="w-8 h-8 object-cover rounded-full"
                        alt=""
                        src={dc.img}
                      />
                      <div className="flex flex-col">
                        <h1 className="ml-2 font-poplg my-auto dark:text-slate-100">
                          {dc.name}
                        </h1>
                        <h1 className="ml-2 text-xs font-pop italic text-gray-400 dark:text-slate-300 my-auto">
                          {dc.time}
                        </h1>
                      </div>
                    </div>
                    <h1
                      className={
                        " p-1 hover:text-white rounded-full " +
                        Pages[ColorID].postButtonHover +
                        (dc.auth === userID?.id ? " flex" : " hidden")
                      }
                      onClick={() => deleteComment(dc.id)}
                    >
                      <TrashIcon className="w-4 dark:text-slate-100" />
                    </h1>
                  </div>
                  {dc.image ? (
                    <img className="w-1/2 ml-10" src={dc.comment} alt="" />
                  ) : (
                    <h1 className="mt-2 ml-10 font-pop dark:text-slate-100 italic text-sm">
                      {dc.comment}
                    </h1>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Post;
