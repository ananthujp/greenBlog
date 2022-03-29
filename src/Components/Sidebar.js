import React from "react";

import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/userAuth";
function Sidebar({ preview, view, save }) {
  const { role } = useAuth();
  const route = useLocation();
  const { userID, setUserID } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="hidden md:flex transition-all w-full flex-col md:h-full h-28 border-l border-gray-300 px-4 md:pt-4 md:w-56">
      {route.pathname.split("/")[1] === "Write" && (
        <div className="flex flex-col mb-4 bg-indigo-50 px-2 py-1 rounded-md border-b border-gray-100">
          <h1 className="font-poplg text-gray-600">Publish</h1>

          <div className="flex flex-row flex-wrap mb-6 justify-around items-center">
            <button
              onClick={() => preview(!view)}
              className={
                "rounded-full mt-2 text-white px-3" +
                (view ? " bg-gray-400" : " bg-indigo-400")
              }
            >
              {view ? "Close" : "Preview"}
            </button>

            <button
              onClick={() => save(false)}
              className="rounded-full mt-2 bg-gray-400 text-white px-3"
            >
              {userID.id === "HyAS9bQrGoNbH6yekzzK"
                ? "Approve Later"
                : "Save Draft"}
            </button>
            <button
              onClick={() => save(true)}
              className="rounded-full mt-2 bg-green-400 text-white px-3"
            >
              {userID.id === "HyAS9bQrGoNbH6yekzzK" ? "Approve" : "Submit"}
            </button>
          </div>
        </div>
      )}
      <div>
        <div className="h-16 w-16 rounded-full overflow-hidden mb-2">
          <img src={userID?.img} className="h-16 w-16" alt="" />
        </div>
        <h1 className=" font-poplg my-1 text-gray-500">{userID?.name}</h1>

        <h1 className="text-xs font-pop  text-gray-300">{userID?.Bio}</h1>
        <div className="flex flex-row mt-2">
          <div
            onClick={() => {
              navigate("/");
              localStorage.removeItem("user");
              setUserID(null);
            }}
            className="cursor-pointer text-white font-pop text-xs items-center flex px-2 mr-2 rounded-full bg-indigo-300"
          >
            Logout
          </div>
          <div
            onClick={() => preview(false)}
            className="w-6 h-6 rounded-full bg-indigo-300 ml-1"
          ></div>
        </div>
      </div>
      {/* <div className="flex flex-col my-8">
        <h1 className="font-pop text-lg">Popular Articles</h1>
        <div className="my-2 flex flex-row">
          <div className="w-12 h-12 bg-black"></div>
          <div className="ml-2">
            <h1 className="font-pop my-auto">Heading</h1>
            <h1 className="font-popxs text-xs whitespace-nowrap">
              Lorem ipsum text
            </h1>
          </div>
        </div>
        <div className="my-2 flex flex-row">
          <div className="w-12 h-12 bg-black"></div>
          <div className="ml-2">
            <h1 className="font-pop my-auto">Heading</h1>
            <h1 className="font-popxs text-xs whitespace-nowrap">
              Lorem ipsum text
            </h1>
          </div>
        </div>
        <div className="my-2 flex flex-row">
          <div className="w-12 h-12 bg-black"></div>
          <div className="ml-2">
            <h1 className="font-pop my-auto">Heading</h1>
            <h1 className="font-popxs text-xs whitespace-nowrap">
              Lorem ipsum text
            </h1>
          </div>
        </div>
        <div className="my-2 flex flex-row">
          <div className="w-12 h-12 bg-black"></div>
          <div className="ml-2">
            <h1 className="font-pop my-auto">Heading</h1>
            <h1 className="font-popxs text-xs whitespace-nowrap">
              Lorem ipsum text
            </h1>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default Sidebar;
