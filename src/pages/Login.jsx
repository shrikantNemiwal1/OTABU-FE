import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import "./styles/login.scss";
import { loginSchema } from "../validation/formSchema";
import eyeOff from "../assets/icons/eye-off.svg";
import logoLarge from "../assets/images/logo-large.png";
import logoColoured from "../assets/images/logo-coloured.png";
// import Snackbar from "@mui/material/Snackbar";
// import Alert from "@mui/material/Alert";
import { useContext } from "react";
//import { AuthContext } from "../context/AuthContext";

const initialValues = {
  email: "",
  password: "",
  rememberMe: false,
};

const Login = () => {
  const [open, setOpen] = useState(false);
  const [openMsg, setOpenMsg] = useState("");
  const [passwordHidden, setPasswordHidden] = useState(true);
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
      validationSchema: loginSchema,
      onSubmit: async (values) => {
        console.log(values);
        navigate("/dashboard");
      },
    });

  // useEffect(() => {
  //   setIsLoading(false);
  //   if (state?.isAuthenticated === false) {
  //     return navigate("/login");
  //   }
  //   if (state?.isAuthenticated === true) {
  //     return navigate("/Admin");
  //   }
  // }, [state]);
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
                  placeholder="Enter your Email"
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
              <div>
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  value={values.rememberMe}
                  onChange={handleChange}
                />
                <label className="login__remember-label" htmlFor="rememberMe">
                  Remember Me
                </label>
              </div>
              <Link className="forgot-password" to="/forgot-password/1">
                Forgot Password?
              </Link>
            </div>
            <div className="w-full flex justify-center items-center">
              <span className="text-xl text-red-500  mx-auto text-center px-2 py-1">
                {" "}
                {openMsg && openMsg}
              </span>
            </div>
            <div className="input-block input-actions">
              <button disabled={isLoading} className="submit-btn" type="submit">
                {isLoading ? (
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-4 border-b-4 border-blue-500"></div>
                  </div>
                ) : (
                  "Login"
                )}
              </button>
              <Link className="submit-btn signup-link" to="/signup">
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
