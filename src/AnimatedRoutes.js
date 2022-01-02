import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./Home";
import useAuth from "./hooks/userAuth";
import Login from "./Login";

const AnimatedRoutes = () => {
    const location = useLocation();
    const  {user}=useAuth();
  return (
    <AnimatePresence exitBeforeEnter>

    {user?
        <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
        </Routes>
        :
        <Login/>
    }
    </AnimatePresence>
    );
};
export default AnimatedRoutes;