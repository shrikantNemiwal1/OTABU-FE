import React, { useState } from "react";

const OtpForm = ({ otp, setOtp, handleSubmit, isLoading }) => {
  const handleChange = (value, event) => {
    let otpCopy = otp;
    otpCopy[value - 1] = event.target.value;
    setOtp(otpCopy);
  };

  const inputfocus = (elmnt) => {
    if (elmnt.key === "Delete" || elmnt.key === "Backspace") {
      const next = elmnt.target.tabIndex - 2;
      if (next > -1) {
        elmnt.target.form.elements[next].focus();
      }
    } else {
      const next = elmnt.target.tabIndex;
      if (next < 6) {
        elmnt.target.form.elements[next].focus();
      }
    }
  };

  return (
    <>
      <div className="otp-text">
        <h2>Enter OTP to verify your Email</h2>
        <p>OTP has been sent to your Email</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="otpContainer">
          <input
            name="otp1"
            type="tel"
            autoComplete="off"
            className="otpInput"
            value={otp.otp1}
            onChange={(e) => handleChange(1, e)}
            tabIndex="1"
            maxLength="1"
            onKeyUp={(e) => inputfocus(e)}
          />
          <input
            name="otp2"
            type="tel"
            autoComplete="off"
            className="otpInput"
            value={otp.otp2}
            onChange={(e) => handleChange(2, e)}
            tabIndex="2"
            maxLength="1"
            onKeyUp={(e) => inputfocus(e)}
          />
          <input
            name="otp3"
            type="tel"
            autoComplete="off"
            className="otpInput"
            value={otp.otp3}
            onChange={(e) => handleChange(3, e)}
            tabIndex="3"
            maxLength="1"
            onKeyUp={(e) => inputfocus(e)}
          />
          <input
            name="otp4"
            type="tel"
            autoComplete="off"
            className="otpInput"
            value={otp.otp4}
            onChange={(e) => handleChange(4, e)}
            tabIndex="4"
            maxLength="1"
            onKeyUp={(e) => inputfocus(e)}
          />

          <input
            name="otp5"
            type="tel"
            autoComplete="off"
            className="otpInput"
            value={otp.otp5}
            onChange={(e) => handleChange(5, e)}
            tabIndex="5"
            maxLength="1"
            onKeyUp={(e) => inputfocus(e)}
          />
          <input
            name="otp6"
            type="tel"
            autoComplete="off"
            className="otpInput"
            value={otp.otp6}
            onChange={(e) => handleChange(6, e)}
            tabIndex="6"
            maxLength="1"
            onKeyUp={(e) => inputfocus(e)}
          />
        </div>
        <div className="input-block">
          <button className="submit-btn" type="submit">
            {isLoading ? "Submitting" : "Verify Email"}
          </button>
        </div>
      </form>
    </>
  );
};

export default OtpForm;
