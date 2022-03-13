import { motion } from "framer-motion";
import HomeLogo from "../images/homeLogo.svg";
import NavBar from "../Components/NavBar";
import { Link } from "react-router-dom";
import TempLogin from "../Components/TempLogin";
import useAuth from "../hooks/userAuth";
function Home() {
  const { userID } = useAuth();
  return (
    <motion.div className="flex flex-row h-screen">
      {userID ? <></> : <TempLogin />}
      <NavBar />
      <div className="flex flex-row w-full justify-between px-8 my-auto h-full">
        <div>
          <img src={HomeLogo} className="w-4/5 h-full mx-auto my-auto" alt="" />
        </div>
        <div className="w-2/5 my-auto pr-4">
          <h1 className="font-pop text-indigo-500 text-5xl">Write Your</h1>
          <h1 className="font-popxl -mt-7 text-indigo-500 text-6xl">
            FIRST BLOG
          </h1>
          <h1 className="font-pop text-gray-500">
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
            nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat
            volutpat. Ut wisi enim ad minim veniam, quis nostrud{" "}
          </h1>
          <Link to={"/Write"}>
            <div className="bg-indigo-400 cursor-pointer transition-all hover:bg-indigo-300 mt-6 px-6 py-2 rounded-3xl w-2/5 text-center text-white">
              Write
            </div>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default Home;
