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
import SubLogo from "./images/subscribe.svg";
import { XIcon } from "@heroicons/react/outline";
import TempLogin from "./Components/TempLogin";
import Author from "./Pages/Author";
const AnimatedRoutes = () => {
  const location = useLocation();
  const { user, login, userID, dark, setDispMode } = useAuth();
  const [sub, setSub] = useState(false);
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);

  useEffect(() => {
    dark
      ? document.documentElement.classList.add("dark")
      : document.documentElement.classList.remove("dark");
  }, [dark]);
  return (
    <AnimatePresence exitBeforeEnter>
      <TempLogin key={`temp.login`} show={login} />
      <Subscribe key={`sub.diag`} state={sub} change={setSub} />
      <div className="flex flex-col md:flex-row h-full dark:bg-slate-800 bg-white">
        <div className="flex flex-col md:flex-row md:w-full">
          <div className="relative md:w-16 md:h-screen">
            <NavBar />
          </div>
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
          <Sidebar setOpen={setSub} dark={dark} setDispMode={setDispMode} />
        </div>
      </div>
    </AnimatePresence>
  );
};
export default AnimatedRoutes;
