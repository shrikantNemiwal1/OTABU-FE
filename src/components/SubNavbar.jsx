import React from "react";
import avatar from "../assets/icons/avatar.svg";
import "./styles/subnavbar.scss";

const SubNavbar = () => {
  return (
    <section className="subnavbar">
      <img src={avatar} alt="" />
      <div className="subnavbar__text">
        <p>Customer</p>
        <p>Customer list</p>
      </div>
    </section>
  );
};

export default SubNavbar;
