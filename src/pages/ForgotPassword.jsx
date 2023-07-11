import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import axios from "axios";
import "./styles/login.scss";
import "./styles/signup.scss";
import { forgotPasswordSchema } from "../validation/formSchema";
import eyeOff from "../assets/icons/eye-off.svg";
import logoLarge from "../assets/images/logo-large.png";
import logoColoured from "../assets/images/logo-coloured.png";
import OtpForm from "../components/OtpForm";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useContext } from "react";
import Spinner from "../components/Spinner";
const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;
import { AuthContext } from "../context/AuthContext";

const initialValues = {
  email: "",
  password: "",
  confirm_password: "",
};

const Login = () => {
  const [open, setOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [email, setEmail] = useState("");
  const [passwordHidden, setPasswordHidden] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formStage, setFormStage] = useState(0);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const navigate = useNavigate();
  const { state } = useContext(AuthContext);

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema: forgotPasswordSchema,
      onSubmit: async (values) => {
        console.log(values);
        setIsLoading(true);
        try {
          const res = await axios.post(BASE_URL + "/api/user/change_password", {
            ...values,
            email: email,
          });
          console.log(res);
          setEmail(values.email);
          navigate("/login");
        } catch (error) {
          setAlertMsg(error?.response?.data?.msg);
          setOpen(true);
          console.log(error?.response?.data?.msg);
        }
        setIsLoading(false);
      },
    });

  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(
        BASE_URL + "/api/user/forgot_password_email_validation",
        {
          email: email,
        }
      );
      console.log(res);
      setFormStage(1);
    } catch (error) {
      setAlertMsg(error?.response?.data?.msg);
      setOpen(true);
      console.log(error?.response?.data?.msg);
    }

    setIsLoading(false);
  };

  const handleOtpSubmit = async (event) => {
    event.preventDefault();
    console.log(Number(otp.join("")));
    setIsLoading(true);
    try {
      const res = await axios.post(
        BASE_URL + "/api/user/verify_otp_forgot_password",
        {
          email: email,
          otp: Number(otp.join("")),
        }
      );
      console.log(res);
      setFormStage(2);
    } catch (error) {
      setAlertMsg(error?.response?.data?.msg);
      setOpen(true);
      console.log(error?.response?.data?.msg);
    }
    setIsLoading(false);
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  useEffect(() => {
    if (state?.isAuthenticated === true) {
      return navigate("/dashboard");
    }
  }, [state]);

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
          <img className="login__logo" src={logoColoured} alt="Otabu" />
          <div className="login__head">
            <h2>Welcome to Otabu Certification</h2>
            <h2>Otabu Certification Pvt.Ltd.</h2>
          </div>
          {formStage === 2 ? (
            <>
              <div className="otp-text">
                <h2>Enter your new password</h2>
              </div>
              <form onSubmit={handleSubmit}>
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
                    {errors.password && touched.password
                      ? errors.password
                      : null}
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
                    {isLoading ? <Spinner size={20} color="white" /> : "Submit"}
                  </button>
                </div>
              </form>
            </>
          ) : formStage === 0 ? (
            <>
              <div className="otp-text">
                <h2>Enter your Email</h2>
                <p>An OTP will be sent to this email to verify your account</p>
              </div>
              <form onSubmit={handleEmailSubmit}>
                <div className="input-block">
                  <label htmlFor="email">Email</label>
                  <div className="input-block__input">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      placeholder="Email"
                    />
                  </div>
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
            </>
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
