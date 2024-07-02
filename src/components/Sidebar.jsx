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
        <Restricted to={"Client"}>
          <li className="sidebar__links-item">
            <NavLink
              className={
                pathname === "/dashboard/new-application"
                  ? "sidebar__link sidebar__link--active"
                  : "sidebar__link"
              }
              to="/dashboard/new-application"
            >
              <img src={dashboard} alt="dashboard" />
              <div>Request New Application</div>
            </NavLink>
          </li>
          <li className="sidebar__links-item">
            <NavLink
              className={
                pathname === "/dashboard/pending-applications"
                  ? "sidebar__link sidebar__link--active"
                  : "sidebar__link"
              }
              to="/dashboard/pending-applications"
            >
              <img src={client} alt="client" />
              <div>Pending Applications</div>
            </NavLink>
          </li>
          <li className="sidebar__links-item">
            <NavLink
              className={
                pathname === "/dashboard/active-certifications"
                  ? "sidebar__link sidebar__link--active"
                  : "sidebar__link"
              }
              to="/dashboard/active-certifications"
            >
              <img src={client} alt="" />
              <div>Active Certifications</div>
            </NavLink>
          </li>
          <li className="sidebar__links-item">
            <NavLink
              className={
                pathname === "/dashboard/completed-certifications"
                  ? "sidebar__link sidebar__link--active"
                  : "sidebar__link"
              }
              to="/dashboard/completed-certifications"
            >
              <img src={client} alt="" />
              <div>Completed Certifications</div>
            </NavLink>
          </li>
        </Restricted>
        <Restricted to={"Auditor"}>
          {/* <li className="sidebar__links-item">
            <NavLink
              className={
                pathname === "/dashboard/assigned-pending"
                  ? "sidebar__link sidebar__link--active"
                  : "sidebar__link"
              }
              to="/dashboard/assigned-pending"
            >
              <img src={dashboard} alt="dashboard" />
              <div>Assigned Pending Applications</div>
            </NavLink>
          </li> */}
          <li className="sidebar__links-item">
            <NavLink
              className={
                pathname === "/dashboard/assigned-active"
                  ? "sidebar__link sidebar__link--active"
                  : "sidebar__link"
              }
              to="/dashboard/assigned-active"
            >
              <img src={client} alt="client" />
              <div>Assigned Active applications</div>
            </NavLink>
          </li>
        </Restricted>
        <Restricted to={"Admin Auditor"}>
          <li className="sidebar__links-item">
            <NavLink
              className={
                pathname === "/dashboard/pending-clients"
                  ? "sidebar__link sidebar__link--active"
                  : "sidebar__link"
              }
              to="/dashboard/pending-clients"
            >
              <img src={client} alt="client" />
              <div>Pending Clients</div>
            </NavLink>
          </li>
          <li className="sidebar__links-item">
            <NavLink
              className={
                pathname === "/dashboard/active-auditors"
                  ? "sidebar__link sidebar__link--active"
                  : "sidebar__link"
              }
              to="/dashboard/active-auditors"
            >
              <img src={client} alt="" />
              <div>Active Auditors</div>
            </NavLink>
          </li>
          <li className="sidebar__links-item">
            <NavLink
              className={
                pathname === "/dashboard/active-clients"
                  ? "sidebar__link sidebar__link--active"
                  : "sidebar__link"
              }
              to="/dashboard/active-clients"
            >
              <img src={client} alt="" />
              <div>Active Clients</div>
            </NavLink>
          </li>
          <li className="sidebar__links-item">
            <NavLink
              className={
                pathname === "/dashboard/completed-clients"
                  ? "sidebar__link sidebar__link--active"
                  : "sidebar__link"
              }
              to="/dashboard/completed-clients"
            >
              <img src={client} alt="" />
              <div>Completed Clients</div>
            </NavLink>
          </li>
        </Restricted>
      </ul>
    </section>
  );
};

export default Sidebar;
