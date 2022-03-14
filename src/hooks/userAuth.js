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
  const [userID, setUserID] = useState();
  useEffect(() => {
    authUser();
  }, []);
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
