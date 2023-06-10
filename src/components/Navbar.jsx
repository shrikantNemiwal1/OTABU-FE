import React from "react";
import { NavLink } from "react-router-dom";
import search from "../assets/icons/search.svg";
import tasks from "../assets/icons/tasks.svg";
import mail from "../assets/icons/mail2.svg";
import bell from "../assets/icons/bell.svg";
import "./styles/navbar.scss";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar__items-left">
        <p>Dashboard</p>
        <div className="navbar__search">
          <input id="search" type="text" placeholder="search" />
          <label htmlFor="search">
            <img src={search} alt="search" />
          </label>
        </div>
      </div>
      <div className="navbar__items-right">
        <ul>
          <li>
            <NavLink>
              <img src={tasks} alt="" />
            </NavLink>
          </li>
          <li>
            <NavLink>
              <img src={mail} alt="" />
            </NavLink>
          </li>
          <li>
            <NavLink>
              <img src={bell} alt="" />
            </NavLink>
          </li>
        </ul>
        <div className="navbar__avatar">
          <img src="" alt="" />
          <p>User name</p>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
