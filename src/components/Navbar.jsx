import React, { useContext } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import search from "../assets/icons/search.svg";
import bell from "../assets/icons/bell.svg";
import setting from "../assets/icons/setting.svg";
import logout from "../assets/icons/logout.svg";
import "./styles/navbar.scss";
const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;

const Navbar = () => {
  const { state } = useContext(AuthContext);
  const navigate = useNavigate();
  console.log(state.token);
  const handleLogout = () => {
    console.log("logout");
    axios
      .post(BASE_URL + "/api/user/logout", {
        refresh_token: state.refreshToken,
      })
      .then((response) => {
        console.log(response);
        state.role === "Client"
          ? navigate("/login/client")
          : navigate("/login/auditor");
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
            <button onClick={handleLogout} className="logout-btn">
              <img src={logout} alt="logout" />
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
