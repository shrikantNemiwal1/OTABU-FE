import React, { useContext, useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import "./styles/clients.scss";
import { AuthContext } from "../context/AuthContext";
import { Outlet, useNavigate } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;

const Clients = () => {
  const { state } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (state?.isAuthenticated === false) {
      return navigate("/login");
    }
  }, [state]);

  return (
    <div className="clients-container">
      <Sidebar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Clients;
