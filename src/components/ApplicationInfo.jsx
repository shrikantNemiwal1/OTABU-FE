import React, { useContext, useState, useEffect } from "react";
import view from "../assets/icons/view.svg";
import request from "../assets/icons/request.svg";
import print from "../assets/icons/print.svg";
import "./styles/application.scss";
import Navbar from "../components/Navbar";
import { NavLink, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
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
  acceptance_choice: "1",
};

const ApplicationInfo = () => {
  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMsg, setAlertMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { pathname } = useLocation();
  const { state } = useContext(AuthContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [confModalOpen, setConfModalOpen] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState([]);
  const [remarks, setRemarks] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [assignedAuditor, setAssignedAuditor] = useState("");
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
    setDataLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${state.token}` },
      };
      const res = await axios.get(
        BASE_URL + `/api/app_stage/forms_filled/${id}`,
        config
      );
      setApplicationStatus(res?.data);
    } catch (error) {
      console.log(error?.response?.data?.msg);
    }
    setDataLoading(false);
  };

  const getRemarks = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${state.token}` },
      };
      const res = await axios.get(
        BASE_URL + `/api/app_review/get_app_review_remarks/${id}`,
        config
      );
      console.log(res?.data);
      setRemarks(res?.data);
    } catch (error) {
      console.log(error?.response?.data?.msg);
    }
    //setDataLoading(false);
  };

  const getAssignedAuditor = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${state.token}` },
      };
      const res = await axios.get(
        BASE_URL + `/api/select_auditor/get_assigned_auditor/${id}`,
        config
      );
      console.log(res?.data?.auditor_name);
      setAssignedAuditor(res?.data?.auditor_name);
    } catch (error) {
      console.log(error?.response?.data?.msg);
    }
  };

  useEffect(() => {
    getApplicationDetails();
  }, []);

  useEffect(() => {
    //getRemarks();
    if (
      applicationStatus.includes("Auditor Assigned") ||
      (applicationStatus.includes("Audit Plan Stage 1") &&
        state.role === "Admin Auditor")
    )
      getAssignedAuditor();
  }, [applicationStatus]);

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
            url:
              BASE_URL +
              `/api/${
                applicationStatus.includes("Non Confirmities Accepted") ||
                applicationStatus.includes("Closure Pending")
                  ? applicationStatus.includes("Audit Plan Stage 2")
                    ? "audit_report_2/closure_acceptance"
                    : "audit_report_1/closure_acceptance"
                  : applicationStatus.includes("Form 39B Prepared") ||
                    applicationStatus.includes("Closure Rejected")
                  ? applicationStatus.includes("Audit Plan Stage 2")
                    ? "audit_report_2/non_confirmity_acceptance"
                    : "audit_report_1/non_confirmity_acceptance"
                  : applicationStatus.includes(
                      "Audit Plan 1 Acceptance Pending"
                    )
                  ? "audit_plan/send_remark"
                  : applicationStatus.includes(
                      "Audit Plan 2 Acceptance Pending"
                    )
                  ? "audit_plan_2/send_remark"
                  : applicationStatus.includes("Fill Quotation Choice")
                  ? "quotation/send_quotation_choice"
                  : "app_review/send_remark"
              }/${id}`,
            data: confModalOpen
              ? { quotation_choice: values.acceptance_choice }
              : { remark: values.remark },
            headers: {
              Authorization: `Bearer ${state.token}`,
            },
          });
          console.log(values);
          setAlertType("success");
          setAlertMsg(response?.data?.message || response?.data?.msg);
          setOpen(true);
          setModalOpen(false);
          setConfModalOpen(false);
          console.log(response);
          getApplicationDetails();
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
            <div className="modal__title">
              {applicationStatus.includes("Audit Plan 1 Acceptance Pending")
                ? "Audit Plan 1 Acceptance"
                : applicationStatus.includes("Audit Plan 2 Acceptance Pending")
                ? "Audit Plan 2 Acceptance"
                : "Send Remark"}
            </div>
            {/* <div className="input__container checkbox-container">
              <label>
                {applicationStatus.includes("Audit Plan 1 Acceptance Pending")
                  ? "Accept/Reject Audit Plan 1"
                  : applicationStatus.includes(
                      "Audit Plan 2 Acceptance Pending"
                    )
                  ? "Accept/Reject Audit Plan 2"
                  : "Accept/Reject Application"}
              </label>
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
            </div> */}
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
      <Modal
        open={confModalOpen}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="modal">
            <button
              className="modal__close-btn"
              onClick={() => setConfModalOpen(false)}
            >
              &#9587;
            </button>
            <div className="modal__title">
              {applicationStatus.includes("Fill Quotation Choice")
                ? "Quotaion Choice"
                : applicationStatus.includes("Non Confirmities Accepted") ||
                  applicationStatus.includes("Closure Pending")
                ? "Closure"
                : "Non conformity"}
            </div>
            <div className="input__container checkbox-container">
              <label>
                {applicationStatus.includes("Fill Quotation Choice")
                  ? "Send quotation to Client (Yes/No)"
                  : applicationStatus.includes("Non Confirmities Accepted") ||
                    applicationStatus.includes("Closure Pending")
                  ? "Accept/Reject Closure"
                  : "Accept/Reject Non conformity"}
              </label>
              <label className="checkbox-label">
                <input
                  type="radio"
                  name="acceptance_choice"
                  value="1"
                  checked={values.acceptance_choice === "1"}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <p>
                  {applicationStatus.includes("Fill Quotation Choice")
                    ? "Yes"
                    : "Accept"}
                </p>
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
                <p>
                  {applicationStatus.includes("Fill Quotation Choice")
                    ? "No"
                    : "Reject"}
                </p>
              </label>
              <div className="input__error-container">
                {errors.acceptance_choice || touched.acceptance_choice ? (
                  <p className="input__error">{errors.acceptance_choice}</p>
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
      {dataLoading ? (
        <div className="center">
          <Spinner size={50} />
        </div>
      ) : (
        <div className="application__info">
          <h2>Application (ID : {id})</h2>
          <button className="add-btn" onClick={getApplicationDetails}>
            Refresh
          </button>
          {((state.role === "Admin Auditor" &&
            applicationStatus.includes("Applicatiaehaerharhaeherah")) ||
            (state.role === "Client" &&
              (applicationStatus.includes("Audit Plan 1 Acceptance Pending") ||
                applicationStatus.includes(
                  "Audit Plan 2 Acceptance Pending"
                ))) ||
            (state.role === "Auditor" &&
              applicationStatus.includes("Fill App Review Remarks"))) && (
            <button className="add-btn" onClick={() => setModalOpen(true)}>
              {applicationStatus.includes("Audit Plan 1 Acceptance Pending")
                ? "Accept Audit Plan 1"
                : applicationStatus.includes("Audit Plan 2 Acceptance Pending")
                ? "Accept Audit Plan 2"
                : "Send Remark"}
            </button>
          )}

          {state.role === "Admin Auditor" &&
            applicationStatus.includes("Fill Quotation Choice") && (
              <button
                className="add-btn"
                onClick={() => setConfModalOpen(true)}
              >
                {applicationStatus.includes("Fill Quotation Choice")
                  ? "Fill Quotation Choice"
                  : applicationStatus.includes("Non Confirmities Accepted") ||
                    applicationStatus.includes("Closure Pending")
                  ? "Accept Closure"
                  : "Accept Non conformity"}
              </button>
            )}

          {/* BasicApplicationForm */}
          {state.role !== "Auditor" &&
            applicationStatus.includes("Application Form Incomplete") && (
              <div className="application_info-section">
                <NavLink to="application-form" className="link-without-style">
                  <button className="application__btn">
                    <img src={view} alt="view" />
                    <p>{`${
                      applicationStatus.includes("Application Rejected")
                        ? "Update"
                        : "View"
                    } Basic Application Form`}</p>
                  </button>
                </NavLink>
                <button className="application__btn application__btn--green">
                  <img src={print} alt="print" />
                  <p>Print Basic Application Form New</p>
                </button>
              </div>
            )}

          {/* ApplicationForm */}
          {!applicationStatus.includes("Application Form Incomplete") && (
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
          )}

          {/* Application Review */}
          {((state.role === "Admin Auditor" &&
            (applicationStatus.includes("Application Review") ||
              applicationStatus.includes("Application Review Pending") ||
              applicationStatus.includes("Fill Application Review"))) ||
            (state.role === "Auditor" &&
              applicationStatus.includes("Application Review"))) && (
            <div className="application_info-section">
              <NavLink
                to="application-review-form"
                className="link-without-style"
              >
                <button className="application__btn">
                  <img
                    src={
                      applicationStatus.includes("Application Review")
                        ? view
                        : request
                    }
                    alt="view"
                  />
                  <p>{`${
                    applicationStatus.includes("Application Review")
                      ? "View"
                      : applicationStatus.includes(
                          "Application Review Rejected"
                        )
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
          )}

          {/* Quotation Form */}
          {((state.role === "Client" &&
            (applicationStatus.includes("Fill Quotation") ||
              applicationStatus.includes("Quotation Accepted by Client") ||
              applicationStatus.includes("Quotation"))) ||
            (state.role === "Admin Auditor" &&
              (applicationStatus.includes("Fill Quotation") ||
                applicationStatus.includes("Quotation")))) && (
            <div className="application_info-section">
              <NavLink to="quotation-form" className="link-without-style">
                <button className="application__btn">
                  <img
                    src={
                      applicationStatus.includes("Quotation") ? view : request
                    }
                    alt="view"
                  />
                  <p>{`${
                    applicationStatus.includes("Quotation") ? "View" : "Fill"
                  } Quotation Form`}</p>
                </button>
              </NavLink>

              <button className="application__btn application__btn--green">
                <img src={print} alt="print" />
                <p>Print Quotation Form</p>
              </button>
            </div>
          )}

          {/* Client Agreement and rules */}
          {((state.role === "Client" &&
            (applicationStatus.includes("Quotation Accepted by Client") ||
              applicationStatus.includes("Client Agreement and Rules") ||
              applicationStatus.includes("Fill Client Agreement and Rules"))) ||
            (state.role === "Admin Auditor" &&
              applicationStatus.includes("Client Agreement and Rules"))) && (
            <div className="application_info-section">
              <NavLink to="agreement-and-rules" className="link-without-style">
                <button className="application__btn">
                  <img
                    src={
                      applicationStatus.includes("Client Agreement and Rules")
                        ? view
                        : request
                    }
                    alt="view"
                  />
                  <p>
                    {applicationStatus.includes("Client Agreement and Rules")
                      ? "View"
                      : "Fill"}{" "}
                    Certification Agreement and Rules
                  </p>
                </button>
              </NavLink>
              <button className="application__btn application__btn--green">
                <img src={print} alt="print" />
                <p>Print Certification Agreement and Rules</p>
              </button>
            </div>
          )}

          {/* Audit Program */}
          {((state.role === "Admin Auditor" &&
            (applicationStatus.includes("Client Agreement and Rules") ||
              applicationStatus.includes("Audit Program Prepared"))) ||
            (state.role === "Client" &&
              applicationStatus.includes("Audit Program Prepared")) ||
            applicationStatus.includes("Audit Program")) && (
            <div className="application_info-section">
              <NavLink to="audit-program" className="link-without-style">
                <button className="application__btn">
                  <img
                    src={
                      applicationStatus.includes("Audit Program Prepared") ||
                      applicationStatus.includes("Audit Program")
                        ? view
                        : request
                    }
                    alt="view"
                  />
                  <p>{`${
                    applicationStatus.includes("Audit Program Prepared") ||
                    applicationStatus.includes("Audit Program")
                      ? "View"
                      : "Fill"
                  } Audit Program`}</p>
                </button>
              </NavLink>
              <button className="application__btn application__btn--green">
                <img src={print} alt="print" />
                <p>Print Audit Program Form</p>
              </button>
            </div>
          )}

          {/* Intimation Letter 1 */}
          {((state.role === "Admin Auditor" &&
            applicationStatus.includes("Audit Program Prepared")) ||
            applicationStatus.includes("Intimation Letter 1 Prepared") ||
            applicationStatus.includes("Audit Plan Stage 1") ||
            applicationStatus.includes("Auditor Assigned")) && (
            <div className="application_info-section">
              <NavLink to="intimation-letter-1" className="link-without-style">
                <button className="application__btn">
                  <img
                    src={
                      applicationStatus.includes(
                        "Intimation Letter 1 Prepared"
                      ) ||
                      applicationStatus.includes("Audit Plan Stage 1") ||
                      applicationStatus.includes("Auditor Assigned")
                        ? view
                        : request
                    }
                    alt="view"
                  />
                  <p>{`${
                    applicationStatus.includes(
                      "Intimation Letter 1 Prepared"
                    ) ||
                    applicationStatus.includes("Audit Plan Stage 1") ||
                    applicationStatus.includes("Auditor Assigned")
                      ? "View"
                      : "Fill"
                  } Intimation Letter 1 Form`}</p>
                </button>
              </NavLink>
              <button className="application__btn application__btn--green">
                <img src={print} alt="print" />
                <p>Print Intimation Letter 1 Form</p>
              </button>
            </div>
          )}

          {/* Assign Auditor */}
          {/* {state.role === "Admin Auditor" &&
            (applicationStatus.includes("Intimation Letter 1 Prepared") ||
              applicationStatus.includes("Auditor Assigned") ||
              applicationStatus.includes("Audit Plan Stage 1")) && (
              <div className="application_info-section">
                <NavLink to="assign-auditor" className="link-without-style">
                  <button className="application__btn">
                    <img
                      src={
                        applicationStatus.includes("Auditor Assigned") ||
                        applicationStatus.includes("Audit Plan Stage 1")
                          ? view
                          : request
                      }
                      alt="view"
                    />
                    <p>Assign Auditor</p>
                  </button>
                </NavLink>

                <button className="application__btn application__btn--green">
                  <img src={view} alt="print" />
                  <p>Assigned Auditor : {assignedAuditor || "None"}</p>
                </button>
              </div>
            )} */}

          {/* Audit Plan 1 */}
          {((state.role === "Auditor" &&
            applicationStatus.includes("Intimation Letter 1 Prepared")) ||
            applicationStatus.includes("Auditor Assigned") ||
            applicationStatus.includes("Audit Plan Stage 1")) && (
            <div className="application_info-section">
              <NavLink to="audit-plan-stage-1" className="link-without-style">
                <button className="application__btn">
                  <img
                    src={
                      applicationStatus.includes("Audit Plan Stage 1")
                        ? view
                        : request
                    }
                    alt="view"
                  />
                  <p>{`${
                    applicationStatus.includes("Audit Plan Stage 1")
                      ? "View"
                      : "Fill"
                  } Audit Plan stage 1 Form`}</p>
                </button>
              </NavLink>
              <button className="application__btn application__btn--green">
                <img src={print} alt="print" />
                <p>Print Audit Plan stage 1 Form</p>
              </button>
            </div>
          )}

          {/* Audit Report 1 */}
          {((state.role === "Auditor" &&
            applicationStatus.includes("Audit Plan 1 Accepted")) ||
            applicationStatus.includes("Audit Report 1")) && (
            <div className="application_info-section">
              <NavLink to="audit-report-stage-1" className="link-without-style">
                <button className="application__btn">
                  <img
                    src={
                      applicationStatus.includes("Non Confirmities Raised") ||
                      applicationStatus.includes("Audit Report 1")
                        ? view
                        : request
                    }
                    alt="view"
                  />
                  <p>{`${
                    applicationStatus.includes("Non Confirmities Raised") ||
                    applicationStatus.includes("Audit Report 1")
                      ? "View"
                      : "Fill"
                  } Audit Report 1 Form`}</p>
                </button>
              </NavLink>
              <button className="application__btn application__btn--green">
                <img src={print} alt="print" />
                <p>Print Audit Program 1 Form</p>
              </button>
            </div>
          )}

          {/* Non confirmities 1 */}
          {((state.role === "Auditor" &&
            applicationStatus.includes("Non Confirmities Raised")) ||
            applicationStatus.includes("Non Confirmities Rejected") ||
            applicationStatus.includes("Form 39B Prepared") ||
            applicationStatus.includes("Closure Pending") ||
            applicationStatus.includes("Closure Rejected") ||
            applicationStatus.includes("Non Confirmities Accepted")) &&
            !applicationStatus.includes("Audit Plan Stage 2") && (
              <div className="application_info-section">
                <NavLink
                  to="corrective-action-report"
                  className="link-without-style"
                >
                  <button className="application__btn">
                    <img
                      src={
                        !applicationStatus.includes("Non Confirmities Raised")
                          ? view
                          : request
                      }
                      alt="view"
                    />
                    <p>{`${
                      !applicationStatus.includes("Non Confirmities Raised")
                        ? "View"
                        : "Fill"
                    } Corrective Action Report Form`}</p>
                  </button>
                </NavLink>
                <button className="application__btn application__btn--green">
                  <img src={print} alt="print" />
                  <p>Print Corrective Action Report Form</p>
                </button>
              </div>
            )}

          {/* Intimation Letter 2 */}
          {((state.role === "Admin Auditor" &&
            (applicationStatus.includes("Audit Stage 1 Completed") ||
              applicationStatus.includes("Closure Accepted"))) ||
            applicationStatus.includes("Intimation Letter 2 Prepared") ||
            applicationStatus.includes("Intimation Letter 2")) && (
            <div className="application_info-section">
              <NavLink to="intimation-letter-2" className="link-without-style">
                <button className="application__btn">
                  <img
                    src={
                      applicationStatus.includes(
                        "Intimation Letter 2 Prepared"
                      ) ||
                      applicationStatus.includes("Audit Plan Stage 2") ||
                      applicationStatus.includes("Intimation Letter 2")
                        ? view
                        : request
                    }
                    alt="view"
                  />
                  <p>{`${
                    applicationStatus.includes(
                      "Intimation Letter 2 Prepared"
                    ) ||
                    applicationStatus.includes("Audit Plan Stage 2") ||
                    applicationStatus.includes("Intimation Letter 2")
                      ? "View"
                      : "Fill"
                  } Intimation Letter 2 Form`}</p>
                </button>
              </NavLink>
              <button className="application__btn application__btn--green">
                <img src={print} alt="print" />
                <p>Print Intimation Letter 2 Form</p>
              </button>
            </div>
          )}

          {/* Audit Plan 2 */}
          {((state.role === "Auditor" &&
            applicationStatus.includes("Intimation Letter 2 Prepared")) ||
            applicationStatus.includes("Audit Plan Stage 2") ||
            applicationStatus.includes("Audit Plan Stage 2 Completed") ||
            applicationStatus.includes("Audit Plan 2 Acceptance Pending")) && (
            <div className="application_info-section">
              <NavLink to="audit-plan-stage-2" className="link-without-style">
                <button className="application__btn">
                  <img
                    src={
                      applicationStatus.includes("Audit Plan Stage 2") ||
                      applicationStatus.includes(
                        "Audit Plan 2 Acceptance Pending"
                      )
                        ? view
                        : request
                    }
                    alt="view"
                  />
                  <p>{`${
                    applicationStatus.includes("Audit Plan Stage 2") ||
                    applicationStatus.includes(
                      "Audit Plan 2 Acceptance Pending"
                    )
                      ? "View"
                      : "Fill"
                  } Audit Plan stage 2 Form`}</p>
                </button>
              </NavLink>
              <button className="application__btn application__btn--green">
                <img src={print} alt="print" />
                <p>Print Audit Plan stage 2 Form</p>
              </button>
            </div>
          )}

          {/* Audit Report 2 */}
          {((state.role === "Auditor" &&
            applicationStatus.includes("Audit Plan 2 Accepted")) ||
            applicationStatus.includes("Audit Report 2")) && (
            <div className="application_info-section">
              <NavLink to="audit-report-stage-2" className="link-without-style">
                <button className="application__btn">
                  <img
                    src={
                      applicationStatus.includes("Non Confirmities Raised") ||
                      applicationStatus.includes("Audit Report 2")
                        ? view
                        : request
                    }
                    alt="view"
                  />
                  <p>{`${
                    applicationStatus.includes("Non Confirmities Raised") ||
                    applicationStatus.includes("Audit Report 2")
                      ? "View"
                      : "Fill"
                  } Audit Report 2 Form`}</p>
                </button>
              </NavLink>
              <button className="application__btn application__btn--green">
                <img src={print} alt="print" />
                <p>Print Audit Report 2 Form</p>
              </button>
            </div>
          )}

          {/* Non confirmities 2 */}
          {((state.role === "Auditor" &&
            applicationStatus.includes("Non Confirmities Raised")) ||
            applicationStatus.includes("Non Confirmities Rejected") ||
            applicationStatus.includes("Form 39B Prepared") ||
            applicationStatus.includes("Closure Pending") ||
            applicationStatus.includes("Closure Rejected") ||
            applicationStatus.includes("Non Confirmities Accepted")) &&
            applicationStatus.includes("Audit Plan Stage 2") && (
              <div className="application_info-section">
                <NavLink
                  to="corrective-action-report-2"
                  className="link-without-style"
                >
                  <button className="application__btn">
                    <img
                      src={
                        !applicationStatus.includes("Non Confirmities Raised")
                          ? view
                          : request
                      }
                      alt="view"
                    />
                    <p>{`${
                      !applicationStatus.includes("Non Confirmities Raised")
                        ? "View"
                        : "Fill"
                    } Corrective Action Report Form`}</p>
                  </button>
                </NavLink>
                <button className="application__btn application__btn--green">
                  <img src={print} alt="print" />
                  <p>Print Corrective Action Report Form</p>
                </button>
              </div>
            )}

          {/* Technical Committee Report */}
          {state.role === "Admin Auditor" &&
            (applicationStatus.includes("Audit Stage 2 Completed") ||
              applicationStatus.includes("Technical Committee Report") ||
              applicationStatus.includes("Audit Report 1 ihi")) && (
              <div className="application_info-section">
                <NavLink
                  to="technical-committee-report"
                  className="link-without-style"
                >
                  <button className="application__btn">
                    <img
                      src={
                        applicationStatus.includes(
                          "Technical Committee Report Completed"
                        ) ||
                        applicationStatus.includes(
                          "certificate Issue Checklist Completed"
                        )
                          ? view
                          : request
                      }
                      alt="view"
                    />
                    <p>{`${
                      applicationStatus.includes(
                        "Technical Committee Report Completed"
                      ) ||
                      applicationStatus.includes(
                        "certificate Issue Checklist Completed"
                      )
                        ? "View"
                        : "Fill"
                    } Technical Committee Report Form`}</p>
                  </button>
                </NavLink>
                <button className="application__btn application__btn--green">
                  <img src={print} alt="print" />
                  <p>Print Technical Committee Report Form</p>
                </button>
              </div>
            )}

          {/* Certification Issue Checklist */}
          {state.role === "Admin Auditor" &&
            (applicationStatus.includes(
              "Technical Committee Report Completed"
            ) ||
              applicationStatus.includes(
                "certificate Issue Checklist Completed"
              )) && (
              <div className="application_info-section">
                <NavLink
                  to="certificate-issue-checklist"
                  className="link-without-style"
                >
                  <button className="application__btn">
                    <img
                      src={
                        applicationStatus.includes(
                          "certificate Issue Checklist Completed"
                        )
                          ? view
                          : request
                      }
                      alt="view"
                    />
                    <p>{`${
                      applicationStatus.includes(
                        "certificate Issue Checklist Completed"
                      )
                        ? "View"
                        : "Fill"
                    } Certification Issue Checklist Form`}</p>
                  </button>
                </NavLink>
                <button className="application__btn application__btn--green">
                  <img src={print} alt="print" />
                  <p>Print Certification Issue Checklist Form</p>
                </button>
              </div>
            )}
        </div>
      )}
    </>
  );
};

export default ApplicationInfo;
