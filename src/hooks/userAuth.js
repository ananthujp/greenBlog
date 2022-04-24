import axios from "axios";
import { Color } from "party-js";
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
  const [dark, setDispMode] = useState(
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
      ? JSON.parse(localStorage.getItem("user"))
      : null
  );
  useEffect(() => {
    authUser();
  }, []);
  useEffect(() => {
    localStorage.setItem("Ctheme", JSON.stringify(ColorID ? ColorID : 0));
  }, [ColorID]);
  useEffect(() => {
    localStorage.setItem(
      "theme",

      dark
        ? "dark"
        : window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
    );
  }, [dark]);
  useEffect(() => {
    userID
      ? localStorage.setItem("user", JSON.stringify(userID))
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
