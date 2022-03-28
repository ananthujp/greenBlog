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

const AnimatedRoutes = () => {
  const location = useLocation();
  const { user } = useAuth();
  return (
    <AnimatePresence exitBeforeEnter>
      {user ? (
        <Routes location={location} key={location.pathname}>
          <Route exact path="/" element={<Home />} />
          <Route path="/Write/:id" element={<Write />} />
          <Route path="/Write" element={<Write />} />
          <Route path="/UserDash" element={<UserDash />} />
          <Route path="/AdminPanel" element={<AdminPanel />} />
          <Route path="/Notifications" element={<Notifications />} />
          <Route path="/MailBox" element={<MailBox />} />
        </Routes>
      ) : (
        <Login />
      )}
    </AnimatePresence>
  );
};
export default AnimatedRoutes;
