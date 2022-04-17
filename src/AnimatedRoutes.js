import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./Pages/Home";
import useAuth from "./hooks/userAuth";
import Login from "./Pages/Login";
import Write from "./Pages/Write";
import UserDash from "./Pages/UserDash";
import AdminPanel from "./Pages/AdminPanel";
import Notifications from "./Pages/Notifications";
import MailBox from "./Pages/MailBox";
import NavBar from "./Components/NavBar";
import Sidebar from "./Components/Sidebar";
import Subscribe from "./Pages/Subscribe";
import Feed from "./Pages/Feed";
import Post from "./Pages/Post";
import { useState, useEffect } from "react";
import Popup from "reactjs-popup";
import SubLogo from "./images/subscribe.svg";
import { XIcon } from "@heroicons/react/outline";
import TempLogin from "./Components/TempLogin";
import Author from "./Pages/Author";
const AnimatedRoutes = () => {
  const location = useLocation();
  const { user, login, userID } = useAuth();

  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);
  return (
    <AnimatePresence exitBeforeEnter>
      {login && <TempLogin />}

      <div className="flex flex-col md:flex-row h-full bg-white">
        <div className="flex flex-col md:flex-row md:w-full">
          <div className="relative md:w-16 md:h-screen">
            <NavBar />
          </div>
          <Popup open={open} closeOnDocumentClick onClose={closeModal}>
            <div className="bg-white/40 backdrop-blur-lg p-4 rounded-xl w-full shadow-md">
              <a className="" onClick={closeModal}>
                <XIcon className="w-6  p-1 hover:bg-white rounded-full" />
              </a>
              <div className="flex flex-col w-full my-auto items-center justify-between">
                <img src={SubLogo} className="w-4/5 mx-auto" alt="" />
                <h1 className="font-popxl text-xl mt-4">Don't Miss a thing</h1>
                <h1 className="font-pop text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing
                </h1>
                <div className="border border-gray-300 my-2 w-3/5 flex flex-row bg-indigo-100 rounded-lg overflow-hidden ">
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
          <Routes location={location} key={location.pathname}>
            <Route exact path="/" element={<Home />} />

            <Route path="/Posts/:id" element={<Post />} />
            {userID && (
              <>
                <Route path="/Write/:id" element={<Write />} />
                <Route path="/Write" element={<Write />} />
                <Route path="/UserDash" element={<UserDash />} />
                <Route path="/AdminPanel" element={<AdminPanel />} />
                <Route path="/Notifications" element={<Notifications />} />
                <Route path="/MailBox" element={<MailBox />} />
                <Route path="/MailBox/:id" element={<MailBox />} />
              </>
            )}
            <Route path="/Feed" element={<Feed />} />
            <Route path="/Author/:id" element={<Author />} />
          </Routes>
        </div>
        <div className="md:h-screen md:w-64">
          <Sidebar setOpen={setOpen} />
        </div>
      </div>
    </AnimatePresence>
  );
};
export default AnimatedRoutes;
