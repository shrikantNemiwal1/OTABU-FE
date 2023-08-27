import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/notfound.scss";
import { AuthContext } from "../context/AuthContext";

const NotFound = () => {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(3);
  const { state } = useContext(AuthContext);

  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      state?.isAuthenticated
        ? navigate("/dashboard", { replace: true })
        : navigate("/login", { replace: true });
    }, 3000); // 5 seconds

    const countdownTimer = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds - 1);
    }, 1000); // 1 second

    return () => {
      clearTimeout(redirectTimer);
      clearInterval(countdownTimer);
    };
  }, [navigate]);

  return (
    <div className="notfound">
      <h1 className="notfound__head">404 Not Found</h1>
      <p className="notfound__text">
        The page you're looking for does not exist.
      </p>
      <p className="notfound__text">
        Redirecting to the homepage in {seconds} seconds...
      </p>
    </div>
  );
};

export default NotFound;
