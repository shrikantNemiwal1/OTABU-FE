import { NavLink, useLocation } from "react-router-dom";
import logoDull from "../assets/images/logo-dull.png";
import dashboard from "../assets/icons/dashboard.svg";
import client from "../assets/icons/client.svg";
import active from "../assets/icons/active.svg";
import newIcon from "../assets/icons/new.svg";
import pending from "../assets/icons/pending.svg";
import completed from "../assets/icons/completed.svg";
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
              <img src={newIcon} alt="dashboard" />
              <div>New Certification</div>
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
              <img src={pending} alt="client" />
              <div>Pending Certifications</div>
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
              <img src={active} alt="" />
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
              <img src={completed} alt="" />
              <div>Completed Certifications</div>
            </NavLink>
          </li>
        </Restricted>
        <Restricted to={"Auditor"}>
          <li className="sidebar__links-item">
            <NavLink
              className={
                pathname === "/dashboard/assigned-active"
                  ? "sidebar__link sidebar__link--active"
                  : "sidebar__link"
              }
              to="/dashboard/assigned-active"
            >
              <img src={active} alt="client" />
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
              <img src={pending} alt="client" />
              <div>Pending Certifications</div>
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
              <img src={active} alt="" />
              <div>Active Certifications</div>
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
              <img src={completed} alt="" />
              <div>Completed Certifications</div>
            </NavLink>
          </li>
        </Restricted>
      </ul>
    </section>
  );
};

export default Sidebar;
