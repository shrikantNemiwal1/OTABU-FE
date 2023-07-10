import React from "react";
import view from "../assets/icons/view.svg";
import request from "../assets/icons/request.svg";
import print from "../assets/icons/print.svg";
import "./styles/application.scss";
import Navbar from "../components/Navbar";
import SubNavbar from "../components/SubNavbar";
import { NavLink, useLocation } from "react-router-dom";

const ApplicationInfo = () => {
  const { pathname } = useLocation();
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
            <img src={print} alt="view" />
            <p>Print Application Form New</p>
          </button>
        </div>
        <div className="application_info-section">
          <button className="application__btn">
            <img src={request} alt="view" />
            <p>View Quotation Form</p>
          </button>
          <button className="application__btn application__btn--green">
            <img src={print} alt="view" />
            <p>Print Quotation Form</p>
          </button>
        </div>
      </div>
    </>
  );
};

export default ApplicationInfo;
