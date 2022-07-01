import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/userAuth";
import SwitchAdmin from "./SwitchAdmin";
import { Pages } from "./Colors";
import { motion } from "framer-motion";
import onClickOutside from "react-onclickoutside";
function UserMenu({ setshowMenu, sub, feed }) {
  const {
    role,
    userID,
    setUserID,
    ColorID,
    setColorID,
    dark,
    setDispMode,
    setLogin,
  } = useAuth();
  const [showCol, setShowCol] = useState(false);
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
      {userID ? (
        <>
          <h1 className=" dark:text-gray-100">{userID?.name}</h1>
          <h1 className="-ml-4 cursor-default  dark:text-gray-100">
            {role === "admin" && <SwitchAdmin />}
          </h1>
        </>
      ) : (
        <h1
          className="cursor-pointer mb-2 hover:text-gray-400  dark:text-gray-100"
          onClick={() => setLogin(true)}
        >
          Login
        </h1>
      )}
      <label className="mt-4 transform scale-90">
        <input
          checked={dark}
          onChange={(e) => setDispMode(e.target.checked)}
          className="toggle-checkbox group"
          type="checkbox"
        ></input>
        <div
          className={
            "toggle-slot border " +
            (dark ? Pages[ColorID].border2 : "border-yellow-500")
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
      <div
        className={
          "w-36 transition-all border flex cursor-pointer flex-col my-3 py-0.5 " +
          (showCol ? " rounded-lg" : " rounded-full") +
          Pages[ColorID].border
        }
      >
        <div
          onClick={() => setShowCol(!showCol)}
          className="flex flex-row items-center justify-between"
        >
          <h1 className="ml-1 text-md my-auto dark:text-white font-pop">
            Change Color
          </h1>
          <div
            className={"w-6 h-6 rounded-full mr-0.5 " + Pages[ColorID].ico}
          />
        </div>
        {showCol && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 1 } }}
            className={
              "flex flex-wrap flex-row mt-1 justify-center items-center"
            }
          >
            {Pages.map((dc, i) => (
              <div
                onClick={() => {
                  setColorID(i);
                  setShowCol(false);
                }}
                className={
                  "w-6 h-6 mx-1 my-1 rounded-full mr-0.5 " + Pages[i].ico
                }
              />
            ))}
          </motion.div>
        )}
      </div>

      <h1
        className="cursor-pointer mt-2 hover:text-gray-400  dark:text-gray-100"
        onClick={() => handleLogout()}
      >
        {userID && "Logout"}
      </h1>
      <h1
        className="cursor-pointer border-t pt-2 mt-2 hover:text-gray-400  dark:text-gray-100"
        onClick={() => sub(true)}
      >
        Subscribe
      </h1>
      <h1
        className="cursor-pointer mt-2 hover:text-gray-400  dark:text-gray-100"
        onClick={() => feed(true)}
      >
        Feedback
      </h1>
    </div>
  );
}
const clickOutsideConfig = {
  handleClickOutside: () => UserMenu.handleClickOutside,
};
export default onClickOutside(UserMenu, clickOutsideConfig);
