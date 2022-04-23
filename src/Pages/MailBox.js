import {
  BackspaceIcon,
  MailIcon,
  PaperAirplaneIcon,
  PlusCircleIcon,
  TrashIcon,
  XIcon,
} from "@heroicons/react/outline";
import {
  addDoc,
  collection,
  getDoc,
  setDoc,
  onSnapshot,
  orderBy,
  query,
  doc,
  serverTimestamp,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { Pages, ColorID, SideBar } from "../Components/Colors";
import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "../Components/NavBar";
import Sidebar from "../Components/Sidebar";
import SwitchAdmin from "../Components/SwitchAdmin";
import { db } from "../firebase";
import useAuth from "../hooks/userAuth";
import mail from "../images/mail.png";
function MailBox() {
  const navigate = useNavigate();
  const [search, setSearch] = useState();
  const [result, setResult] = useState();
  const [mob, changeScreen] = useState(false);
  const [profiles, setProfiles] = useState();
  const [thread, setThread] = useState();
  const [to, setTo] = useState({});
  const [sender, setSender] = useState(false);
  const [title, settitle] = useState();
  const [reply, setReply] = useState(false);
  const [fromUser, setfromUser] = useState();
  const [textCont, settextCont] = useState();
  const [mailview, setView] = useState(false);
  const [mails, setMails] = useState();
  const { userID, role } = useAuth();
  const route = useLocation();
  const x = window.matchMedia("(min-width: 768px)");
  const formatText = (txt) => {
    if (txt.length > 12) return txt.slice(0, 12) + "...";
    else return txt;
  };
  useEffect(() => {
    const matches =
      search?.length > 1 &&
      profiles?.filter((element) => {
        if (element.name.toLowerCase().indexOf(search.toLowerCase()) !== -1) {
          return true;
        }
      });
    setResult([matches]);
  }, [search]);

  const handleView = (id) => {
    changeScreen(true);
    setThread(id);
    setDoc(
      doc(db, "Profiles", userID?.id, "Mailbox", id),
      { read: true },
      { merge: true }
    );
    getDoc(doc(db, "Profiles", userID?.id, "Mailbox", id)).then((dc) => {
      settitle(dc?.data().title);
      settextCont(dc?.data().text);
      setReply(dc?.data().reply);
      setfromUser(dc?.data().from);
    });
    setView(false);
  };

  const submitThread = () => {
    title &&
      textCont &&
      addDoc(collection(db, "Profiles", userID.id, "Mailbox"), {
        title: title,
        from: userID.id,
        text: textCont,
        reply: reply,
        to: to,
        read: false,
        timestamp: serverTimestamp(),
      }).then((response) => {
        setThread(response.id);
        getDoc(doc(db, "Profiles", userID?.id, "Mailbox", response.id)).then(
          (dc) => {
            settitle(dc.data().title);
            settextCont(dc.data().text);
            setReply(dc.data().reply);
          }
        );
        setView(false);
      });
    title &&
      textCont &&
      addDoc(collection(db, "Profiles", to.id, "Mailbox"), {
        title: title,
        from: userID.id,
        text: textCont,
        reply: reply,
        read: false,
        to: to,
        timestamp: serverTimestamp(),
      });
  };

  const GetUser = ({ id }) => {
    const [names, setName] = useState("");
    id &&
      getDoc(doc(db, "Profiles", id)).then((dc) => {
        setName(dc.data().name);
      });
    return <div className="ml-1">{id === userID?.id ? "Me" : names}</div>;
  };
  const GetImage = ({ id }) => {
    const [img, setImg] = useState("");
    id &&
      getDoc(doc(db, "Profiles", id)).then((dc) => {
        setImg(dc.data().img);
      });
    return <img className="w-8 h-8 rounded-full" src={img} alt="" />;
  };

  const MailThread = ({ id }) => {
    const [title, setTitle] = useState("");
    const [cont, setCont] = useState("");
    getDoc(
      doc(
        db,
        "Profiles",
        fromUser === userID?.id ? userID?.id : fromUser,
        "Mailbox",
        id
      )
    ).then((dc) => {
      setTitle(dc?.data().title);
      setCont(dc?.data().text);
    });

    return (
      <div className="ml-8">
        <h1 className=" font-poplg text-xs text-gray-300 whitespace-nowrap">
          Sub : {title}
        </h1>
        <h1 className="font-pop text-xs text-gray-300 whitespace-wrap">
          {cont}
        </h1>
      </div>
    );
  };
  useEffect(() => {
    route.pathname.split("$")[1] && setView(true);
    route.pathname.split("$")[1] && setReply(false);
    route.pathname.split("$")[1] && settitle("");
    route.pathname.split("$")[1] && settextCont("");
    route.pathname.split("$")[1] &&
      getDoc(doc(db, "Profiles", route.pathname.split("$")[1])).then((dc) => {
        setTo({ id: dc.id, name: dc.data().name });
      });
  }, []);
  useEffect(() => {
    onSnapshot(
      query(
        collection(db, "Profiles", userID?.id, "Mailbox"),
        orderBy("timestamp", "desc")
      ),
      (dc) => setMails(dc.docs.map((dc) => ({ data: dc.data(), id: dc.id })))
    );
    onSnapshot(collection(db, "Profiles"), (dc) =>
      setProfiles(
        dc.docs.map((dc) => ({
          name: dc.data().name,
          img: dc.data().img,
          id: dc.id,
        }))
      )
    );
  }, [userID]);
  return (
    <>
      {/* <div className="flex flex-col md:flex-row md:w-full"> */}
      {/* <NavBar /> */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={
          "flex flex-col bg-gradient-to-br  dark:from-slate-600 dark:to-gray-600 md:flex-row w-full h-screen mb-0 px-8 pt-2 md:pt-12 " +
          Pages[ColorID].pageBg
        }
      >
        <div className="flex flex-col items-left w-2/5">
          <img className="lg:pr-8 mb-4 w-64 hidden md:flex" src={mail} alt="" />
          <h1
            className={"font-poplg text-2xl text-left " + Pages[ColorID].head}
          >
            Mailbox
          </h1>
          <div className="flex flex-col justify-between">
            <h1 className={"font-popxs text-md " + Pages[ColorID].sub}>
              Green blog mailbox
            </h1>
            <div
              className={"w-32 mt-4 dark:text-white" + SideBar[ColorID].text}
            >
              {role === "admin" && <SwitchAdmin />}
            </div>
          </div>
        </div>
        {x.matches ? (
          <div className="flex flex-row border rounded-lg h-2/3 md:h-[80%] md:mb-8 border-gray-200 w-full bg-white dark:border-slate-800 dark:bg-slate-700 shadow-md">
            <div className=" h-full w-2/5 flex flex-col justify-between border-r border-gray-200 dark:border-slate-800">
              <div className="flex flex-col h-full overflow-y-auto">
                {mails?.map((dic, i) => (
                  <div
                    key={`mail.side${i}`}
                    onClick={() => handleView(dic.id)}
                    className={
                      "flex flex-row justify-between cursor-pointer  items-center p-2 dark:hover:bg-slate-600" +
                      Pages[ColorID].hover2 +
                      (thread === dic.id
                        ? " dark:bg-slate-600" + Pages[ColorID].active
                        : "") +
                      (!dic.data.read
                        ? " bg-yellow-100 dark:bg-slate-500"
                        : " ")
                    }
                  >
                    <div className="flex flex-row items-center">
                      <GetImage id={dic.data.from ? dic.data.from : ""} />

                      <div className="flex flex-col ml-2">
                        <h1
                          className={
                            " my-auto dark:text-white" +
                            (!dic.data.read ? " font-poplg" : " font-pop")
                          }
                        >
                          {dic.data.title}
                        </h1>
                        <h1
                          className={
                            "font-pop text-xs dark:text-gray-200" +
                            (!dic.data.read ? " font-poplg" : " font-pop")
                          }
                        >
                          {formatText(dic.data.text)}
                        </h1>
                      </div>
                    </div>
                    <div className="mr-4">
                      <TrashIcon
                        onClick={() =>
                          deleteDoc(
                            doc(db, "Profiles", userID?.id, "Mailbox", dic.id)
                          )
                        }
                        className={
                          "w-8 p-2 text-gray-500 hover:text-white rounded-full" +
                          Pages[ColorID].icoHover
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div
                onClick={() => {
                  setView(true);
                  setReply(false);
                  settitle("");
                  settextCont("");
                  setTo({ id: "HyAS9bQrGoNbH6yekzzK", name: "Admin" });
                }}
                className={
                  "mx-2 mb-4 flex flex-row justify-center dark:text-white hover:text-white dark:bg-slate-500 cursor-pointer shadow-md rounded-full items-center h-12 " +
                  Pages[ColorID].hover3
                }
              >
                <PlusCircleIcon className="w-6 mr-2" />
                New Mail
              </div>
            </div>
            <div className="w-4/5 flex flex-col">
              {mailview ? (
                <div className=" flex flex-col h-full w-full">
                  <div className="flex flex-row justify-between m-2">
                    <div className="relative flex flex-row cursor-pointer items-center whitespace-nowrap dark:bg-slate-600 bg-gray-50 border border-r-gray-200 dark:border-slate-800 px-4 py-1 rounded-full text-gray-400">
                      <MailIcon
                        onClick={() => setSender(true)}
                        className="w-4"
                      />
                      To :
                      {sender ? (
                        <>
                          <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            type="text"
                            className="outline-none px-2 text-gray-800"
                          />
                          <div className="absolute flex flex-col z-50 ml-10 mt-8 top-0">
                            {result?.map(
                              (dxc, i) =>
                                dxc.length > 0 &&
                                dxc?.map((dc, j) => (
                                  <div
                                    key={`search.res${j}`}
                                    onClick={() => {
                                      setSender(false);
                                      setTo({ id: dc.id, name: dc.name });
                                    }}
                                    className={
                                      "flex flex-row py-2 pl-2 pr-12 border-b text-gray-500 border-gray-300 bg-gray-50" +
                                      Pages[ColorID].hover2 +
                                      (dxc.length === j + 1
                                        ? " rounded-b-lg overflow-hidden"
                                        : "")
                                    }
                                  >
                                    <img
                                      src={dc.img}
                                      alt=""
                                      className="w-5 h-5 rounded-full mr-2"
                                    />
                                    <div key={`search.${j}`}>{dc.name}</div>
                                  </div>
                                ))
                            )}
                          </div>
                        </>
                      ) : (
                        to?.name
                      )}
                      <XIcon
                        onClick={() => setSender(true)}
                        className={
                          "w-4 hover:text-white rounded-full p-0.5 ml-2" +
                          Pages[ColorID].hover3
                        }
                      />
                    </div>
                    <div
                      onClick={() => submitThread()}
                      className={
                        "flex flex-row items-center whitespace-nowrap cursor-pointer hover:bg-gray-50 shadow-md px-4 py-1 rounded-full text-white" +
                        Pages[ColorID].button
                      }
                    >
                      <PaperAirplaneIcon className="w-4" />
                      &nbsp;Send
                    </div>
                  </div>

                  <div
                    className={
                      " flex flex-row items-end rounded-full  dark:bg-slate-600 overflow-hidden border dark:border-slate-800 mx-2" +
                      Pages[ColorID].border
                    }
                  >
                    <h1
                      className={
                        "font-pop rounded-full dark:bg-slate-600  bg-gray-50 p-1 ml-2 mt-0 my-auto" +
                        Pages[ColorID].title
                      }
                    >
                      Subject :
                    </h1>
                    <input
                      onChange={(e) => settitle(e.target.value)}
                      value={title ? title : ""}
                      type="text"
                      className="outline-none p-1 flex dark:bg-slate-600 items-start"
                    />
                  </div>
                  <div
                    className={
                      "flex flex-col h-full border dark:border-slate-800 m-2" +
                      Pages[ColorID].border
                    }
                  >
                    <textarea
                      onChange={(e) => settextCont(e.target.value)}
                      value={textCont}
                      className="h-full dark:bg-slate-600 dark:text-white outline-none bg-transparent p-4 flex items-start"
                    />
                    {reply && (
                      <div className="flex flex-col p-4">
                        <h1 className="text-gray-400 font-popxs">
                          ------ Reply
                        </h1>
                        <MailThread id={reply} />
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div
                  className={
                    " flex-col h-full w-full" + (thread ? " flex" : " hidden")
                  }
                >
                  <div className="flex flex-row justify-between m-2">
                    <div
                      onClick={() =>
                        navigate(`/Author/${fromUser ? fromUser : ""}`)
                      }
                      className="flex flex-row items-center whitespace-nowrap cursor-pointer dark:bg-slate-600 dark:border-gray-500 bg-gray-50 border border-r-gray-200 px-4 py-1 rounded-full text-gray-400"
                    >
                      <MailIcon className="w-4" />
                      from :<GetUser id={fromUser ? fromUser : ""} />
                    </div>
                    <div
                      onClick={() => {
                        setReply(thread);
                        settitle("Re-" + title);
                        settextCont("");
                        setView(true);
                        getDoc(doc(db, "Profiles", fromUser)).then((dc) => {
                          setTo({ id: fromUser, name: dc.data().name });
                        });
                      }}
                      className={
                        "flex flex-row items-center whitespace-nowrap cursor-pointer hover:bg-gray-50 shadow-md px-4 py-1 rounded-full dark:hover:text-white text-white" +
                        Pages[ColorID].button
                      }
                    >
                      <PaperAirplaneIcon className="w-4" />
                      &nbsp;Reply
                    </div>
                  </div>

                  <div
                    className={
                      " flex flex-row items-end rounded-full bg-gray-50 dark:bg-slate-600 mx-2" +
                      Pages[ColorID].border
                    }
                  >
                    <h1
                      className={
                        "font-pop rounded-full bg-gray-50 dark:bg-slate-600 p-1 ml-2 mt-0.5 my-auto" +
                        Pages[ColorID].title
                      }
                    >
                      Subject :
                    </h1>
                    <input
                      onChange={(e) => settitle(e.target.value)}
                      disabled
                      value={title ? title : "Loading.."}
                      type="text"
                      className="outline-none p-1 flex items-start dark:bg-slate-600 dark:text-white"
                    />
                  </div>
                  <div
                    className={
                      "flex flex-col h-full bg-gray-50 dark:bg-slate-600 rounded-lg m-2" +
                      Pages[ColorID].border
                    }
                  >
                    <textarea
                      onChange={(e) => settextCont(e.target.value)}
                      disabled
                      value={textCont}
                      className="h-full outline-none bg-transparent dark:text-white p-4 flex items-start"
                    />
                    {reply && (
                      <div className="flex flex-col p-4">
                        <h1 className="text-gray-400 font-popxs">
                          ------ Reply
                        </h1>
                        <MailThread id={reply} />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-row border rounded-lg h-2/3 md:h-[80%] md:mb-8 border-gray-200 dark:border-slate-800 w-full bg-white dark:bg-slate-700">
            <div
              className={
                " h-full flex flex-col justify-between border-r border-gray-200 dark:border-slate-800" +
                (!mob ? "  w-4/5" : " w-1/5")
              }
            >
              {!mob ? (
                <>
                  <div className="flex flex-col  h-screen overflow-y-auto">
                    {mails?.map((dic, i) => (
                      <div
                        key={`mails${i}`}
                        onClick={() => handleView(dic.id)}
                        className={
                          "flex flex-row justify-between cursor-pointer  items-center p-2 dark:hover:bg-slate-600" +
                          Pages[ColorID].hover +
                          (thread === dic.id
                            ? Pages[ColorID].active + " dark:bg-slate-600"
                            : "") +
                          (!dic.data.read
                            ? " bg-yellow-100 dark:bg-slate-500"
                            : " ")
                        }
                      >
                        <div className="flex flex-row items-center">
                          <GetImage id={dic.data.from ? dic.data.from : ""} />

                          <div className="flex flex-col ml-2">
                            <h1
                              className={
                                " my-auto dark:text-white" +
                                (!dic.data.read ? " font-poplg" : " font-pop")
                              }
                            >
                              {dic.data.title}
                            </h1>
                            <h1
                              className={
                                "font-pop text-xs dark:text-white" +
                                (!dic.data.read ? " font-poplg" : " font-pop")
                              }
                            >
                              {formatText(dic.data.text)}
                            </h1>
                          </div>
                        </div>
                        <div className="mr-4">
                          <TrashIcon
                            onClick={() =>
                              deleteDoc(
                                doc(
                                  db,
                                  "Profiles",
                                  userID?.id,
                                  "Mailbox",
                                  dic.id
                                )
                              )
                            }
                            className={
                              "w-8 p-2 text-gray-500 hover:text-white rounded-full " +
                              Pages[ColorID].icoHover
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div
                    onClick={() => {
                      setView(true);
                      setReply(false);
                      settitle("");
                      settextCont("");
                      changeScreen(true);
                      setTo({ id: "HyAS9bQrGoNbH6yekzzK", name: "Admin" });
                    }}
                    className={
                      "mx-2 mb-4 flex dark:text-white dark:bg-slate-500 flex-row justify-center hover:text-white cursor-pointer shadow-md rounded-full items-center h-12" +
                      Pages[ColorID].hover3
                    }
                  >
                    <PlusCircleIcon className="w-6 mr-2" />
                    New Mail
                  </div>
                </>
              ) : (
                <div
                  onClick={() => changeScreen(false)}
                  className="flex flex-col h-screen overflow-y-auto"
                >
                  <div
                    className={
                      "flex p-1 rounded-tl-lg flex-row bg-gradient-to-br dark:bg-slate-600 dark:text-gray-200 hover:text-white cursor-pointer font-pop items-center " +
                      Pages[ColorID].button
                    }
                  >
                    <BackspaceIcon className="w-4" /> Back
                  </div>
                </div>
              )}
            </div>
            <div className={" flex flex-col" + (!mob ? " w-1/5" : " w-4/5")}>
              {mob && mailview ? (
                <div className=" flex flex-col h-full w-full">
                  <div className="flex flex-row justify-between m-2">
                    <div className="relative flex flex-row dark:bg-slate-600 cursor-pointer items-center whitespace-nowrap bg-gray-50 border dark:border-slate-800 border-r-gray-200 px-4 py-1 rounded-full text-gray-400">
                      <MailIcon
                        onClick={() => setSender(true)}
                        className="w-4"
                      />
                      To :
                      {sender ? (
                        <>
                          <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            type="text"
                            className="outline-none px-2 text-gray-800"
                          />
                          <div className="absolute flex flex-col z-50 ml-10 mt-8 top-0">
                            {result?.map(
                              (dxc, i) =>
                                dxc.length > 0 &&
                                dxc?.map((dc, j) => (
                                  <div
                                    key={`search2${j}`}
                                    onClick={() => {
                                      setSender(false);
                                      setTo({ id: dc.id, name: dc.name });
                                    }}
                                    className={
                                      "flex flex-row py-2 pl-2 pr-12 border-b text-gray-500 border-gray-300 bg-gray-50 " +
                                      Pages[ColorID].hover2 +
                                      (dxc.length === j + 1
                                        ? " rounded-b-lg overflow-hidden"
                                        : "")
                                    }
                                  >
                                    <img
                                      src={dc.img}
                                      alt=""
                                      className="w-5 h-5 rounded-full mr-2"
                                    />
                                    <div key={`search.${j}`}>{dc.name}</div>
                                  </div>
                                ))
                            )}
                          </div>
                        </>
                      ) : (
                        to?.name
                      )}
                      <XIcon
                        onClick={() => setSender(true)}
                        className={
                          "w-4 hover:text-white rounded-full p-0.5 ml-2" +
                          Pages[ColorID].hover3
                        }
                      />
                    </div>
                    <div
                      onClick={() => submitThread()}
                      className={
                        "flex flex-row items-center whitespace-nowrap cursor-pointer hover:bg-gray-50 shadow-md px-4 py-1 rounded-full text-white" +
                        Pages[ColorID].button
                      }
                    >
                      <PaperAirplaneIcon className="w-4" />
                      &nbsp;Send
                    </div>
                  </div>

                  <div
                    className={
                      " flex flex-row items-end rounded-full border dark:border-slate-700 dark:bg-slate-600 mx-2" +
                      Pages[ColorID].border
                    }
                  >
                    <h1
                      className={
                        "font-pop rounded-full bg-gray-50 dark:bg-slate-600 p-1 ml-2 mt-0.5 my-auto" +
                        Pages[ColorID].title
                      }
                    >
                      Subject :
                    </h1>
                    <input
                      onChange={(e) => settitle(e.target.value)}
                      value={title ? title : ""}
                      type="text"
                      className="outline-none p-1 dark:bg-slate-600 dark:text-gray-100 flex items-start"
                    />
                  </div>
                  <div
                    className={
                      "flex flex-col h-full border dark:border-slate-800 m-2" +
                      Pages[ColorID].border
                    }
                  >
                    <textarea
                      onChange={(e) => settextCont(e.target.value)}
                      value={textCont}
                      className="h-full outline-none bg-transparent dark:bg-slate-600 dark:text-gray-100 p-4 flex items-start"
                    />
                    {reply && (
                      <div className="flex flex-col p-4">
                        <h1 className="text-gray-400 font-popxs">
                          ------ Reply
                        </h1>
                        <MailThread id={reply} />
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                mob && (
                  <div
                    className={
                      " flex-col h-full w-full" + (thread ? " flex" : " hidden")
                    }
                  >
                    <div className="flex flex-row justify-between m-2">
                      <div
                        onClick={() => reply && handleView(reply)}
                        className="flex flex-row dark:bg-slate-600 dark:border-gray-500 items-center whitespace-nowrap cursor-pointer bg-gray-50 border border-r-gray-200 px-4 py-1 rounded-full text-gray-400"
                      >
                        <MailIcon className="w-4" />
                        from :<GetUser id={fromUser ? fromUser : ""} />
                      </div>
                      <div
                        onClick={() => {
                          setReply(thread);
                          settitle("Re-" + title);
                          settextCont("");
                          setView(true);
                          getDoc(doc(db, "Profiles", fromUser)).then((dc) => {
                            setTo({ id: fromUser, name: dc.data().name });
                          });
                        }}
                        className={
                          "flex flex-row dark:hover:text-white items-center whitespace-nowrap cursor-pointer hover:bg-gray-50 shadow-md px-4 py-1 rounded-full text-white " +
                          Pages[ColorID].button
                        }
                      >
                        <PaperAirplaneIcon className="w-4" />
                        &nbsp;Reply
                      </div>
                    </div>

                    <div
                      className={
                        " flex flex-row items-end  overflow-hidden dark:bg-slate-600 rounded-full bg-gray-50 mx-2" +
                        Pages[ColorID].border
                      }
                    >
                      <h1
                        className={
                          "font-pop dark:bg-slate-600 rounded-full bg-gray-50 p-1 ml-2 mt-0.5 my-auto " +
                          Pages[ColorID].title
                        }
                      >
                        Subject :
                      </h1>
                      <input
                        onChange={(e) => settitle(e.target.value)}
                        disabled
                        value={title ? title : "Loading.."}
                        type="text"
                        className="outline-none dark:bg-slate-600 dark:text-white p-1 flex items-start"
                      />
                    </div>
                    <div
                      className={
                        "flex flex-col h-full bg-gray-50 rounded-lg dark:bg-slate-600 m-2" +
                        Pages[ColorID].border
                      }
                    >
                      <textarea
                        onChange={(e) => settextCont(e.target.value)}
                        disabled
                        value={textCont}
                        className="h-full outline-none bg-transparent p-4 flex dark:text-white items-start"
                      />
                      {reply && (
                        <div className="flex flex-col p-4">
                          <h1 className="text-gray-400 font-popxs">
                            ------ Reply
                          </h1>
                          <MailThread id={reply} />
                        </div>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </motion.div>
      {/* </div> */}
      {/* <Sidebar /> */}
    </>
  );
}

export default MailBox;
