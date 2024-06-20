import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Table from "../components/Table";
import "./styles/clients.scss";

const Clients = () => {
  return (
    <div className="clients-container">
      <Sidebar />
      <main>
        <Navbar />
        {/* <Table /> */}
      </main>
    </div>
  );
};

export default Clients;
