import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import axios from "axios";
import "./styles/login.scss";
import { clientRegistrationSchema } from "../validation/formSchema";
import eyeOff from "../assets/icons/eye-off.svg";
import logoLarge from "../assets/images/logo-large.png";
import logoColoured from "../assets/images/logo-coloured.png";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useContext } from "react";
import OtpForm from "../components/OtpForm";
const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;
//import { AuthContext } from "../context/AuthContext";

const initialValues = {
  organization_name: "",
  director_name: "",
  mobile: "",
  email: "",
  password: "",
  confirm_password: "",
};

const Login = () => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [passwordHidden, setPasswordHidden] = useState(true);
  const [formSubmitted, setFormSubmitted] = useState(true);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  //const { state, login } = useContext(AuthContext);
  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema: clientRegistrationSchema,
      onSubmit: async (values) => {
        const body = { ...values, mobile: Number(values.mobile) };
        //console.log(body);
        axios
          .post(BASE_URL + "/api/user/register/client", body)
          .then((response) => {
            //console.log(response);
            setFormSubmitted(true);
            setEmail(values.email);
          })
          .catch((error) => {
            setOpen(true);
            console.log(error);
          });
      },
    });

  const handleOtpSubmit = (event) => {
    event.preventDefault();
    console.log(Number(otp.join("")));
    axios
      .post(BASE_URL + "/api/user/verify_otp_registration", {
        email: email,
        otp: Number(otp.join("")),
      })
      .then((response) => {
        console.log(response);
        navigate("/login");
      })
      .catch((error) => {
        setOpen(true);
        console.log(error);
      });
  };

  return (
    <>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleCloseAlert}>
        <Alert
          variant="filled"
          onClose={() => setOpen(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          Error
        </Alert>
      </Snackbar>
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
                <label htmlFor="organization_name">Organization Name</label>
                <div className="input-block__input">
                  <input
                    type="text"
                    id="organization_name"
                    name="organization_name"
                    value={values.organization_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Organization Name"
                  />
                </div>
                <p className="input-block__error">
                  {errors.organization_name && touched.organization_name
                    ? errors.organization_name
                    : null}
                </p>
              </div>
              <div className="input-block">
                <label htmlFor="director_name">Director Name</label>
                <div className="input-block__input">
                  <input
                    type="text"
                    id="director_name"
                    name="director_name"
                    value={values.director_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Director Name"
                  />
                </div>

                <p className="input-block__error">
                  {errors.director_name && touched.director_name
                    ? errors.director_name
                    : null}
                </p>
              </div>
              <div className="input-block">
                <label htmlFor="mobile">Mobile Number</label>
                <div className="input-block__input">
                  <div className="country-code">+91</div>
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    value={values.mobile}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="10 digit Mobile Number"
                  />
                </div>
                <p className="input-block__error">
                  {errors.mobile && touched.mobile ? errors.mobile : null}
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
