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

const AnimatedRoutes = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { userID } = useAuth();
  return (
    <AnimatePresence exitBeforeEnter>
      {user ? (
        <div className="flex flex-col md:flex-row h-full">
          <div className="flex flex-col md:flex-row md:w-full">
            <div className="relative md:h-screen">
              <NavBar />
            </div>
            <Routes location={location} key={location.pathname}>
              <Route exact path="/" element={<Home />} />
              <Route path="/Write/:id" element={<Write />} />
              <Route path="/Write" element={<Write />} />
              <Route path="/UserDash" element={<UserDash />} />
              <Route path="/AdminPanel" element={<AdminPanel />} />
              <Route path="/Notifications" element={<Notifications />} />
              <Route path="/MailBox" element={<MailBox />} />
            </Routes>
          </div>
          <div className="md:h-screen">{userID ? <Sidebar /> : <></>}</div>
        </div>
      ) : (
        <Login />
      )}
    </AnimatePresence>
  );
};
export default AnimatedRoutes;
