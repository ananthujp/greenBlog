import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { NavBarItem } from "./Colors";
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
import UserMenu from "./UserMenu";
function NavBar() {
  const scr = window.matchMedia("(min-width: 768px)");
  const { role, userID, ColorID, dark, setDispMode } = useAuth();
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
            NavBarItem[ColorID].gpHover
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
            NavBarItem[ColorID].gpHover
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
            NavBarItem[ColorID].gpHover
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
            NavBarItem[ColorID].gpHover
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
            NavBarItem[ColorID].gpHover
          }
        />
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
          "absolute items-center justify-center text-white bottom-3 left-6 bg-red-500 rounded-full text-xs w-5 h-5 " +
          (count > 0 ? " flex" : " hidden")
        }
      >
        {count}
      </div>
    );
  };

  return (
    <>
      {showMenu && (
        <UserMenu
          setshowMenu={setshowMenu}
          dark={dark}
          setDispMode={setDispMode}
        />
      )}
      <div
        onMouseEnter={() => window.innerWidth > 640 && setHover(true)}
        onMouseLeave={() => window.innerWidth > 640 && setHover(false)}
        className={
          "flex z-50 bg-white/30 dark:bg-slate-800 backdrop-blur-md md:fixed flex-row md:flex-col shadow-md h-16 md:w-16  transition-all w-full md:h-full items-start md:justify-center justify-around md:border-r border-b border-gray-300 dark:border-slate-900 " +
          (hover && " md:w-52")
        }
      >
        {items.map((item, index) => (
          <Link
            key={`navbar.item.${index}`}
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
              {userID && (
                <ReadCount key={`read.count.${index}`} items={item?.title} />
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
                  NavBarItem[ColorID].group +
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
        {userID && (
          <div
            onClick={() => setshowMenu(!showMenu)}
            className="h-8 w-8 rounded-full overflow-hidden my-auto md:hidden border-2 hover:border-indigo-300 border-indigo-100 shadow-sm"
          >
            <img src={userID.img} className="" alt="" />
          </div>
        )}
      </div>
    </>
  );
}

export default NavBar;
