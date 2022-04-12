import React from "react";

import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/userAuth";

import SwitchAdmin from "../Components/SwitchAdmin";
import { PlusIcon } from "@heroicons/react/outline";
function Sidebar({ preview, setOpen }) {
  const route = useLocation();
  const { userID, setUserID, role, setLogin } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="hidden fixed shadow-md md:flex transition-all w-full flex-col md:h-full h-28 border-l border-gray-300 px-4 md:pt-4 md:w-56">
      <div>
        {userID ? (
          <>
            <div className="h-16 w-16 rounded-full overflow-hidden mb-2">
              <img src={userID?.img} className="h-16 w-16" alt="" />
            </div>
            <h1 className=" font-poplg my-1 text-gray-500">{userID?.name}</h1>

            <h1 className="text-xs font-pop  text-gray-300">{userID?.Bio}</h1>

            <div className="flex flex-row mt-2">
              <div
                onClick={() => {
                  route.pathname.split("/")[1] !== "Posts" && navigate("/");
                  localStorage.removeItem("user");
                  setUserID(null);
                }}
                className="cursor-pointer text-white font-pop text-xs items-center flex px-2 mr-2 rounded-full hover:bg-indigo-300  bg-gradient-to-br from-indigo-400 to-indigo-500 hover:to-indigo-600"
              >
                Logout
              </div>
              <div
                onClick={() => preview(false)}
                className="w-6 h-6 rounded-full hover:bg-indigo-300  bg-gradient-to-br from-indigo-400 to-indigo-500 hover:to-indigo-600 ml-1"
              >
                <PlusIcon className="w-4 mt-1 flex text-white mx-auto my-auto" />
              </div>
            </div>
            <div className="w-32 mt-4 text-indigo-400">
              {role === "admin" && <SwitchAdmin />}
            </div>
          </>
        ) : (
          <div
            onClick={() => setLogin(true)}
            className="flex w-16 cursor-pointer bg-gradient-to-br hover:shadow-md text-indigo-600 hover:text-white font-pop text-center from-gray-50 to-gray-100 hover:from-indigo-400 hover:to-indigo-600 p-0.5 rounded-md"
          >
            Login
          </div>
        )}
      </div>
      <div className="flex flex-col my-8 mx-auto">
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
      </div>
      <button
        type="button"
        className="flex mx-auto px-4 py-1 font-pop shadow-md hover:shadow-lg text-white rounded-md bg-gradient-to-br from-indigo-400 to-indigo-500 hover:to-indigo-600"
        onClick={() => setOpen((o) => !o)}
      >
        Subscribe
      </button>
    </div>
  );
}

export default Sidebar;
