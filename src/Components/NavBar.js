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

const items = [
  {
    name: <HomeIcon className="w-8 rounded-full p-1 hover:bg-indigo-50" />,
    link: "/",
  },
  {
    name: <BellIcon className="w-8 rounded-full p-1 hover:bg-indigo-50" />,
    link: "",
  },
  {
    name: <MailIcon className="w-8 rounded-full p-1 hover:bg-indigo-50" />,
    link: "",
  },
  {
    name: <UserIcon className="w-8 rounded-full p-1 hover:bg-indigo-50" />,
    link: "/UserDash",
  },
  {
    name: <LibraryIcon className="w-8 rounded-full p-1 hover:bg-indigo-50" />,
    link: "/AdminPanel",
  },
  {
    name: <PencilAltIcon className="w-8 rounded-full p-1 hover:bg-indigo-50" />,
    link: "/Write",
  },
];
function NavBar() {
  const { user, logout } = useAuth();
  const route = useLocation();
  return (
    // <div className="flex justify-between ">
    <div className="flex flex-col h-full items-center justify-center border-r border-gray-300">
      {items.map((item, index) => (
        <Link key={`navbar.item${index}`} to={item.link}>
          <div
            className={
              "mx-4 transition-all  hover:text-indigo-400 cursor-pointer my-4 " +
              (index === items.length - 1 &&
                "border-t mt-1 pt-4 border-gray-200") +
              (route.pathname === item.link
                ? "  text-indigo-400"
                : "  text-gray-200")
            }
          >
            {item.name}
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
