import React, { useContext, useState, useEffect } from "react";
import view from "../assets/icons/view.svg";
import request from "../assets/icons/request.svg";
import print from "../assets/icons/print.svg";
import "./styles/application.scss";
import Navbar from "../components/Navbar";
import SubNavbar from "../components/SubNavbar";
import { NavLink, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Restricted from "./Restricted";
import { Box, Modal } from "@mui/material";
import axios from "axios";
import { useFormik } from "formik";
import { remarkFormSchema } from "../validation/formSchema";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;
import Spinner from "./Spinner";

const initialValues = {
  remark: "",
  acceptance_choice: "",
};

const ApplicationInfo = () => {
  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMsg, setAlertMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { pathname } = useLocation();
  const { state } = useContext(AuthContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const id = pathname.slice(13);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "calc(50vw + 4rem)",
    minWidth: "400px",
    bgcolor: "background.paper",
    border: "none",
    borderRadius: "1rem",
    boxShadow: 24,
    outline: "none",
    p: 4,
  };

  const getApplicationDetails = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${state.token}` },
      };
      const res = await axios.get(
        BASE_URL + `/api/app_stage/forms_filled/${id}`,
        config
      );
      console.log(res?.data);
      setApplicationStatus(res?.data);
    } catch (error) {
      console.log(error?.response?.data?.msg);
    }
    setDataLoading(false);
  };

  useEffect(() => {
    getApplicationDetails();
  }, []);

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema: remarkFormSchema,
      enableReinitialize: true,
      onSubmit: async (values) => {
        console.log(values);
        setIsLoading(true);

        try {
          console.log(values);
          const response = await axios({
            method: "post",
            url: BASE_URL + `/api/app_review/send_remark/${id}`,
            data: values,
            headers: {
              Authorization: `Bearer ${state.token}`,
            },
          });
          console.log(values);
          setAlertType("success");
          setAlertMsg("Remark Sent Successfully");
          setOpen(true);
          setModalOpen(false);
          console.log(response);
        } catch (error) {
          setAlertType("error");
          setAlertMsg(error?.response?.data?.msg);
          setOpen(true);
          console.log(error?.response?.data?.msg);
          setModalOpen(false);
        }
        setIsLoading(false);
      },
    });

  return (
    <>
      <Modal
        open={modalOpen}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="modal">
            <button
              className="modal__close-btn"
              onClick={() => setModalOpen(false)}
            >
              &#9587;
            </button>
            <div className="modal__title">Send Remark</div>
            <div className="input__container checkbox-container">
              <label>Accept/Reject Application</label>
              <label className="checkbox-label">
                <input
                  type="radio"
                  name="acceptance_choice"
                  value="1"
                  checked={values.acceptance_choice === "1"}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <p>Accept</p>
              </label>
              <label className="checkbox-label">
                <input
                  type="radio"
                  name="acceptance_choice"
                  value="0"
                  checked={values.acceptance_choice === "0"}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <p>Reject</p>
              </label>
              <div className="input__error-container">
                {errors.acceptance_choice || touched.acceptance_choice ? (
                  <p className="input__error">{errors.acceptance_choice}</p>
                ) : null}
              </div>
            </div>
            <div className="input__container">
              <label htmlFor="remark">Remark :</label>
              <input
                type="text-box"
                name="remark"
                id="remark"
                value={values.remark}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter Remark"
              />
              <div className="input__error-container">
                {errors.remark && touched.remark ? (
                  <p className="input__error">{errors.remark}</p>
                ) : null}
              </div>
            </div>
          </div>
          <div className="input__container">
            <button
              className="registration__submit ml-0"
              type="submit"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? <Spinner size={25} color="white" /> : "Send"}
            </button>
          </div>
        </Box>
      </Modal>
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
      <Navbar title={"Application"} />
      <SubNavbar />
      {dataLoading ? (
        <div className="center">
          <Spinner size={50} />
        </div>
      ) : (
        <div className="application__info">
          <h2>Application (ID : {id})</h2>
          {applicationStatus.includes("Application Acceptance Pending") && (
            <button className="add-btn" onClick={() => setModalOpen(true)}>
              Send Remark
            </button>
          )}
          <div className="application_info-section">
            <NavLink to="application-form" className="link-without-style">
              <button className="application__btn">
                <img src={view} alt="view" />
                <p>{`${
                  applicationStatus.includes("Application Rejected")
                    ? "Update"
                    : "View"
                } Application Form`}</p>
              </button>
            </NavLink>

            <button className="application__btn application__btn--green">
              <img src={print} alt="print" />
              <p>Print Application Form New</p>
            </button>
          </div>
          {applicationStatus.includes("Application Form") && (
            <Restricted to="Admin Auditor">
              <div className="application_info-section">
                <NavLink
                  to="application-review-form"
                  className="link-without-style"
                >
                  <button className="application__btn">
                    <img src={view} alt="view" />
                    <p>{`${
                      applicationStatus.includes("Application Review Rejected")
                        ? "Update"
                        : "Fill"
                    } Application Review Form`}</p>
                  </button>
                </NavLink>

                <button className="application__btn application__btn--green">
                  <img src={print} alt="print" />
                  <p>Print Application Review Form</p>
                </button>
              </div>
            </Restricted>
          )}
          {(applicationStatus.includes("Application Review") ||
            applicationStatus.includes("Quotation")) &&
            !applicationStatus.includes("Application Acceptance Pending") && (
              <div className="application_info-section">
                {state.role === "Client" ? (
                  <>
                    {applicationStatus.includes("Quotation") && (
                      <NavLink
                        to="quotation-form"
                        className="link-without-style"
                      >
                        <button className="application__btn">
                          <img src={view} alt="view" />
                          <p>View Quotation Form</p>
                        </button>
                      </NavLink>
                    )}
                  </>
                ) : (
                  <NavLink to="quotation-form" className="link-without-style">
                    <button className="application__btn">
                      <img src={request} alt="view" />
                      <p>Fill Quotation Form</p>
                    </button>
                  </NavLink>
                )}

                <button className="application__btn application__btn--green">
                  <img src={print} alt="print" />
                  <p>Print Quotation Form</p>
                </button>
              </div>
            )}
        </div>
      )}
    </>
  );
};

export default ApplicationInfo;
