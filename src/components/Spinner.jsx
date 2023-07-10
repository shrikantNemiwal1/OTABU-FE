import React from "react";
import "./styles/spinner.scss";

const Spinner = ({ size, color }) => {
  return (
    <svg
      className="spinner"
      width={size ? `${size}px` : "30px"}
      height={size ? `${size}px` : "30px"}
      viewBox="0 0 66 66"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        className={`path${color ? `--${color}` : ""}`}
        fill="none"
        strokeWidth="6"
        strokeLinecap="round"
        cx="33"
        cy="33"
        r="30"
      ></circle>
    </svg>
  );
};

export default Spinner;
