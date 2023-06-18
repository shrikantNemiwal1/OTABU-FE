import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import SubNavbar from "../components/SubNavbar";
import Table from "../components/Table";
import "./styles/clients.scss";

const Clients = () => {
  return (
    <div className="clients-container">
      <Sidebar />
      <main>
        <Navbar />
        <SubNavbar />
        <Table />
      </main>
    </div>
  );
};

export default Clients;
