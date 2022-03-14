import { Link } from "react-router-dom";
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

function NavBar() {
  const { user, logout, role, setRole } = useAuth();
  const route = useLocation();
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
      link: "",
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

  return (
    // <div className="flex justify-between ">
    <div className="flex group flex-col h-full items-start justify-center border-r border-gray-300">
      {items.map((item, index) => (
        <Link
          key={`navbar.item${index}`}
          to={item.link}
          hidden={item.link === "/AdminPanel" && role !== "admin" && " true"}
        >
          <div
            className={
              "flex flex-row items-center justify-start mx-4 transition-all cursor-pointer "
            }
          >
            <h1
              className={
                " transition-all  hover:text-indigo-400 cursor-pointer my-4 " +
                (index === items.length - 1 &&
                  "border-t mt-1 pt-4 border-gray-200") +
                (route.pathname === item.link
                  ? "  text-indigo-400"
                  : "  text-gray-200")
              }
            >
              {item.name}
            </h1>
            <h1
              className={
                "my-auto group hidden group-hover:flex hover:text-indigo-400" +
                (route.pathname === item.link
                  ? "  text-indigo-400"
                  : "  text-gray-200")
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
