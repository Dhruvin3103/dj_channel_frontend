import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';
import { useCookies } from 'react-cookie';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [cookies, setCookie, removeCookie] = useCookies(['access', 'refresh']);

    useEffect(() => {
        console.log(cookies)
        const savedAccess = cookies.access;
        const savedRefresh = cookies.refresh;

        if (savedAccess && savedRefresh) {
            setAuth({ access: savedAccess, refresh: savedRefresh });
        }
    }, [cookies.access,cookies.refresh]);

    const saveTokensToCookies = (access, refresh) => {
        setCookie('access', access, { path: '/' });
        setCookie('refresh', refresh, { path: '/' });
        console.log(cookies)
    };

    const clearTokensFromCookies = () => {
        console.log("cleare")
        removeCookie('access');
        removeCookie('refresh');
    };

    return (
        <AuthContext.Provider value={{ auth, setAuth: saveTokensToCookies, clearAuth: clearTokensFromCookies }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
