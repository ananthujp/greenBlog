import axios from "axios";
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
  const [role, setRole] = useState("user");
  const [userID, setUserID] = useState(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null
  );
  useEffect(() => {
    authUser();
  }, []);

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
    }),
    [user, userID, role]
  );
  return (
    <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}
