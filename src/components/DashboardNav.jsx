import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import activeAdmin from "../assets/icons/active-admin.svg";
import activeAuditor from "../assets/icons/active-auditor.svg";
import activeclient from "../assets/icons/active-client.svg";
import completedClient from "../assets/icons/completed-client.svg";
import profile from "../assets/icons/profile.svg";
import applicationForm from "../assets/icons/application-form.svg";
import arrow from "../assets/icons/arrow-down.svg";
import Restricted from "./Restricted";

const DashboardNav = () => {
  const { pathname } = useLocation();
  return (
    <nav className="dashboard-nav">
      <Restricted to={"Admin Auditor"}>
        <NavLink to="pending-clients" className="dashboard-nav__card">
          <div className="dashboard-nav__card-head">
            <img src={activeAdmin} alt="active admin" />
            <div className="dashboard-nav__card-detail">
              <span>11</span>
              <img
                className={
                  pathname === "/dashboard/pending-clients"
                    ? "rotate-180deg"
                    : "arrow-icon"
                }
                src={arrow}
                alt="arrow"
              />
            </div>
          </div>
          <p className="dashboard-nav__card-text">Pending Clients</p>
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
      </Restricted>
      <Restricted to="Client">
        <NavLink to="applied-certifications" className="dashboard-nav__card">
          <div className="dashboard-nav__card-head">
            <img src={applicationForm} alt="active admin" />
            <div className="dashboard-nav__card-detail">
              <span>11</span>
              <img
                className={
                  pathname === "/dashboard/applied-certifications"
                    ? "rotate-180deg"
                    : "arrow-icon"
                }
                src={arrow}
                alt="arrow"
              />
            </div>
          </div>
          <p className="dashboard-nav__card-text">Applied Certifications</p>
        </NavLink>
        <NavLink to="active-certifications" className="dashboard-nav__card">
          <div className="dashboard-nav__card-head">
            <img src={applicationForm} alt="active certi" />
            <div className="dashboard-nav__card-detail">
              <span>11</span>
              <img
                className={
                  pathname === "/dashboard/active-certifications"
                    ? "rotate-180deg"
                    : "arrow-icon"
                }
                src={arrow}
                alt="arrow"
              />
            </div>
          </div>
          <p className="dashboard-nav__card-text">Active Certifications</p>
        </NavLink>
        <NavLink to="completed-certifications" className="dashboard-nav__card">
          <div className="dashboard-nav__card-head">
            <img src={completedClient} alt="active admin" />
            <div className="dashboard-nav__card-detail">
              <span>11</span>
              <img
                className={
                  pathname === "/dashboard/completed-certifications"
                    ? "rotate-180deg"
                    : "arrow-icon"
                }
                src={arrow}
                alt="arrow"
              />
            </div>
          </div>
          <p className="dashboard-nav__card-text">Completed Certifications</p>
        </NavLink>
      </Restricted>
      <Restricted to="Auditor">
        <NavLink to="assigned-pending" className="dashboard-nav__card">
          <div className="dashboard-nav__card-head">
            <img src={applicationForm} alt="active admin" />
            <div className="dashboard-nav__card-detail">
              <span>11</span>
              <img
                className={
                  pathname === "/dashboard/assigned-pending"
                    ? "rotate-180deg"
                    : "arrow-icon"
                }
                src={arrow}
                alt="arrow"
              />
            </div>
          </div>
          <p className="dashboard-nav__card-text">
            Assigned Pending Applications
          </p>
        </NavLink>
        <NavLink to="assigned-active" className="dashboard-nav__card">
          <div className="dashboard-nav__card-head">
            <img src={applicationForm} alt="active certi" />
            <div className="dashboard-nav__card-detail">
              <span>11</span>
              <img
                className={
                  pathname === "/dashboard/assigned-active"
                    ? "rotate-180deg"
                    : "arrow-icon"
                }
                src={arrow}
                alt="arrow" 
              />
            </div>
          </div>
          <p className="dashboard-nav__card-text">
            Assigned Active applications
          </p>
        </NavLink>
      </Restricted>
    </nav>
  );
};

export default DashboardNav;
