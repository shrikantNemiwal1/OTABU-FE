import React, { useEffect, useState } from "react";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;
import "./styles/dashboardDefault.scss";
import plus from "../assets/icons/plus.svg";
import Spinner from "./Spinner";

const DashboardClient = () => {
  const [open, setOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [isLoading, setIsLoading] = useState(false);
  const { state } = useContext(AuthContext);
  const [applicationStatus, setApplicationStatus] = useState("none");

  const requestNewCertification = async () => {
    setIsLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${state.token}` },
      };
      //console.log(state.token);
      const res = await axios.get(
        BASE_URL + "/api/approvals/request_applicationform",
        config
      );
      const noti = await axios.post(
        BASE_URL + "/api/notifications/send_notification",
        {
          message: "New application request received",
          receiver_email: "kaanha641@gmail.com",
        },
        config
      );
      //console.log(res);
      setAlertType("success");
      setAlertMsg(res?.data?.msg);
      setOpen(true);
      fetchApplicationStatus();
    } catch (error) {
      setAlertType("error");
      setAlertMsg(error?.response?.data?.msg);
      setOpen(true);
      //console.log(error?.response?.data?.msg);
    }
    setIsLoading(false);
  };

  const fetchApplicationStatus = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${state.token}` },
      };
      //console.log(state.token);
      const res = await axios.get(
        BASE_URL + "/api/approvals/get_pending_applicationform",
        config
      );
      console.log(res);
      setApplicationStatus(res?.data[0]?.acceptance_status);
    } catch (error) {
      console.log(error?.response?.data?.msg);
    }
  };

  useEffect(() => {
    fetchApplicationStatus();
  }, []);

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
        {isLoading ? <Spinner /> : <img src={plus} alt="plus" />}

        <p>Request New Certification</p>
      </button>
      {applicationStatus === "none" ? null : (
        <div className="application_status">
          Application Status : {applicationStatus}
        </div>
      )}
    </div>
  );
};

export default DashboardClient;
