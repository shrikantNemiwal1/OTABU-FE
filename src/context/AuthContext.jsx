// main file
import React, { createContext, useReducer, useState } from "react";
import { authReducer } from "./authReducer";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;

export function API(method, endpoint, payload, token) {
  const encrypted = "" || token;
  return axios({
    method: method.toLowerCase(),
    url: `${BASE_URL}/${
      endpoint.startsWith("/") ? endpoint.slice(1) : endpoint
    }`,
    data: payload,
  });
}

let refToken = "";

const name = localStorage.getItem("otabu-audit-name")
  ? localStorage.getItem("otabu-audit-name")
  : "";
const mobile = localStorage.getItem("otabu-audit-mobile")
  ? localStorage.getItem("otabu-audit-mobile")
  : "";
const token = localStorage.getItem("token")
  ? localStorage.getItem("token")
  : "";
const refreshToken = localStorage.getItem("refresh-token")
  ? localStorage.getItem("refresh-token")
  : "";
const email = localStorage.getItem("otabu-audit-email")
  ? localStorage.getItem("otabu-audit-email")
  : "";
const role = localStorage.getItem("otabu-audit-role")
  ? localStorage.getItem("otabu-audit-role")
  : "";
const tokenExpTime = localStorage.getItem("otabu-audit-exp")
  ? localStorage.getItem("otabu-audit-exp")
  : "";

const initialAuthState = {
  isAuthenticated: !!token && !!email,
  token,
  refreshToken,
  email,
  role,
  name,
  mobile,
  tokenExpTime,
};

const AuthContext = createContext({
  state: initialAuthState,
  dispatch: () => {},
});

const getTokenExpTime = () => {
  const currentDateTime = new Date();
  const oneHourLater = new Date(currentDateTime.getTime() + 60 * 60 * 1000);
  return oneHourLater;
};

const LOGIN_SUCCESS = "LOGIN_SUCCESS";
const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (values) => {
    setIsLoading(true);
    try {
      const res = await API("post", "/api/user/login", {
        email: values.email,
        password: values.password,
      });
      console.log(res?.data);
      dispatch({
        type: LOGIN_SUCCESS,
        payload: {
          ...res?.data,
          email: values.email,
          tokenExpTime: getTokenExpTime(),
        },
      });
      return res;
    } catch (err) {
      console.log(err);
      return err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    console.log(refreshToken);
    try {
      const res = await API("post", "/api/user/logout", {
        refresh_token: state?.refreshToken,
      });
      dispatch({ type: LOGOUT_SUCCESS });
      return res;
    } catch (err) {
      return err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ state, dispatch, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
