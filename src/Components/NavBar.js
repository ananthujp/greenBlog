import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  BellIcon,
  HomeIcon,
  LibraryIcon,
  MailIcon,
  PencilAltIcon,
  UserIcon,
} from "@heroicons/react/outline";
import useAuth from "../hooks/userAuth";
import { useLocation } from "react-router-dom";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

function NavBar() {
  const scr = window.matchMedia("(min-width: 768px)");
  const { role, userID } = useAuth();
  const route = useLocation();
  const [hover, setHover] = useState(false);
  const items = [
    {
      name: <HomeIcon className="w-8 rounded-full p-1 hover:bg-indigo-50" />,
      link: "/",
      title: "Home",
    },
    {
      name: <BellIcon className="w-8 rounded-full p-1 hover:bg-indigo-50" />,
      link: "/Notifications",
      title: "Notifications",
    },
    {
      name: <MailIcon className="w-8 rounded-full p-1 hover:bg-indigo-50" />,
      link: "/MailBox",
      title: "Mailbox",
    },
    {
      name: <UserIcon className="w-8 rounded-full p-1 hover:bg-indigo-50" />,
      link: "/UserDash",
      title: "Dashboard",
    },
    {
      name: (
        <LibraryIcon className="w-8 rounded-full p-1 hover:bg-indigo-50 " />
      ),
      link: "/AdminPanel",
      title: "Admin Panel",
    },
    {
      name: (
        <PencilAltIcon className="w-8 rounded-full p-1 hover:bg-indigo-50" />
      ),
      link: "/Write",
      title: "Write",
    },
  ];
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
          "absolute  items-center justify-center text-white bottom-3 left-6 bg-red-500 rounded-full text-xs w-5 h-5 " +
          (count > 0 ? " flex" : " hidden")
        }
      >
        {count}
      </div>
    );
  };
  return (
    // <div className="flex justify-between ">
    <div
      onMouseEnter={() => window.innerWidth > 640 && setHover(true)}
      onMouseLeave={() => window.innerWidth > 640 && setHover(false)}
      className={
        "flex flex-row md:flex-col h-16 md:w-16  transition-all w-full md:h-full items-start justify-center md:border-r border-b border-gray-300" +
        (hover && " md:w-64")
      }
    >
      {items.map((item, index) => (
        <Link
          key={`navbar.item${index}`}
          to={item.link}
          hidden={
            (item.link === "/AdminPanel" && role !== "admin" && " true") ||
            (!userID && item.link !== "/" && " true")
          }
        >
          <div
            className={
              "relative flex flex-row group items-center justify-start mx-4 transition-all cursor-pointer "
            }
          >
            {userID && <ReadCount items={item.title} />}
            <h1
              className={
                " transition-all  group-hover:text-indigo-400 cursor-pointer my-4 " +
                (index === items.length - 1 &&
                  "md:border-t md:mt-1 md:pt-4 pt-0 border-gray-200") +
                (!scr.matches &&
                  index === items.length - 1 &&
                  " ml-1 pl-4  border-l ") +
                (route.pathname === item.link
                  ? "  text-indigo-400"
                  : "  text-gray-200")
              }
            >
              {item.name}
            </h1>
            <h1
              className={
                "my-auto ml-4 group transition-all  group-hover:text-indigo-400" +
                (route.pathname === item.link
                  ? "  text-indigo-400"
                  : "  text-gray-200") +
                (hover ? " hidden md:flex" : " hidden")
              }
            >
              {item.title}
            </h1>
          </div>
        </Link>
      ))}
      {/* </div> */}
      {/* <div>
        <div className="mx-2 font-pop flex flex-row">
          {user ? user.email : <></>}
          <div onClick={logout} className="cursor-pointer">
            (Logout)
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default NavBar;
