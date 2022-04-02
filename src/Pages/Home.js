import { motion } from "framer-motion";
import { useEffect } from "react";
import HomeLogo from "../images/homeLogo.svg";
import NavBar from "../Components/NavBar";
import { Link } from "react-router-dom";
import TempLogin from "../Components/TempLogin";
import useAuth from "../hooks/userAuth";

import Sidebar from "../Components/Sidebar";
import {
  BellIcon,
  HomeIcon,
  LibraryIcon,
  MailIcon,
  PencilAltIcon,
  UserIcon,
} from "@heroicons/react/outline";
import { useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase";
const Item = [
  {
    icon: (
      <PencilAltIcon className="text-indigo-400 group-hover:text-white w-12 md:w-20" />
    ),
    name: "Write",
    link: "/Write",
    txt: "Lorem ipsum dolor sit amet lorem",
  },
  {
    icon: (
      <BellIcon className="text-indigo-400 group-hover:text-white w-12 md:w-20" />
    ),
    name: "Notifications",
    link: "/Notifications",
    txt: "Lorem ipsum dolor sit amet lorem",
  },
  {
    icon: (
      <UserIcon className="text-indigo-400 group-hover:text-white w-12 md:w-20" />
    ),
    name: "Dashboard",
    link: "/UserDash",
    txt: "Lorem ipsum dolor sit amet lorem",
  },
  {
    icon: (
      <MailIcon className="text-indigo-400 group-hover:text-white w-12 md:w-20" />
    ),
    name: "Mailbox",
    link: "/MailBox",
    txt: "Lorem ipsum dolor sit amet lorem",
  },
];
function Home() {
  const { userID } = useAuth();
  const [show, setShow] = useState(false);
  const ReadCount = ({ items }) => {
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
  return (
    <motion.div className="flex flex-col md:flex-row h-full">
      {!show ? <></> : <TempLogin show={setShow} />}
      <div className="relative md:h-screen">
        <NavBar />
      </div>

      <div className="relative flex flex-col overflow-y-auto">
        <div className="relative flex flex-col h-screen w-full justify-between">
          <div className="flex bg-white md:flex-row flex-col w-full justify-between px-8 my-auto h-auto md:h-full">
            <div>
              <img
                src={HomeLogo}
                className="w-4/5 h-full mx-auto my-auto"
                alt=""
              />
            </div>
            <div className="md:w-2/5 w-4/5 my-auto md:mx-0 mx-auto pr-4">
              <h1 className="font-pop text-indigo-500 text-4xl md:text-5xl">
                Write Your
              </h1>
              <h1 className="font-popxl md:-mt-7 text-indigo-500 text-5xl md:text-6xl">
                FIRST BLOG
              </h1>
              <h1 className="font-pop text-gray-500">
                We want to hear your stories, your experiences, your
                contribution, your message to make this world a better place.
                Come pen down your thoughts and create a unique and beautiful
                blog.
              </h1>
              <div className="flex flex-row">
                <div className=" mx-auto md:mx-0" onClick={() => setShow(true)}>
                  <Link to={show || userID ? "/Write" : ""}>
                    <div
                      className={
                        "  cursor-pointer transition-all hover:bg-white hover:text-indigo-400 shadow-md md:mt-6 mt-2 px-6 py-2 rounded-3xl text-center text-white" +
                        (userID ? " bg-indigo-400" : " bg-orange-400")
                      }
                    >
                      {userID ? "Write" : "Login/Register"}
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="flex mx-auto w-4/5 flex-row justify-around md:mt-0 mt-6 pb-12">
            {userID &&
              Item.map((doc) => (
                <Link to={doc.link}>
                  <div className="relative flex flex-col group hover:shadow-md shadow-sm overflow-hidden md:p-6 p-4 md:mx-4 mx-2 rounded-xl bg-indigo-50 transition-all hover:bg-indigo-400">
                    {doc.icon}
                    <ReadCount items={doc.name} />
                    <h1 className="font-popxl mt-2 sm:text-sm text-xs md:text-xl text-indigo-400 group-hover:text-white my-auto">
                      {doc.name}
                    </h1>
                    <div className="font-pop hidden md:flex text-xs group-hover:text-white text-indigo-400">
                      {doc.txt}
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
        {/* <div className=" relative flex flex-col px-16">
          Lorem ipsum dolor sit amet, consectetur adip lorem ipsum dolor sit
          amet, consectetur adip
          <img
            src="https://m.media-amazon.com/images/M/MV5BOTVmMDMwYWMtOGM1Ni00YmFiLTg4OGItMjEyYTQ3MDQ1MzVmXkEyXkFqcGdeQXVyMjkxNzQ1NDI@._V1_.jpg"
            alt=""
          />
        </div> */}
      </div>
      <div className="h-screen">{userID ? <Sidebar /> : <></>}</div>
    </motion.div>
  );
}

export default Home;
