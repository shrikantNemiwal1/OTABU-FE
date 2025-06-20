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
import Spinner from "../components/Spinner";
const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;
import { AuthContext } from "../context/AuthContext";

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
  const [alertMsg, setAlertMsg] = useState("");
  const [email, setEmail] = useState("");
  const [passwordHidden, setPasswordHidden] = useState(true);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { state, login } = useContext(AuthContext);

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues,
    validationSchema: clientRegistrationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      const body = { ...values, mobile: Number(values.mobile) };
      //console.log(body);
      try {
        const response = await axios.post(
          BASE_URL + "/api/user/register/client",
          body
        );

        //console.log(response);
        setFormSubmitted(true);
        setEmail(values.email);
      } catch (error) {
        if (
          error?.response?.data?.msg ===
          "Email Registered. Verification Pending"
        ) {
          setEmail(values.email);
          setFormSubmitted(true);
        }
        setAlertMsg(error?.response?.data?.msg);
        setOpen(true);
        console.log(error);
      }

      setIsLoading(false);
    },
  });

  const handleOtpSubmit = async (event) => {
    event.preventDefault();
    console.log(Number(otp.join("")));
    setIsLoading(true);
    try {
      const response = await axios.post(
        BASE_URL + "/api/user/verify_otp_registration",
        {
          email: email,
          otp: Number(otp.join("")),
        }
      );
      //console.log(response);
      navigate("/login/auditor", { replace: true });
    } catch (error) {
      setAlertMsg(error?.response?.data?.msg);
      setOpen(true);
      //console.log(error?.response?.data?.msg);
    }
    setIsLoading(false);
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    if (state?.isAuthenticated === true) {
      return navigate("/dashboard", { replace: true });
    }
  }, [state]);

  const handlePaste = (event) => {
    event.preventDefault();
    const pastedText = event.clipboardData.getData("text/plain");
    const newValue = pastedText.replace(/\s/g, "");
    setFieldValue("email", newValue);
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
          {alertMsg}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
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
                  {/* <div className="country-code">+91</div> */}
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    value={values.mobile}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isLoading}
                    placeholder="Mobile Number"
                    onKeyDown={(e) => {
                      const key = e.key;
                      if (
                        !/^\d$/.test(key) &&
                        key !== "Backspace" &&
                        key !== "Delete"
                      ) {
                        e.preventDefault();
                      }
                    }}
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
                    disabled={isLoading}
                    placeholder="Email"
                    onKeyDown={(e) => {
                      if (e.key === " ") e.preventDefault();
                    }}
                    onPaste={handlePaste}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
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
                  {isLoading ? <Spinner size={20} color="white" /> : "Next"}
                </button>
              </div>
            </form>
          ) : (
            <OtpForm
              otp={otp}
              setOtp={setOtp}
              handleSubmit={handleOtpSubmit}
              isLoading={isLoading}
            />
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
