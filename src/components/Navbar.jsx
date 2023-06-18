import React from "react";
import { NavLink } from "react-router-dom";
import search from "../assets/icons/search.svg";
import bell from "../assets/icons/bell.svg";
import setting from "../assets/icons/setting.svg";
import logout from "../assets/icons/logout.svg";
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
              <img src={bell} alt="bell" />
            </NavLink>
          </li>
        </ul>
        <div className="navbar__avatar">
          <img src="" alt="avatar" />
          <p>User name</p>
        </div>
        <ul>
          <li>
            <NavLink>
              <img src={setting} alt="setting" />
            </NavLink>
          </li>
          <li>
            <NavLink>
              <img src={logout} alt="logout" />
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
