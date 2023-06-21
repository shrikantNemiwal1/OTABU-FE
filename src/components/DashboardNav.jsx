import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import activeAdmin from "../assets/icons/active-admin.svg";
import activeAuditor from "../assets/icons/active-auditor.svg";
import activeclient from "../assets/icons/active-client.svg";
import completedClient from "../assets/icons/completed-client.svg";
import arrow from "../assets/icons/arrow-down.svg";

const DashboardNav = () => {
  const { pathname } = useLocation();
  return (
    <nav className="dashboard-nav">
      <NavLink to="active-admins" className="dashboard-nav__card">
        <div className="dashboard-nav__card-head">
          <img src={activeAdmin} alt="active admin" />
          <div className="dashboard-nav__card-detail">
            <span>11</span>
            <img
              className={
                pathname === "/dashboard/active-admins"
                  ? "rotate-180deg"
                  : "arrow-icon"
              }
              src={arrow}
              alt="arrow"
            />
          </div>
        </div>
        <p className="dashboard-nav__card-text">Active Admins</p>
      </NavLink>
      <NavLink to="active-auditors" className="dashboard-nav__card">
        <div className="dashboard-nav__card-head">
          <img src={activeAuditor} alt="active admin" />
          <div className="dashboard-nav__card-detail">
            <span>11</span>
            <img
              className={
                pathname === "/dashboard/active-auditors"
                  ? "rotate-180deg"
                  : "arrow-icon"
              }
              src={arrow}
              alt="arrow"
            />
          </div>
        </div>
        <p className="dashboard-nav__card-text">Active Auditors</p>
      </NavLink>
      <NavLink to="active-clients" className="dashboard-nav__card">
        <div className="dashboard-nav__card-head">
          <img src={activeclient} alt="active admin" />
          <div className="dashboard-nav__card-detail">
            <span>11</span>
            <img
              className={
                pathname === "/dashboard/active-clients"
                  ? "rotate-180deg"
                  : "arrow-icon"
              }
              src={arrow}
              alt="arrow"
            />
          </div>
        </div>
        <p className="dashboard-nav__card-text">Active Clients</p>
      </NavLink>
      <NavLink to="completed-clients" className="dashboard-nav__card">
        <div className="dashboard-nav__card-head">
          <img src={completedClient} alt="active admin" />
          <div className="dashboard-nav__card-detail">
            <span>11</span>
            <img
              className={
                pathname === "/dashboard/completed-clients"
                  ? "rotate-180deg"
                  : "arrow-icon"
              }
              src={arrow}
              alt="arrow"
            />
          </div>
        </div>
        <p className="dashboard-nav__card-text">Completed Clients</p>
      </NavLink>
    </nav>
  );
};

export default DashboardNav;
