import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import { Snackbar, Alert } from "@mui/material";
import { loginSchema } from "../validation/formSchema";
import eyeOff from "../assets/icons/eye-off.svg";
import logoLarge from "../assets/images/logo-large.png";
import logoColoured from "../assets/images/logo-coloured.png";
import { AuthContext } from "../context/AuthContext";
import "./styles/login.scss";
import Spinner from "./../components/Spinner";

const initialValues = {
  email: "",
  password: "",
  rememberMe: false,
};

const Login = () => {
  const [open, setOpen] = useState(false);
  const [passwordHidden, setPasswordHidden] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { pathname } = useLocation();
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
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      console.log(values);
      try {
        setIsLoading(true);
        const res = await login(values);

        if (res?.status === 200) {
          navigate("/dashboard", { replace: true });
        } else {
          setErrMsg(res?.response?.data?.msg);
          setOpen(true);
        }
      } catch (error) {
        console.log("error", error?.response?.data?.msg);
        setErrMsg(error);
        setOpen(true);
      }
      setIsLoading(false);
    },
  });

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") return;
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
          {errMsg}
        </Alert>
      </Snackbar>
      <div className="wrapper">
        <div className="login__container">
          <img className="login__logo" src={logoColoured} alt="" />
          <div className="login__head">
            <h2>Welcome to Otabu Certification</h2>
            <h2>Otabu Certification Pvt.Ltd.</h2>
            <p>Welcome Back, Please login to your account</p>
          </div>
          <form onSubmit={handleSubmit}>
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
                  placeholder="Enter your Email"
                  onKeyDown={(e) => {
                    if (e.key === " ") e.preventDefault();
                  }}
                  onPaste={handlePaste}
                />
              </div>
              {errors.email && touched.email ? (
                <p className="input-block__error">{errors.email}</p>
              ) : null}
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
                  placeholder="Enter your password"
                />
                <span
                  className="hide-password"
                  onClick={() => setPasswordHidden(!passwordHidden)}
                >
                  <img src={eyeOff} alt="eye" />
                </span>
              </div>
              {errors.password && touched.password ? (
                <p className="input-block__error">{errors.password}</p>
              ) : null}
            </div>
            <div className="input-block login__remember">
              <div className="remember-container">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  value={values.rememberMe}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <label className="login__remember-label" htmlFor="rememberMe">
                  Remember me
                </label>
              </div>
              <Link className="forgot-password" to="/forgot-password">
                Forgot Password?
              </Link>
            </div>
            <div className="input-block input-actions">
              <button disabled={isLoading} className="submit-btn" type="submit">
                {isLoading ? <Spinner size={20} color="white" /> : "Login"}
              </button>
              <Link
                className="submit-btn signup-link"
                to={
                  pathname === "/login/client"
                    ? "/signup/client"
                    : "/signup/auditor"
                }
              >
                Sign Up
              </Link>
            </div>
          </form>
        </div>
        <div className="banner">
          <img className="banner__logo" src={logoLarge} alt="hero" />
        </div>
      </div>
    </>
  );
};

export default Login;
