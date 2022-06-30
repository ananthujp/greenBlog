import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./Pages/Home";
import useAuth from "./hooks/userAuth";
import Write from "./Pages/Write";
import UserDash from "./Pages/UserDash";
import AdminPanel from "./Pages/AdminPanel";
import Notifications from "./Pages/Notifications";
import MailBox from "./Pages/MailBox";
import NavBar from "./Components/NavBar";
import Sidebar from "./Components/Sidebar";
import Subscribe from "./Pages/Subscribe";
import Feedback from "./Pages/Feedback";
import Feed from "./Pages/Feed";
import Post from "./Pages/Post";
import { useState, useEffect } from "react";
import TempLogin from "./Components/TempLogin";
import Author from "./Pages/Author";
const AnimatedRoutes = () => {
  const location = useLocation();
  const { user, login, userID, dark, setDispMode } = useAuth();
  const [sub, setSub] = useState(false);
  const [fed, setFed] = useState(false);

  useEffect(() => {
    dark
      ? document.documentElement.classList.add("dark")
      : document.documentElement.classList.remove("dark");
  }, [dark]);
  return (
    <AnimatePresence exitBeforeEnter>
      <div className="w-full h-full bg-slate-100 dark:bg-slate-800">
        <TempLogin key={`temp.login`} show={login} />
        <Subscribe key={`sub.diag`} state={sub} change={setSub} />
        <Feedback key={`sub.diag`} state={fed} change={setFed} />
        <div className="flex flex-col md:flex-row h-full dark:bg-slate-800 bg-slate-100 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between md:w-full">
            <div className="relative md:w-16 md:h-screen">
              <NavBar sub={setSub} feed={setFed} />
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
            <Sidebar
              dark={dark}
              setOpen={setSub}
              setOpenFed={setFed}
              setDispMode={setDispMode}
            />
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
};
export default AnimatedRoutes;
