import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import SubNavbar from "../components/SubNavbar";
import Table from "../components/Table";
import "./styles/dashboard.scss";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <main>
        <Navbar />
        <SubNavbar />
        <Table/>
      </main>
    </div>
  );
};

export default Dashboard;
