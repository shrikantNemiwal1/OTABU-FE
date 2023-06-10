import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logoLarge from "../assets/images/logo-large.png";
import "./styles/signup.scss";
//import { AuthContext } from '../../context/AuthContext'

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  // const { state } = useContext(AuthContext)
  // useEffect(() => {
  //   setIsLoading(false)
  //   if (state?.isAuthenticated === true) {
  //     return navigate('/Admin')
  //   }
  // }, [state])

  const handleBack = () => {
    //     console.log("sfk sdkhfks")
    // setStep(2)
    if (step === 1) {
      navigate("/login");
    } else {
      setStep(1);
    }
  };

  return (
    <div className="wrapper">
      <div className="signup__container">
        <NavLink to="/signup/client">Client Registration</NavLink>
        <NavLink to="/signup/auditor">Auditor Registration</NavLink>
      </div>
      <div className="banner">
        <img className="banner__logo" src={logoLarge} alt="hero" />
      </div>
    </div>
  );
};

export default SignUp;
