import React, { useContext } from "react";
import view from "../assets/icons/view.svg";
import request from "../assets/icons/request.svg";
import print from "../assets/icons/print.svg";
import "./styles/application.scss";
import Navbar from "../components/Navbar";
import SubNavbar from "../components/SubNavbar";
import { NavLink, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Restricted from "./Restricted";

const ApplicationInfo = () => {
  const { pathname } = useLocation();
  const { state } = useContext(AuthContext);
  const id = pathname.slice(13);
  return (
    <>
      <Navbar title={"Application"} />
      <SubNavbar />
      <div className="application__info">
        <h2>Application (ID : {id})</h2>
        <div className="application_info-section">
          <NavLink to="application-form" className="link-without-style">
            <button className="application__btn">
              <img src={view} alt="view" />
              <p>View Application Form New</p>
            </button>
          </NavLink>

          <button className="application__btn application__btn--green">
            <img src={print} alt="print" />
            <p>Print Application Form New</p>
          </button>
        </div>
        <Restricted to="Admin Auditor">
          <div className="application_info-section">
            <NavLink to="application-review-form" className="link-without-style">
              <button className="application__btn">
                <img src={view} alt="view" />
                <p>Fill Application Review Form</p>
              </button>
            </NavLink>

            <button className="application__btn application__btn--green">
              <img src={print} alt="print" />
              <p>Print Application Review Form</p>
            </button>
          </div>
        </Restricted>
        <div className="application_info-section">
          {state.role === "Client" ? (
            <button className="application__btn">
              <img src={request} alt="view" />
              <p>View Quotation Form</p>
            </button>
          ) : (
            <NavLink to="quotation-form" className="link-without-style">
              <button className="application__btn">
                <img src={request} alt="view" />
                <p>Fill Quotation Form</p>
              </button>
            </NavLink>
          )}
          <button className="application__btn application__btn--green">
            <img src={print} alt="print" />
            <p>Print Quotation Form</p>
          </button>
        </div>
      </div>
    </>
  );
};

export default ApplicationInfo;
