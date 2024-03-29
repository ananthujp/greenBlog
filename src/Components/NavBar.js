import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { NavBarItem } from "./Colors";
import {
  BellIcon,
  CogIcon,
  HomeIcon,
  LibraryIcon,
  MailIcon,
  PencilAltIcon,
  UserIcon,
} from "@heroicons/react/outline";
import useAuth from "../hooks/userAuth";
import { useLocation } from "react-router-dom";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import logo from "../images/logo.png";
import logo_txt from "../images/logo_txt.png";
import { db } from "../firebase";
import UserMenu from "./UserMenu";
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
          (dc) => setCount(dc?.docs.length)
        );
        break;
      case "Notifications":
        onSnapshot(
          query(
            collection(db, "Profiles", userID?.id, "Notifications"),
            where("read", "==", false)
          ),
          (dc) => setCount(dc?.docs.length)
        );
        break;
      case "Dashboard":
        onSnapshot(
          query(collection(db, "Posts"), where("user", "==", userID?.id)),
          (dc) => setCount(dc?.docs.length)
        );
        break;
      default:
    }
  }, []);

  return (
    <div
      className={
        "absolute items-center justify-center text-white bottom-3  left-6 bg-red-500 rounded-full text-xs w-5 h-5 " +
        (count > 0 ? " flex" : " hidden")
      }
    >
      {count}
    </div>
  );
};
function NavBar({ sub, feed }) {
  const scr = window.matchMedia("(min-width: 768px)");
  const { role, userID, ColorID, dark, setDispMode, setLogin } = useAuth();
  const route = useLocation();
  const [hover, setHover] = useState(false);
  const [showMenu, setshowMenu] = useState(false);
  const items = [
    {
      name: (
        <HomeIcon
          className={
            "w-8 rounded-full p-1 bg-gradient-to-br " +
            NavBarItem[ColorID].gpHover
          }
        />
      ),
      link: "/",
      title: "Home",
    },
    {
      name: (
        <BellIcon
          className={
            "w-8 rounded-full p-1 bg-gradient-to-br " +
            (userID
              ? NavBarItem[ColorID].gpHover
              : " group-hover:from-gray-400 group-hover:to-gray-600 dark:group-hover:from-gray-600 dark:group-hover:to-gray-800")
          }
        />
      ),
      link: "/Notifications",
      title: "Notifications",
    },
    {
      name: (
        <MailIcon
          className={
            "w-8 rounded-full p-1 bg-gradient-to-br " +
            (userID
              ? NavBarItem[ColorID].gpHover
              : " group-hover:from-gray-400 group-hover:to-gray-600 dark:group-hover:from-gray-600 dark:group-hover:to-gray-800")
          }
        />
      ),
      link: "/MailBox",
      title: "Mailbox",
    },
    {
      name: (
        <UserIcon
          className={
            "w-8 rounded-full p-1 bg-gradient-to-br " +
            (userID
              ? NavBarItem[ColorID].gpHover
              : " group-hover:from-gray-400 group-hover:to-gray-600 dark:group-hover:from-gray-600 dark:group-hover:to-gray-800")
          }
        />
      ),
      link: "/UserDash",
      title: "Dashboard",
    },
    {
      name: (
        <LibraryIcon
          className={
            "w-8 rounded-full p-1 bg-gradient-to-br " +
            (userID
              ? NavBarItem[ColorID].gpHover
              : " group-hover:from-gray-400 group-hover:to-gray-600 dark:group-hover:from-gray-600 dark:group-hover:to-gray-800")
          }
        />
      ),
      link: "/AdminPanel",
      title: "Admin Panel",
    },
    {
      name: (
        <PencilAltIcon
          className={
            "w-8 rounded-full p-1 bg-gradient-to-br " +
            (userID
              ? NavBarItem[ColorID].gpHover
              : " group-hover:from-gray-400 group-hover:to-gray-600 dark:group-hover:from-gray-600 dark:group-hover:to-gray-800")
          }
        />
      ),
      link: "/Write",
      title: "Write",
    },
  ];

  return (
    <>
      {showMenu && (
        <UserMenu
          setshowMenu={setshowMenu}
          dark={dark}
          sub={sub}
          feed={feed}
          setDispMode={setDispMode}
        />
      )}
      <div
        onMouseEnter={() => window.innerWidth > 640 && setHover(true)}
        onMouseLeave={() => window.innerWidth > 640 && setHover(false)}
        className={
          "flex z-50 md:my-3 rounded-lg bg-white dark:bg-slate-700 backdrop-blur-md md:fixed flex-row md:flex-col h-16 md:w-16  transition-all w-full md:h-[97%] items-start justify-between md:justify-between md:border border-b border-gray-200 dark:border-slate-500 " +
          (hover && " md:w-52")
        }
      >
        <Link
          to="/"
          className="relative flex overflow-hidden flex-row justify-start  my-auto ml-4 md:mt-4 "
        >
          <img src={logo} className=" w-8 h-8" alt="" />
          <img
            src={logo_txt}
            alt=""
            className={
              "ml-2 h-8 my-auto font-popxl dark:text-slate-300 whitespace-nowrap" +
              (hover ? " flex" : " hidden")
            }
          />
        </Link>
        <>
          {items.map((item, index) => (
            <Link
              key={`navbar.item.${index}`}
              to={userID ? item.link : ""}
              hidden={
                item.link === "/AdminPanel" && role !== "admin" && " true"
                //||(!userID && item.link !== "/" && " true")
              }
            >
              <div
                onClick={() => !userID && item.link !== "/" && setLogin(true)}
                className={
                  "relative flex flex-row group items-center justify-start md:mx-4 transition-all cursor-pointer "
                }
              >
                {userID && (
                  <ReadCount
                    userID={userID}
                    key={`read.count.${index}`}
                    items={item?.title}
                  />
                )}
                <h1
                  className={
                    " transition-all  group-hover:text-white cursor-pointer my-4 " +
                    (index === items.length - 1 &&
                      "md:border-t md:mt-1 md:pt-4 pt-0 border-gray-200") +
                    (!scr.matches &&
                      index === items.length - 1 &&
                      " ml-1 pl-4  border-l ") +
                    (route.pathname === item.link
                      ? NavBarItem[ColorID].text
                      : "  text-gray-400 dark:text-white")
                  }
                >
                  {item.name}
                </h1>
                <h1
                  className={
                    "my-auto ml-4 group transition-all " +
                    (userID && NavBarItem[ColorID].group) +
                    (route.pathname === item.link
                      ? NavBarItem[ColorID].text
                      : "  text-gray-400") +
                    (hover ? " hidden md:flex" : " hidden")
                  }
                >
                  {item.title}
                </h1>
              </div>
            </Link>
          ))}
        </>
        <div className="h-9 w-9 rounded-full overflow-hidden my-auto">
          <div
            onClick={() => setshowMenu(!showMenu)}
            className="h-8 w-8 rounded-full overflow-hidden my-auto md:hidden border-2 hover:border-indigo-300 border-indigo-100 shadow-sm"
          >
            {userID ? (
              <img src={userID.img} className="" alt="" />
            ) : (
              <CogIcon className="w-6 h-6 mt-0.5 dark:text-slate-300 mx-auto my-auto" />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default NavBar;
