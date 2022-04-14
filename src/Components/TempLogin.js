import { signInWithPopup } from "firebase/auth";
import {
  addDoc,
  collection,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { db, provider, auth } from "../firebase";
import CryptoJS from "crypto-js";
import useAuth from "../hooks/userAuth";
import { Spin } from "react-cssfx-loading/lib";
import { XIcon } from "@heroicons/react/outline";
import logo from "../images/login_logo.svg";
function TempLogin({ show }) {
  const { setUserID, userID, setLogin } = useAuth();
  const [usrCheck, setUsrCheck] = useState(false);
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(null);
  const [load, setLoad] = useState(false);
  const [bio, setBio] = useState(null);
  const [screen, Switch] = useState(false); ///ivideyaanu ivideyaanu
  const [username, setUserName] = useState(null);
  const [pass, setPass] = useState(null);
  const [email, setEmail] = useState(null);
  const UserRef = collection(db, "Profiles");
  const checkUser = (value) => {
    // getDocs(query(UserRef, where("username", "!=", value))).then((doc) =>
    //   doc.docs.length === 2 ? setUsrCheck(false) : setUsrCheck(true)
    // );
    setUsrCheck(false);
    getDocs(
      query(collection(db, "Profiles"), where("username", "==", value))
    ).then((doc) => doc.docs.map((dc) => setUsrCheck(true)));
  };
  const createUser = () => {
    setLoad(true);
    user &&
      !email &&
      !usrCheck &&
      pass &&
      addDoc(UserRef, {
        name: user.name,
        username: username,
        email: user.email,
        password: pass.toString(),
        img: user.img,
        Bio: bio,
      });
    Switch(false);
    setLoad(false);
  };
  const checkEmail = (value) => {
    setEmail(false);
    getDocs(
      query(collection(db, "Profiles"), where("email", "==", value))
    ).then((doc) => doc.docs.map((dc) => setEmail(true)));
  };
  const handleLogin = () => {
    setLoad(true);
    setStatus("");
    onSnapshot(query(UserRef, where("username", "==", username)), (dc) =>
      dc.docs.map((dc) =>
        CryptoJS.AES.decrypt(dc.data().password.toString(), "ae!@qws").toString(
          CryptoJS.enc.Utf8
        ) ===
        CryptoJS.AES.decrypt(pass.toString(), "ae!@qws").toString(
          CryptoJS.enc.Utf8
        )
          ? setUserID({
              id: dc.id,
              back: dc.id,
              name: dc.data().name,
              Bio: dc.data().Bio,
              email: dc.data().email,
              username: dc.data().username,
              img: dc.data().img,
            })
          : setStatus("Login failed : Incorrect password")
      )
    );

    setTimeout(() => setLoad(false), 3000);
    setTimeout(
      () =>
        status !== "Login failed : Incorrect password" &&
        setStatus("Login failed"),
      3000
    );
  };
  useEffect(() => {
    user ? checkEmail(user.email) : <></>;
  }, [user]);
  useEffect(() => {
    userID && setLogin(false);
  }, [userID]);

  return (
    <div className="absolute bg-white/60  z-50 w-screen h-screen flex items-center justify-center ">
      <div className="flex flex-col md:flex-row px-2 py-4 md:w-3/5 w-4/5 md:h-auto rounded-xl  shadow-lg bg-white/40 backdrop-blur-lg border-white border ">
        <XIcon
          onClick={() => setLogin(false)}
          className="w-6 p-1 absolute top-2 right-2 hover:bg-indigo-200 rounded-full"
        />
        <img src={logo} alt="logo" className="w-1/2 mx-auto" />
        <div className="flex flex-col items-center justify-center">
          {screen ? (
            <>
              <div className="flex flex-row justify-between items-center">
                <div></div>
                <div className="flex flex-row items-center">
                  <h1 className="font-poplg text-center text-indigo-600 text-xl">
                    Sign Up
                  </h1>
                  <h1
                    onClick={() => Switch(false)}
                    className="cursor-pointer font-poplg text-center text-gray-200 text-xl"
                  >
                    &nbsp;/ Sign In
                  </h1>
                </div>
              </div>

              <div className="grid grid-cols-2 px-4 gap-2 grid-flow-row items-center ">
                <h1
                  className={
                    "font-pop text-gray-600" + (usrCheck && " text-red-600")
                  }
                >
                  {!usrCheck ? "Username" : "Username taken already"}
                </h1>
                <input
                  type="text"
                  onChange={(e) => {
                    setUserName(e.target.value);
                    setUsrCheck(false);
                  }}
                  onBlur={(e) => checkUser(e.target.value)}
                  className={
                    " border-white border rounded-lg w-full bg-indigo-50 outline-none p-1 " +
                    (usrCheck && " outline outline-red-600")
                  }
                />
                <h1 className="font-pop text-gray-600">Password</h1>
                <input
                  onChange={(e) =>
                    setPass(CryptoJS.AES.encrypt(e.target.value, "ae!@qws"))
                  }
                  type="password"
                  className=" border-white border rounded-lg bg-indigo-50 outline-none p-1"
                />
                <h1 className="font-pop cursor-pointer text-gray-600 mr-12">
                  Verify
                </h1>
                <div
                  onClick={() =>
                    signInWithPopup(auth, provider).then((dc) =>
                      setUser({
                        name: dc.user.displayName,
                        email: dc.user.email,
                        img: dc.user.photoURL,
                      })
                    )
                  }
                  className="flex px-2  flex-row items-center justify-center bg-gradient-to-b from-indigo-100 to-indigo-300 hover:to-indigo-200 rounded-md"
                >
                  {user && !email ? (
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Flat_tick_icon.svg/512px-Flat_tick_icon.svg.png?20170316053531"
                      className="w-4 h-4"
                      alt=""
                    />
                  ) : user ? (
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Cross_red_circle.svg/512px-Cross_red_circle.svg.png"
                      className="w-4 h-4"
                      alt=""
                    />
                  ) : (
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2048px-Google_%22G%22_Logo.svg.png"
                      className="w-4 h-4"
                      alt=""
                    />
                  )}
                  <h1 className="font-pop text-white ml-1 pt-1">Verify</h1>
                </div>
                {user && (
                  <>
                    <h1 className="font-pop text-gray-300">Name</h1>
                    <input
                      type="text"
                      value={user?.name}
                      disabled
                      className="  border rounded-lg font-pop px-2 text-sm text-gray-400 bg-indigo-50 outline-none p-1"
                    />
                    <h1
                      className={
                        "font-pop text-gray-300" +
                        (user && email && " text-red-600")
                      }
                    >
                      {user && email ? "Email already used" : "Email"}
                    </h1>
                    <input
                      type="text"
                      value={user?.email}
                      disabled
                      className={
                        "  border rounded-lg font-pop px-2 text-sm text-gray-400 bg-indigo-50 outline-none p-1" +
                        (user && email && " outline outline-red-600")
                      }
                    />
                    <h1 className="font-pop text-gray-600">Bio (optional)</h1>
                    <textarea
                      onChange={(e) => setBio(e.target.value)}
                      className="  border-white border rounded-lg bg-indigo-50 h-24 outline-none p-1"
                    />
                  </>
                )}
              </div>
              <button
                onClick={() => createUser()}
                type="button"
                className="flex flex-row justify-around items-center mx-auto mt-6 w-32 text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-full text-sm px-5 py-1.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
              >
                {!load ? (
                  "Sign UP"
                ) : (
                  <>
                    <Spin
                      color="#ffffff"
                      width="15px"
                      height="15px"
                      duration="2s"
                    />
                    Loading
                  </>
                )}
              </button>
            </>
          ) : (
            <div className="h-auto flex flex-col my-auto justify-around">
              <div className="flex flex-row justify-center">
                <h1
                  onClick={() => Switch(true)}
                  className="cursor-pointer font-poplg text-center  text-gray-200  text-xl"
                >
                  Sign Up
                </h1>
                <h1 className="font-poplg text-center text-indigo-600 text-xl">
                  &nbsp;/ Sign In
                </h1>
              </div>
              <div className="flex flex-col">
                <h1 className="font-pop text-red-500 text-xs text-center">
                  {status}
                </h1>
              </div>
              <div className="grid grid-cols-2 px-4 gap-2 grid-flow-row items-center ">
                <h1 className={"font-pop text-gray-600"}>Username</h1>
                <input
                  type="text"
                  onChange={(e) => setUserName(e.target.value)}
                  className={
                    "  border-white border rounded-lg w-full bg-indigo-50 outline-none p-1 "
                  }
                />
                <h1 className={"font-pop text-gray-600"}>Password</h1>
                <input
                  type="password"
                  onChange={(e) =>
                    setPass(CryptoJS.AES.encrypt(e.target.value, "ae!@qws"))
                  }
                  className={
                    " border-white border rounded-lg w-full bg-indigo-50 outline-none p-1 "
                  }
                />
              </div>
              <button
                onClick={() => handleLogin()}
                type="button"
                className="flex flex-row justify-around items-center mx-auto mt-6 w-32 text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-full text-sm px-5 py-1.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
              >
                {!load ? (
                  "Sign In"
                ) : (
                  <>
                    <Spin
                      color="#ffffff"
                      width="15px"
                      height="15px"
                      duration="2s"
                    />
                    Loading
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TempLogin;
