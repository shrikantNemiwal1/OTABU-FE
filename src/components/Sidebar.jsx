import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import logoDull from "../assets/images/logo-dull.png";
import dashboard from "../assets/icons/dashboard.svg";
import client from "../assets/icons/client.svg";
import "./styles/sidebar.scss";
import Restricted from "./Restricted";

const Sidebar = () => {
  const { pathname } = useLocation();
  return (
    <section className="sidebar" id="style-4">
      <img src={logoDull} className="sidebar__logo" alt="" />
      <ul className="sidebar__links-list">
        <li className="sidebar__links-item">
          <NavLink
            className={
              pathname.slice(0, 10) === "/dashboard"
                ? "sidebar__link sidebar__link--active"
                : "sidebar__link"
            }
            to="/dashboard"
          >
            <img src={dashboard} alt="dashboard" />
            <div>Dashboard</div>
          </NavLink>
        </li>
        <Restricted to={"Admin Auditor"}>
          <li className="sidebar__links-item">
            <NavLink
              className={
                pathname === "/clients/9001"
                  ? "sidebar__link sidebar__link--active"
                  : "sidebar__link"
              }
              to="/clients/9001"
            >
              <img src={client} alt="client" />
              <div>ISO 9001 Clients</div>
            </NavLink>
          </li>
          <li className="sidebar__links-item">
            <NavLink
              className={
                pathname === "/clients/14001"
                  ? "sidebar__link sidebar__link--active"
                  : "sidebar__link"
              }
              to="/clients/14001"
            >
              <img src={client} alt="" />
              <div>ISO 14001 Clients</div>
            </NavLink>
          </li>
          <li className="sidebar__links-item">
            <NavLink
              className={
                pathname === "/clients/22000"
                  ? "sidebar__link sidebar__link--active"
                  : "sidebar__link"
              }
              to="/clients/22000"
            >
              <img src={client} alt="" />
              <div>ISO 22000 Clients</div>
            </NavLink>
          </li>
          <li className="sidebar__links-item">
            <NavLink
              className={
                pathname === "/clients/27001"
                  ? "sidebar__link sidebar__link--active"
                  : "sidebar__link"
              }
              to="/clients/27001"
            >
              <img src={client} alt="" />
              <div>ISO 27001 Clients</div>
            </NavLink>
          </li>
          <li className="sidebar__links-item">
            <NavLink
              className={
                pathname === "/clients/13485"
                  ? "sidebar__link sidebar__link--active"
                  : "sidebar__link"
              }
              to="/clients/13485"
            >
              <img src={client} alt="" />
              <div>ISO 13485 Clients</div>
            </NavLink>
          </li>
          <li className="sidebar__links-item">
            <NavLink
              className={
                pathname === "/clients/37001"
                  ? "sidebar__link sidebar__link--active"
                  : "sidebar__link"
              }
              to="/clients/37001"
            >
              <img src={client} alt="" />
              <div>ISO 37001 Clients</div>
            </NavLink>
          </li>
          <li className="sidebar__links-item">
            <NavLink
              className={
                pathname === "/clients/20000-1"
                  ? "sidebar__link sidebar__link--active"
                  : "sidebar__link"
              }
              to="/clients/20000-1"
            >
              <img src={client} alt="" />
              <div>ISO/IEC 20000-1 Clients</div>
            </NavLink>
          </li>
          <li className="sidebar__links-item">
            <NavLink
              className={
                pathname === "/clients/22301"
                  ? "sidebar__link sidebar__link--active"
                  : "sidebar__link"
              }
              to="/clients/22301"
            >
              <img src={client} alt="" />
              <div>ISO 22301 Clients</div>
            </NavLink>
          </li>
          <li className="sidebar__links-item">
            <NavLink
              className={
                pathname === "/clients/50001"
                  ? "sidebar__link sidebar__link--active"
                  : "sidebar__link"
              }
              to="/clients/50001"
            >
              <img src={client} alt="" />
              <div>ISO 50001 Clients</div>
            </NavLink>
          </li>
          <li className="sidebar__links-item">
            <NavLink
              className={
                pathname === "/clients/IMS"
                  ? "sidebar__link sidebar__link--active"
                  : "sidebar__link"
              }
              to="/clients/IMS"
            >
              <img src={client} alt="" />
              <div>IMS Clients</div>
            </NavLink>
          </li>
        </Restricted>
      </ul>
    </section>
  );
};

export default Sidebar;
