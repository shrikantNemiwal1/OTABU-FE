import React, { useContext, useEffect } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import search from "../assets/icons/search.svg";
import bell from "../assets/icons/bell.svg";
import profile from "../assets/images/default-profile.jpg";
import logoutIcon from "../assets/icons/logout.svg";
import "./styles/navbar.scss";
const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;

const Navbar = ({ title }) => {
  const { state, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = async () => {
    console.log("logout");
    await logout();
    navigate("/", { replace: true });
  };

  useEffect(() => {
    if (state?.isAuthenticated === false)
      return navigate("/", { replace: true });
  }, [state]);

  return (
    <nav className="navbar">
      <div className="navbar__items-left">
        <p>{title ? title : "Dashboard"}</p>
        <div className="navbar__search">
          <input id="search" type="text" placeholder="search" />
          <label htmlFor="search">
            <img src={search} alt="search" />
          </label>
        </div>
      </div>
      <div className="navbar__items-right">
        <div className="navbar__avatar">
          <img src={profile} alt="avatar" />
          <div>
            <p>{state?.name}</p>
            <span>{state?.role}</span>
          </div>
        </div>
        <ul>
          <li>
            <NavLink to="/notifications">
              <img src={bell} alt="bell" />
            </NavLink>
          </li>
          <li>
            <button onClick={handleLogout} className="logout-btn">
              <img src={logoutIcon} alt="logout" />
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
