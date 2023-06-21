import React from "react";
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import SubNavbar from "../components/SubNavbar";
import DashboardNav from "./../components/DashboardNav";
import Table from "../components/Table";
import "./styles/dashboard.scss";

const Dashboard = () => {
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
