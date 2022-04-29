import axios from "axios";
import { Color } from "party-js";
import CryptoJS from "crypto-js";
import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
} from "react";
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  //const [user,setUser]=useState(null);
  const [user, setUser] = useState("null");
  const [dark, setDispModes] = useState(
    localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
      ? true
      : false
  );
  const [role, setRole] = useState("user");
  const [ColorID, setColorID] = useState(
    localStorage.getItem("Ctheme")
      ? JSON.parse(localStorage.getItem("Ctheme"))
      : 0
  );
  const [author, setPostAuthor] = useState("user");
  const [login, setLogin] = useState(false);
  const [userID, setUserID] = useState(
    localStorage.getItem("user")
      ? JSON.parse(
          CryptoJS.AES.decrypt(
            localStorage.getItem("user"),
            process.env.REACT_APP_PASS_KEY
          ).toString(CryptoJS.enc.Utf8)
        )
      : null
  );
  useEffect(() => {
    authUser();
  }, []);
  useEffect(() => {
    localStorage.setItem("Ctheme", JSON.stringify(ColorID ? ColorID : 0));
  }, [ColorID]);
  const setDispMode = (value) => {
    setDispModes(value);
    localStorage.setItem("theme", value ? "dark" : "light");
  };

  useEffect(() => {
    userID
      ? localStorage.setItem(
          "user",
          CryptoJS.AES.encrypt(
            JSON.stringify(userID),
            process.env.REACT_APP_PASS_KEY
          )
        )
      : localStorage.removeItem("user");

    userID &&
      (userID.email === "ananthujp@gmail.com" ||
        userID.email === "hrushti.n@iitgn.ac.in" ||
        userID.email === "devvrat.joshi@iitgn.ac.in" ||
        userID.email === "dhanesh.bhutada@iitgn.ac.in") &&
      setRole("admin");
  }, [userID]);
  const switChId = (n) => {
    switch (parseInt(n)) {
      case 0:
        setUserID({ ...userID, id: userID.back });
        break;
      case 1:
        setUserID({ ...userID, id: "HyAS9bQrGoNbH6yekzzK" });
        break;
      default:
    }
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem("key");
  };
  const authUser = () => {
    localStorage.getItem("key") ? (
      axios({
        method: "post",
        url: "https://greenclubiitgn.pythonanywhere.com/checkLoggedIn",
        data: localStorage.getItem("key"),
      }).then((response) => {
        if (response.status === 200) {
          if (response.data["1"] !== false) {
            axios({
              method: "post",
              url: "https://greenclubiitgn.pythonanywhere.com/getUserName",
              data: localStorage.getItem("key"),
            }).then((response) => {
              setUser({ email: response.data[1] });
            });
          }
        }
      })
    ) : (
      <></>
    );
  };
  const memoedValue = useMemo(
    () => ({
      user,
      authUser,
      logout,
      userID,
      setUserID,
      role,
      setRole,
      switChId,
      setLogin,
      login,
      author,
      setPostAuthor,
      ColorID,
      setColorID,
      dark,
      setDispMode,
    }),
    [user, dark, userID, role, login, author, ColorID]
  );
  return (
    <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}
