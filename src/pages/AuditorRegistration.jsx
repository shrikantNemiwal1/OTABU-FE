import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import "./styles/login.scss";
import { auditorRegistrationSchema } from "../validation/formSchema";
import eyeOff from "../assets/icons/eye-off.svg";
import logoLarge from "../assets/images/logo-large.png";
import logoColoured from "../assets/images/logo-coloured.png";
import OtpForm from "../components/OtpForm";
// import Snackbar from "@mui/material/Snackbar";
// import Alert from "@mui/material/Alert";
import { useContext } from "react";
//import { AuthContext } from "../context/AuthContext";

const initialValues = {
  name: "",
  email: "",
  password: "",
  confirm_password: "",
};

const Login = () => {
  const [open, setOpen] = useState(false);
  const [openMsg, setOpenMsg] = useState("");
  const [passwordHidden, setPasswordHidden] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const navigate = useNavigate();
  //const { state, login } = useContext(AuthContext);

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema: auditorRegistrationSchema,
      onSubmit: async (values) => {
        console.log(values);
        setFormSubmitted(true);
      },
    });

  const handleOtpSubmit = (event) => {
    event.preventDefault();
    console.log(otp.join(""));
    navigate("/login");
  };

  return (
    <>
      {/* <Snackbar open={open} autoHideDuration={3000} onClose={handleCloseAlert}>
        <Alert
          variant="filled"
          onClose={() => setOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {openMsg && openMsg}
        </Alert>
      </Snackbar> */}
      <div className="wrapper">
        <div className="login__container">
          <img className="login__logo" src={logoColoured} alt="" />
          <div className="login__head">
            <h2>Welcome to Otabu Certification</h2>
            <h2>Otabu Certification Pvt.Ltd.</h2>
          </div>
          {!formSubmitted ? (
            <form onSubmit={handleSubmit}>
              <div className="input-block">
                <label htmlFor="name">Name</label>
                <div className="input-block__input">
                  <input
                    type="tel"
                    id="name"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Name"
                  />
                </div>
                <p className="input-block__error">
                  {errors.name && touched.name ? errors.name : null}
                </p>
              </div>

              <div className="input-block">
                <label htmlFor="email">Email</label>
                <div className="input-block__input">
                  <input
                    type="text"
                    id="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Email"
                  />
                </div>

                <p className="input-block__error">
                  {errors.email && touched.email ? errors.email : null}
                </p>
              </div>

              <div className="input-block">
                <label htmlFor="password">Password</label>
                <div className="input-block__input">
                  <input
                    type={passwordHidden ? "password" : "text"}
                    id="password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Password"
                  />
                  <span
                    className="hide-password"
                    onClick={() => setPasswordHidden(!passwordHidden)}
                  >
                    <img src={eyeOff} alt="eye" />
                  </span>
                </div>

                <p className="input-block__error">
                  {errors.password && touched.password ? errors.password : null}
                </p>
              </div>

              <div className="input-block">
                <label htmlFor="confirm_password">Confirm Password</label>
                <div className="input-block__input">
                  <input
                    type={passwordHidden ? "password" : "text"}
                    id="confirm_password"
                    name="confirm_password"
                    value={values.confirm_password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Password"
                  />
                  <span
                    className="hide-password"
                    onClick={() => setPasswordHidden(!passwordHidden)}
                  >
                    <img src={eyeOff} alt="eye" />
                  </span>
                </div>

                <p className="input-block__error">
                  {errors.confirm_password && touched.confirm_password
                    ? errors.confirm_password
                    : null}
                </p>
              </div>

              <div className="input-block input-actions">
                <button
                  disabled={isLoading}
                  className="submit-btn"
                  type="submit"
                >
                  {isLoading ? (
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-4 border-b-4 border-blue-500"></div>
                    </div>
                  ) : (
                    "Next"
                  )}
                </button>
              </div>
            </form>
          ) : (
            <OtpForm otp={otp} setOtp={setOtp} handleSubmit={handleOtpSubmit} />
          )}
        </div>
        <div className="banner">
          <img className="banner__logo" src={logoLarge} alt="hero" />
        </div>
      </div>
    </>
  );
};

export default Login;
