import React from "react";
import { NavLink } from "react-router-dom";
import logoDull from "../assets/images/logo-dull.png";
import dashboard from "../assets/icons/dashboard.svg";
import client from "../assets/icons/client.svg";
import setting from "../assets/icons/setting.svg";
import "./styles/sidebar.scss";

const Sidebar = () => {
  return (
    <section className="sidebar" id="style-4">
      <img src={logoDull} className="sidebar__logo" alt="" />
      <ul className="sidebar__links-list">
        <li className="sidebar__links-item">
          <NavLink className="sidebar__link" to="/login">
            <img src={dashboard} alt="" />
            <div>Dashboard</div>
          </NavLink>
        </li>
        <li className="sidebar__links-item">
          <NavLink className="sidebar__link" to="/login">
            <img src={client} alt="" />
            <div>ISO 9001 Clients</div>
          </NavLink>
        </li>
        <li className="sidebar__links-item">
          <NavLink className="sidebar__link" to="/login">
            <img src={client} alt="" />
            <div>ISO 14001 Clients</div>
          </NavLink>
        </li>
        <li className="sidebar__links-item">
          <NavLink className="sidebar__link" to="/login">
            <img src={client} alt="" />
            <div>ISO 22000 Clients</div>
          </NavLink>
        </li>
        <li className="sidebar__links-item">
          <NavLink className="sidebar__link" to="/login">
            <img src={client} alt="" />
            <div>ISO 27001 Clients</div>
          </NavLink>
        </li>
        <li className="sidebar__links-item">
          <NavLink className="sidebar__link" to="/login">
            <img src={client} alt="" />
            <div>ISO 13485 Clients</div>
          </NavLink>
        </li>
        <li className="sidebar__links-item">
          <NavLink className="sidebar__link" to="/login">
            <img src={client} alt="" />
            <div>ISO 37001 Clients</div>
          </NavLink>
        </li>
        <li className="sidebar__links-item">
          <NavLink className="sidebar__link" to="/login">
            <img src={client} alt="" />
            <div>ISO/IEC 20000-1 Clients</div>
          </NavLink>
        </li>
        <li className="sidebar__links-item">
          <NavLink className="sidebar__link" to="/login">
            <img src={client} alt="" />
            <div>ISO 22301 Clients</div>
          </NavLink>
        </li>
        <li className="sidebar__links-item">
          <NavLink className="sidebar__link" to="/login">
            <img src={client} alt="" />
            <div>ISO 50001 Clients</div>
          </NavLink>
        </li>
        <li className="sidebar__links-item">
          <NavLink className="sidebar__link" to="/login">
            <img src={client} alt="" />
            <div>IMS Clients</div>
          </NavLink>
        </li>
        <li className="sidebar__links-item">
          <NavLink className="sidebar__link" to="/login">
            <img src={setting} alt="" />
            <div>Setting</div>
          </NavLink>
        </li>
      </ul>
    </section>
  );
};

export default Sidebar;
