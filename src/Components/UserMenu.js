import React from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/userAuth";
import SwitchAdmin from "./SwitchAdmin";
import onClickOutside from "react-onclickoutside";
function UserMenu({ setshowMenu }) {
  const { role, userID, setUserID } = useAuth();
  const navigate = useNavigate();
  UserMenu.handleClickOutside = () => {
    setshowMenu(false);
  };
  const handleLogout = () => {
    navigate("/");
    localStorage.removeItem("user");
    setUserID(null);
    setshowMenu(false);
  };
  return (
    <div className="absolute shadow-md top-16 right-2 bg-white border border-gray-100 px-6 py-4 z-50 font-pop text-sm">
      <h1>{userID?.name}</h1>
      <h1 className="-ml-4 cursor-default">
        {role === "admin" && <SwitchAdmin />}
      </h1>
      <h1
        className="cursor-pointer hover:text-gray-400"
        onClick={() => handleLogout()}
      >
        Logout
      </h1>
    </div>
  );
}
const clickOutsideConfig = {
  handleClickOutside: () => UserMenu.handleClickOutside,
};
export default onClickOutside(UserMenu, clickOutsideConfig);
