import React, { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import SubNavbar from "../components/SubNavbar";
import DashboardNav from "./../components/DashboardNav";
import Table from "../components/Table";
import "./styles/dashboard.scss";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const { state } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (state?.isAuthenticated === false) {
      return navigate("/login");
    }
  }, [state]);

  return (
    <div className="dashboard-container clients-container">
      <Sidebar />
      <main>
        <Navbar />
        <SubNavbar />
        <DashboardNav />
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
