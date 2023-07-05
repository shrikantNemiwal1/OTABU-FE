import React, { useState } from "react";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;
import "./styles/dashboardDefault.scss";
import plus from "../assets/icons/plus.svg";

const DashboardClient = () => {
  const [open, setOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("success");
  const { state } = useContext(AuthContext);

  const requestNewCertification = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${state.token}` },
      };
      //console.log(state.token);
      const res = await axios.get(
        BASE_URL + "/api/approvals/request_applicationform",
        config
      );
      //console.log(res);
      setAlertMsg(res?.data?.msg);
      setAlertType("success");
      setOpen(true);
    } catch (error) {
      setAlertMsg(error?.response?.data?.msg);
      setAlertType("error");
      setOpen(true);
      //console.log(error?.response?.data?.msg);
    }
  };

  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
      >
        <Alert
          variant="filled"
          onClose={() => setOpen(false)}
          severity={alertType}
          sx={{ width: "100%" }}
        >
          {alertMsg}
        </Alert>
      </Snackbar>
      <button
        className="request-certification-btn"
        onClick={requestNewCertification}
      >
        <img src={plus} alt="plus" />
        <p>Request New Certification</p>
      </button>
    </div>
  );
};

export default DashboardClient;
