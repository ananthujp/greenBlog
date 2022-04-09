import React from "react";
import Popup from "reactjs-popup";
import SubLogo from "../images/subscribe.svg";

function Subscribe() {
  const [open, setOpen] = React.useState(false);
  const closeModal = () => setOpen(false);
  return (
    <div className="flex flex-col w-full my-auto items-center justify-between">
      <button
        type="button"
        className="button"
        onClick={() => setOpen((o) => !o)}
      >
        Controlled Popup
      </button>
      <Popup open={open} closeOnDocumentClick onClose={closeModal}>
        <div className="bg-white/40 backdrop-blur-lg p-4 rounded-xl w-full shadow-md">
          <a className="close" onClick={closeModal}>
            &times;
          </a>
          <div className="flex flex-col w-full my-auto items-center justify-between">
            <img src={SubLogo} className="w-3/5 mx-auto" alt="" />
            <h1 className="font-popxl text-xl mt-4">Don't Miss a thing</h1>
            <h1 className="font-pop text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing
            </h1>
            <div className="border border-gray-300 w-3/5 flex flex-row bg-indigo-100 rounded-lg overflow-hidden ">
              <input
                type="text"
                placeholder="Enter your email"
                className="w-full py-2 bg-transparent outline-none text-md px-2"
              />
              <button className="bg-indigo-600 transition-all active:bg-indigo-500 hover:bg-indigo-400 border border-indigo-600 px-2 text-white">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </Popup>
    </div>
  );
}

export default Subscribe;
