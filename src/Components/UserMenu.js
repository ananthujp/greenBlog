import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/userAuth";
import SwitchAdmin from "./SwitchAdmin";
import onClickOutside from "react-onclickoutside";
function UserMenu({ setshowMenu, dark, setDispMode }) {
  const { role, userID, setUserID } = useAuth();

  useEffect(() => {
    dark
      ? document.documentElement.classList.add("dark")
      : document.documentElement.classList.remove("dark");
  }, [dark]);
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
    <div className="absolute shadow-md top-16 right-2 bg-white dark:bg-slate-700 border border-gray-100 dark:border-slate-800 px-6 py-4 z-50 font-pop text-sm">
      <h1 className=" dark:text-gray-100">{userID?.name}</h1>
      <h1 className="-ml-4 cursor-default  dark:text-gray-100">
        {role === "admin" && <SwitchAdmin />}
      </h1>
      <label className="mt-4 transform scale-90">
        <input
          onChange={(e) => setDispMode(e.target.checked)}
          className="toggle-checkbox group"
          type="checkbox"
        ></input>
        <div
          className={
            "toggle-slot border " +
            (dark ? "border-indigo-500" : "border-yellow-500")
          }
        >
          <div className="sun-icon-wrapper">
            <div
              className="iconify sun-icon -mt-0.5"
              data-icon="feather-sun"
              data-inline="false"
            >
              Light Mode
            </div>
          </div>
          <div className="toggle-button"></div>
          <div className="moon-icon-wrapper">
            <div
              className="iconify moon-icon -mt-0.5"
              data-icon="feather-moon"
              data-inline="false"
            >
              Dark Mode
            </div>
          </div>
        </div>
      </label>
      <h1
        className="cursor-pointer mt-2 hover:text-gray-400  dark:text-gray-100"
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
