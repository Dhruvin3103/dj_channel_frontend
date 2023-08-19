import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { useCookies } from "react-cookie";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [cookies, setCookie, removeCookie] = useCookies(["access", "refresh"]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    console.log(cookies);
    const savedAccess = cookies.access;
    const savedRefresh = cookies.refresh;

    if (savedAccess && savedRefresh) {
      setAuth({ access: savedAccess, refresh: savedRefresh });
    }
  }, [cookies.access, cookies.refresh]);

  const saveTokensToCookies = (access, refresh) => {
    setCookie("access", access, { path: "/" });
    setCookie("refresh", refresh, { path: "/" });
    console.log(cookies);
  };

  const clearTokensFromCookies = () => {
    console.log("cleare");
    removeCookie("access");
    removeCookie("refresh");
  };

  useEffect(() => {
    const getUserData = async () => {
      console.log(auth.access);
      try {
        console.log(auth.access);
        const response = await api.get("/auth/users/me/", {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${auth.access}`,
          },
        });
        setUserData(response.data);
        setLoading(false); // Mark loading as done
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    if (auth.access) {
      getUserData();
    }
  }, [auth.access]);

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth: saveTokensToCookies,
        clearAuth: clearTokensFromCookies,
        userData,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
