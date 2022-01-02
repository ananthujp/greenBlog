import { motion } from "framer-motion"
import HomeLogo from './images/homeLogo.svg'
import NavBar from "./NavBar"
function Home() {
   
    return (
        <motion.div className="flex flex-col h-screen">
            <NavBar/>
            <div className="flex flex-row w-full justify-between px-8 my-auto h-full">
                <div>
                    <img src={HomeLogo} className="w-4/5 h-full mx-auto my-auto"  alt="" />
                </div>
                <div className="w-2/5 my-auto pr-4">
                    <h1 className="font-pop text-indigo-500 text-5xl">Write Your</h1>
                    <h1 className="font-popxl -mt-7 text-indigo-500 text-6xl">FIRST BLOG</h1>
                    <h1 className="font-pop text-gray-500">Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud </h1>
                    <div className="bg-indigo-400 mt-6 px-6 py-2 rounded-3xl w-2/5 text-center text-white">Upload</div>
                </div>

            </div>
        </motion.div>
    )
}

export default Home
