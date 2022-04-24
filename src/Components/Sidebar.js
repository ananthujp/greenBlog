import React, { useState } from "react";
import { SideBar, Pages } from "./Colors";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/userAuth";
import { motion } from "framer-motion";
import SwitchAdmin from "../Components/SwitchAdmin";
import {
  ChatIcon,
  EyeIcon,
  PlusIcon,
  RefreshIcon,
} from "@heroicons/react/outline";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
function Sidebar({ preview, setOpen, dark, setDispMode }) {
  const route = useLocation();
  const [showCol, setShowCol] = useState(false);
  const [showCust, setShowCust] = useState(false);
  const { userID, setUserID, role, setLogin, author, ColorID, setColorID } =
    useAuth();
  const navigate = useNavigate();
  const BlogAuthor = ({ id }) => {
    const [auth, setAuth] = useState();
    getDoc(doc(db, "Profiles", id)).then((dic) =>
      setAuth({ id: dic.id, data: dic.data() })
    );
    return (
      <div className="flex flex-col border-y py-6 dark:bg-slate-800 border-gray-200">
        <h1 className="font-pop text-gray-600 dark:text-slate-50 mb-2">
          Blog Author
        </h1>
        <div className="h-16 w-16 rounded-full overflow-hidden mb-2">
          <img src={auth?.data?.img} className="h-16 w-16" alt="" />
        </div>
        <h1 className=" font-poplg my-1 text-gray-500 dark:text-slate-200">
          {auth?.data?.name}
        </h1>
        <h1 className="text-xs font-pop  text-gray-300">{auth?.data?.Bio}</h1>
        <div className="flex flex-row mt-2">
          <div
            onClick={() => navigate("/Author/" + id)}
            className="cursor-pointer py-0.5 text-white font-pop text-xs items-center flex px-2 mr-2 rounded-full hover:bg-indigo-300  bg-gradient-to-br from-blue-400 to-blue-500 hover:to-blue-600"
          >
            <EyeIcon className="w-5 mr-1" />
            Visit
          </div>
          <div
            onClick={() => navigate("/MailBox/to$" + id)}
            className="cursor-pointer text-white font-pop text-xs items-center flex px-2 mr-2 rounded-full hover:bg-indigo-300  bg-gradient-to-br from-green-400 to-green-500 hover:to-green-600"
          >
            <ChatIcon className="w-5 mr-1" />
            Chat
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="hidden fixed md:flex transition-all w-full flex-col md:h-full h-28 border-l border-gray-300 dark:border-slate-900 px-8 md:pt-4 md:w-auto">
      <div>
        {route.pathname.split("/")[1] !== "Posts" ? (
          userID && (
            <>
              <div className="h-16 w-16 rounded-full overflow-hidden mb-2">
                <img src={userID?.img} className="h-16 w-16" alt="" />
              </div>
              <h1 className=" font-poplg my-1 text-gray-500 dark:text-white">
                {userID?.name}
              </h1>
              <h1 className="text-xs font-pop  text-gray-300">{userID?.Bio}</h1>
              <div className="flex flex-row mt-2">
                <div
                  onClick={() => {
                    route.pathname.split("/")[1] !== "Posts" && navigate("/");
                    localStorage.removeItem("user");
                    setUserID(null);
                  }}
                  className={
                    "cursor-pointer text-white font-pop text-xs items-center flex px-2 mr-2 rounded-full  bg-gradient-to-br" +
                    SideBar[ColorID].button
                  }
                >
                  Logout
                </div>
                <div
                  onClick={() => preview(false)}
                  className={
                    "w-6 h-6 rounded-full  bg-gradient-to-br " +
                    SideBar[ColorID].button
                  }
                >
                  <PlusIcon className="w-4 mt-1 flex text-white mx-auto my-auto" />
                </div>
              </div>
              <div
                className={"w-32 mt-4 dark:text-white " + SideBar[ColorID].text}
              >
                {userID && role === "admin" && <SwitchAdmin />}
              </div>
            </>
          )
        ) : (
          <BlogAuthor id={author} />
        )}
        {!userID && (
          <h1
            onClick={() => setLogin(true)}
            className={
              "mx-auto px-4 cursor-pointer py-1 mt-6 font-pop shadow-md bg-gradient-to-br hover:shadow-md text-center rounded-full " +
              SideBar[ColorID].login
            }
          >
            Login
          </h1>
        )}
      </div>
      {/* <div className="flex flex-col my-8 mx-auto">
        <h1 className="font-pop text-lg">Popular Articles</h1>

        {[0, 0, 0, 0].map(() => (
          <div className="my-2 flex flex-row active:bg-gray-200 hover:bg-indigo-100 p-1.5 rounded-lg cursor-default transition-all">
            <div className="w-12 h-12 bg-black"></div>
            <div className="ml-2">
              <h1 className="font-pop my-auto">Heading</h1>
              <h1 className="font-popxs text-xs whitespace-nowrap">
                Lorem ipsum text
              </h1>
            </div>
          </div>
        ))}
      </div> */}
      <button
        type="button"
        className={
          "flex mx-auto px-8 py-1 mt-6 font-pop shadow-md hover:shadow-lg text-white rounded-full bg-gradient-to-br " +
          SideBar[ColorID].button
        }
        onClick={() => setOpen((o) => !o)}
      >
        Subscribe
      </button>
      <div
        onMouseEnter={() => setShowCust(true)}
        onMouseLeave={() => setShowCust(false)}
        className={
          "flex flex-col border mt-2 w-auto  " +
          Pages[ColorID].border2 +
          (showCust ? "  rounded-lg" : " rounded-full")
        }
      >
        <div className={"flex flex-row justify-between px-2 py-1"}>
          <h1
            onClick={() => setShowCust(!showCust)}
            className="font-pop dark:text-white cursor-pointer text-black my-auto "
          >
            Theme
          </h1>
          <div className={"flex flex-row items-center justify-center"}>
            <div className="flex items-center w-6 h-6 mx-0.5 rounded-full dark:bg-slate-600 bg-slate-300">
              {/* <RefreshIcon className=" mx-auto my-auto outline-none border-0 dark:text-slate-800 text-white w-4" /> */}
            </div>
            <div
              className={
                "flex items-center w-6 h-6 mx-0.5 rounded-full " +
                Pages[ColorID].ico
              }
            >
              {/* <RefreshIcon className=" mx-auto my-auto outline-none border-0 text-white w-4" /> */}
            </div>
          </div>
        </div>
        {showCust && (
          <>
            <motion.label
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 1 } }}
              className="mt-1 mx-2"
            >
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
                  <div className="text-[#ffbb52] -mt-['-0.0325']">
                    Light Mode
                  </div>
                </div>
                <div className="toggle-button"></div>
                <div className="moon-icon-wrapper">
                  <div className="text-white -mt-['-0.0325']">Dark Mode</div>
                </div>
              </div>
            </motion.label>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 1 } }}
              className={
                "w-36 border flex mx-2 cursor-pointer flex-col my-3 py-0.5 " +
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
                  className={
                    "w-6 h-6 rounded-full mr-0.5 " + Pages[ColorID].ico
                  }
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
                      key={`color.id.boc${i}`}
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
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
