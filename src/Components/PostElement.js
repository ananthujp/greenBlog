import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
const Author = ({ id }) => {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(null);
  useEffect(() => {
    getDoc(doc(db, "Profiles", id)).then((dc) => setAuth(dc.data()));
  }, []);

  return (
    <div
      onClick={() => navigate(`/Author/${id}`)}
      className="flex flex-row cursor-pointer p-1 rounded-md hover:bg-white dark:hover:bg-slate-900"
    >
      <img alt="" src={auth?.img} className="mr-2 h-4 w-4 rounded-full" />
      <h1 className="font-poplg text-xs my-auto dark:text-slate-200">
        {auth?.name}
      </h1>
    </div>
  );
};
function PostElement({ i, dc }) {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(null);
  useEffect(() => {
    getDoc(doc(db, "Profiles", dc.user)).then((dc) => setAuth(dc.data()));
  }, []);
  return (
    // <div
    //   key={`feed.2.${i}`}
    //   className={"flex flex-row items-center justify-between rounded-md "}
    // >
    //   <div className="flex flex-col rounded-l-lg flex-start bg-white dark:bg-slate-600 dark:border-slate-500 py-2 w-full ml-3 border border-slate-200 px-4 my-1">
    //     <div className="flex flex-row items-center mr-1">
    //       <Author key={`key.author${i}`} id={dc.user} />
    //     </div>

    //     <h1
    //       onClick={() => navigate(`/Posts/${dc.id}`)}
    //       className="font-popxl  text-xl mt-2 cursor-pointer dark:text-slate-100"
    //     >
    //       {dc.title}
    //     </h1>
    //     <h1
    //       onClick={() => navigate(`/Posts/${dc.id}`)}
    //       className="font-pop  text-md mb-2 text-gray-400 cursor-pointer dark:text-slate-300"
    //     >
    //       {dc?.txt + "..."}
    //     </h1>

    //     <div className="flex flex-row mt-1 font-popxs text-xs dark:text-slate-400">
    //       {dc.time}. 3 min read
    //     </div>
    //   </div>
    //   <img
    //     className="w-32 h-[94%] rounded-r-lg my-auto mr-2 object-cover"
    //     src={dc?.img}
    //     alt=""
    //   />
    // </div>
    <div
      key={`feed.2.${i}`}
      className="mx-4 md:mx-2 lg:w-[48%] md:w-[46.5%] w-full border border-slate-200 dark:border-slate-500 my-2 rounded-lg overflow-hidden flex flex-col"
    >
      <div className="h-44 shadow-inner overflow-hidden">
        <img src={dc?.img} alt="" className="object-cover h-44 w-full" />
      </div>
      <div className="flex flex-row px-2 py-3 bg-white dark:bg-slate-600">
        <img className="w-10 h-10 rounded-full" alt="" src={auth?.img} />
        <div className="flex flex-col ml-2">
          <h1
            onClick={() => navigate(`/Author/${dc.user}`)}
            className="font-popxl mt-1 cursor-pointer text-md my-auto dark:text-slate-100"
          >
            {auth?.name}
          </h1>
          <h1
            onClick={() => navigate(`/Author/${dc.user}`)}
            className="font-pop cursor-pointer text-xs my-auto dark:text-slate-200"
          >
            PhD Student
          </h1>
          <h1
            onClick={() => navigate(`/Posts/${dc.id}`)}
            className="font-poplg cursor-pointer text-xl mt-4 mb-auto dark:text-slate-100"
          >
            {dc.title}
          </h1>
          <h1
            onClick={() => navigate(`/Posts/${dc.id}`)}
            className="font-pop cursor-pointer text-xs text-slate-600 dark:text-slate-100"
          >
            {dc?.txt + "..."}
          </h1>
        </div>
      </div>
    </div>
  );
}

export default PostElement;
