import { motion } from "framer-motion";
import { useEffect } from "react";
import HomeLogo from "../images/homeLogo2.png";
import { Link } from "react-router-dom";
import TempLogin from "../Components/TempLogin";
import useAuth from "../hooks/userAuth";
import {
  BellIcon,
  MailIcon,
  PencilAltIcon,
  UserIcon,
} from "@heroicons/react/outline";
import { useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { Gradient, HomeButton, Pages } from "../Components/Colors.js";
import Feed from "./Feed";
const Item = [
  {
    icon: (
      <PencilAltIcon className="text-gray-600 dark:text-gray-200 group-hover:text-white w-12 md:w-20" />
    ),
    name: "Write",
    link: "/Write",
    txt: "Lorem ipsum dolor sit amet lorem",
  },
  {
    icon: (
      <BellIcon className="text-gray-600 dark:text-gray-200 group-hover:text-white w-12 md:w-20" />
    ),
    name: "Notifications",
    link: "/Notifications",
    txt: "Lorem ipsum dolor sit amet lorem",
  },
  {
    icon: (
      <UserIcon className="text-gray-600 dark:text-gray-200 group-hover:text-white w-12 md:w-20" />
    ),
    name: "Dashboard",
    link: "/UserDash",
    txt: "Lorem ipsum dolor sit amet lorem",
  },
  {
    icon: (
      <MailIcon className="text-gray-600 dark:text-gray-200 group-hover:text-white w-12 md:w-20" />
    ),
    name: "Mailbox",
    link: "/MailBox",
    txt: "Lorem ipsum dolor sit amet lorem",
  },
];
const Color = [
  "to-cyan-400 from-blue-600",
  "to-fuchsia-500 from-purple-700",
  "to-green-400 from-cyan-600",
  "to-purple-500 from-indigo-600",
  "to-yellow-400 from-orange-600",
  "to-pink-500 from-rose-600",
  "to-blue-400 from-indigo-600",
  "to-cyan-400 from-blue-600",
  "to-orange-400 from-pink-700",
  "to-green-400 from-cyan-700",
];
const ReadCount = ({ items, userID }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    switch (items) {
      case "Mailbox":
        onSnapshot(
          query(
            collection(db, "Profiles", userID?.id, "Mailbox"),
            where("read", "==", false)
          ),
          (dc) => setCount(dc.docs.length)
        );
        break;
      case "Notifications":
        onSnapshot(
          query(
            collection(db, "Profiles", userID?.id, "Notifications"),
            where("read", "==", false)
          ),
          (dc) => setCount(dc.docs.length)
        );
        break;
      case "Dashboard":
        onSnapshot(
          query(collection(db, "Posts"), where("user", "==", userID?.id)),
          (dc) => setCount(dc.docs.length)
        );
        break;
      default:
    }
  }, []);

  return (
    <div
      className={
        "absolute  items-center justify-center text-white right-4 bg-red-500 rounded-full text-xs w-7 h-7 " +
        (count > 0 ? " flex" : " hidden")
      }
    >
      {count}
    </div>
  );
};

function Home() {
  const { userID, login, setLogin, ColorID } = useAuth();
  useEffect(() => {
    console.log(process.env.REACT_APP_PASS_KEY);
  }, []);
  const defaultTitle =
    " dark:from-white dark:to-white from-slate-800 to-slate-800";

  return (
    <div className="w-full flex flex-col ">
      {/* <div className="relative md:h-screen">
        <NavBar />
      </div> */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={
          " flex flex-col border-b dark:border-slate-800 overflow-y-auto bg-gradient-to-br dark:from-slate-600 dark:to-gray-600" +
          Pages[ColorID].pageBg
        }
      >
        <div className="relative flex flex-col md:my-16 my-2  w-full justify-between">
          <div className="flex  md:flex-row flex-col w-full justify-between px-8 md:py-12 py-4 my-auto h-auto md:h-full">
            <div className="flex md:my-auto">
              <img
                src={HomeLogo}
                className="w-3/5 h-auto mx-auto my-auto"
                alt=""
              />
            </div>
            <div className="md:w-full w-4/5 my-auto md:mx-0 mx-auto  rounded-lg border-white dark:border-slate-500 border bg-white/40 dark:bg-slate-800/60 backdrop-blur-md px-6 py-4">
              <h1 className="font-pop text-slate-800 dark:text-white text-3xl md:text-4xl md:mb-2">
                Write
              </h1>
              <h1
                className={
                  "font-popxl  bg-gradient-to-br text-transparent bg-clip-text text-5xl md:text-6xl " +
                  defaultTitle
                }
              >
                YOUR
              </h1>
              <h1
                className={
                  "font-popxl md:-mt-7 bg-gradient-to-br text-transparent bg-clip-text text-5xl md:text-6xl " +
                  defaultTitle
                }
              >
                FIRST
              </h1>
              <h1
                className={
                  "font-popxl md:-mt-7 bg-gradient-to-br text-transparent bg-clip-text text-5xl md:text-6xl " +
                  Pages[ColorID].homeTxt
                }
              >
                BLOG
              </h1>
              <h1 className="font-pop text-gray-500 dark:text-gray-300">
                We want to hear your stories, your experiences, your
                contribution, your message to make this world a better place.
                Come pen down your thoughts and create a unique and beautiful
                blog.
              </h1>
              <div className="flex flex-row">
                <div
                  className=" mx-auto md:mx-0"
                  onClick={() => setLogin(true)}
                >
                  <Link to={login || userID ? "/Write" : ""}>
                    <div
                      className={
                        "  cursor-pointer transition-all hover:bg-white shadow-md md:mt-6 mt-2 px-6 py-2 rounded-3xl text-center text-white" +
                        (userID
                          ? " bg-gradient-to-br " + Gradient[ColorID]
                          : " bg-gradient-to-br from-orange-400 to-orange-500 hover:to-orange-600 shadow-md dark:from-orange-600 dark:to-orange-800 dark:hover:to-orange-900")
                      }
                    >
                      {userID ? "Write" : "Login/Register"}
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="flex mx-auto flex-row justify-around md:mt-0 mt-6 pb-12">
            {userID &&
              Item.map((doc, i) => (
                <Link key={`home.ico${i}`} to={doc.link}>
                  <div
                    className={
                      "relative border-white   dark:border-slate-600 border w-24 md:w-36 lg:w-44 flex flex-col group hover:shadow-md shadow-sm overflow-hidden md:p-6 p-4 md:mx-4 mx-2 rounded-xl bg-gradient-to-br from-white/60 to-white/30  dark:from-slate-800/60 dark:to-slate-800/30 backdrop-blur-md transition-all " +
                      HomeButton[ColorID]
                    }
                  >
                    {doc.icon}
                    <ReadCount items={doc.name} userID={userID} />
                    <h1 className="font-popxl mt-2 sm:text-sm text-xs md:text-xl text-gray-600 dark:text-gray-200 group-hover:text-white my-auto">
                      {doc.name}
                    </h1>
                    <div className="font-pop hidden md:flex text-xs group-hover:text-white text-gray-400">
                      {doc.txt}
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </motion.div>
      <Feed />
    </div>
  );
}

export default Home;
