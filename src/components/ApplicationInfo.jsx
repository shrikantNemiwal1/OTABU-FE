import { useContext, useState, useEffect } from "react";
import view from "../assets/icons/view.svg";
import request from "../assets/icons/request.svg";
import print from "../assets/icons/print.svg";
import upload from "../assets/icons/upload.svg";
import download from "../assets/icons/download.svg";
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
  const [fullModalOpen, setFullModalOpen] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState([]);
  const [remarks, setRemarks] = useState();
  const [dataLoading, setDataLoading] = useState(true);
  const [auditPlan1, setAuditPlan1] = useState("");
  const [auditReport1, setAuditReport1] = useState("");
  const [auditPlan2, setAuditPlan2] = useState("");
  const [auditReport2, setAuditReport2] = useState("");
  const [uploading, setUploading] = useState(false);
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
        BASE_URL +
          `/api/${
            applicationStatus.includes(
              "Audit Report Stage 2 Remarks by Application Reviewer"
            )
              ? "audit_report_2/get_audit_report_2_remarks"
              : applicationStatus.includes("Audit Plan Stage 2 Remarks")
              ? "audit_plan_2/get_audit_plan_2_remarks"
              : applicationStatus.includes(
                  "Intimation Letter Stage 2 Remarks"
                ) ||
                applicationStatus.includes(
                  "Fill Intimation Letter Stage 2 Remarks"
                ) ||
                applicationStatus.includes("Intimation letter 2 rejected")
              ? "intimation_letter_2/get_intimartion_2_remarks"
              : applicationStatus.includes(
                  "Audit Report Stage 1 Remarks by Application Reviewer"
                )
              ? "audit_report_1/get_audit_report_1_remarks"
              : applicationStatus.includes("Audit Plan Stage 1 Remarks")
              ? "audit_plan_1/get_audit_plan_1_remarks"
              : applicationStatus.includes(
                  "Intimation Letter Stage 1 Remarks"
                ) ||
                applicationStatus.includes(
                  "Fill Intimation Letter Stage 1 Remarks"
                ) ||
                applicationStatus.includes("Intimation letter 1 rejected")
              ? "intimation_letter_1/get_intimartion_1_remarks"
              : "app_review/get_app_review_remarks"
          }/${id}`,
        config
      );
      setRemarks(res?.data);
    } catch (error) {
      console.log(error?.response?.data?.msg);
    }
    //setDataLoading(false);
  };

  useEffect(() => {
    getApplicationDetails();
  }, []);

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setErrors,
  } = useFormik({
    initialValues,
    validationSchema: remarkFormSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (
        (applicationStatus.includes("Fill Intimation Letter Stage 1 Remarks") ||
          applicationStatus.includes("Fill Audit Plan Stage 1 Remarks") ||
          applicationStatus.includes(
            "Fill Intimation Letter Stage 2 Remarks"
          ) ||
          applicationStatus.includes("Fill Audit Plan Stage 2 Remarks")) &&
        values?.remark.trim() === ""
      ) {
        setErrors({ remark: "This field is required" });
        return;
      }
      setIsLoading(true);
      try {
        const response = await axios({
          method: "post",
          url:
            BASE_URL +
            `/api/${
              applicationStatus.includes("Fill Audit Report Stage 1 Remarks")
                ? "audit_report_1/send_remark"
                : applicationStatus.includes(
                    "Fill Audit Report Stage 2 Remarks"
                  )
                ? "audit_report_2/send_remark"
                : applicationStatus.includes(
                    "Fill Non conformity Remarks Stage 1"
                  )
                ? "audit_report_1/send_if_non_conformity_auditor"
                : applicationStatus.includes(
                    "Fill Non conforimity Acceptance Stage 1"
                  )
                ? "audit_report_1/non_conformity_acceptance_client"
                : applicationStatus.includes("Fill Closure Acceptance Stage 1")
                ? "audit_report_1/closure_acceptance"
                : applicationStatus.includes("Fill Audit Plan Stage 1 Remarks")
                ? "audit_plan_1/send_remark"
                : applicationStatus.includes("Fill Audit Plan Stage 2 Remarks")
                ? "audit_plan_2/send_remark"
                : applicationStatus.includes("Fill Quotation Choice")
                ? "quotation/send_quotation_choice"
                : applicationStatus.includes(
                    "Fill Intimation Letter Stage 1 Remarks"
                  )
                ? "intimation_letter_1/send_remark"
                : applicationStatus.includes(
                    "Fill Intimation Letter Stage 2 Remarks"
                  )
                ? "intimation_letter_2/send_remark"
                : "app_review/send_remark"
            }/${id}`,
          data:
            applicationStatus.includes(
              "Fill Intimation Letter Stage 1 Remarks"
            ) ||
            applicationStatus.includes("Fill Audit Plan Stage 1 Remarks") ||
            applicationStatus.includes(
              "Fill Intimation Letter Stage 2 Remarks"
            ) ||
            applicationStatus.includes("Fill Audit Plan Stage 2 Remarks")
              ? values
              : applicationStatus.includes(
                  "Fill Non conforimity Acceptance Stage 1"
                ) ||
                applicationStatus.includes("Fill Closure Acceptance Stage 1") ||
                applicationStatus.includes(
                  "Fill Non conforimity Acceptance Stage 2"
                ) ||
                applicationStatus.includes("Fill Closure Acceptance Stage 2")
              ? {
                  acceptance_status: values.acceptance_choice,
                }
              : applicationStatus.includes(
                  "Fill Non conformity Remarks Stage 1"
                ) ||
                applicationStatus.includes(
                  "Fill Non conformity Remarks Stage 2"
                )
              ? {
                  acceptance_status:
                    values.acceptance_choice === "1" ? "0" : "1",
                }
              : confModalOpen
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
        setFullModalOpen(false);
        setConfModalOpen(false);
        console.log(response);
        getApplicationDetails();
        setRemarks(null);
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

  const uploadFile = async (fileName) => {
    if (
      (fileName === "plan1" && !auditPlan1) ||
      (fileName === "report1" && !auditReport1) ||
      (fileName === "plan2" && !auditPlan2) ||
      (fileName === "report2" && !auditReport2)
    )
      return;

    const formData = new FormData();
    formData.append(
      fileName === "plan1"
        ? "audit_plan_url"
        : fileName === "plan2"
        ? "audit_plan_2_url"
        : fileName === "report1"
        ? "audit_report_url"
        : "audit_report_2_url",
      fileName === "plan1"
        ? auditPlan1
        : fileName === "plan2"
        ? auditPlan2
        : fileName === "report1"
        ? auditReport1
        : auditReport2
    );

    try {
      setUploading(true);
      const response = await axios({
        method:
          (fileName === "plan1" &&
            applicationStatus.includes("Audit Plan Stage 1")) ||
          (fileName === "report1" &&
            applicationStatus.includes("Audit Report Stage 1")) ||
          (fileName === "plan2" &&
            applicationStatus.includes("Audit Plan Stage 2")) ||
          (fileName === "report2" &&
            applicationStatus.includes("Audit Report Stage 2"))
            ? "put"
            : "post",
        url:
          BASE_URL +
          `/api/${
            fileName === "plan1"
              ? "audit_plan_1"
              : fileName === "plan2"
              ? "audit_plan_2"
              : fileName === "report1"
              ? "audit_report_1"
              : "audit_report_2"
          }/${
            (fileName === "plan1" &&
              applicationStatus.includes("Audit Plan Stage 1")) ||
            (fileName === "report1" &&
              applicationStatus.includes("Audit Report Stage 1")) ||
            (fileName === "plan2" &&
              applicationStatus.includes("Audit Plan Stage 2")) ||
            (fileName === "report2" &&
              applicationStatus.includes("Audit Report Stage 2"))
              ? "update"
              : "create"
          }/${id}`,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${state.token}`,
        },
      });
      console.log(response);
      setAlertType("success");
      setAlertMsg(
        response?.data?.msg ? response?.data?.msg : response?.data?.message
      );
      setOpen(true);
      getApplicationDetails();
    } catch (error) {
      setAlertType("error");
      setAlertMsg(error?.response?.data?.msg);
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const fileUrlResponse = await axios.get(
        BASE_URL + `/api/audit_plan_1/get/${id}`,
        {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        }
      );

      const fileUrl = fileUrlResponse.data?.audit_plan_url;
      const fileName = fileUrl.split("/").pop();

      const response = await axios.get(fileUrl, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      });

      const contentType =
        response.headers["content-type"] || "application/octet-stream";

      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: contentType })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const checkShowAudit = () => {
    if (
      applicationStatus.includes("Audit Program 14") ||
      applicationStatus.includes("Audit Program 9") ||
      applicationStatus.includes("Audit Program 45") ||
      applicationStatus.includes("Audit Program 914") ||
      applicationStatus.includes("Audit Program 1445") ||
      applicationStatus.includes("Audit Program 945") ||
      applicationStatus.includes("Audit Program 91445")
    )
      return true;
  };

  const checkAuditProgram = () => {
    if (checkShowAudit()) {
      if (applicationStatus.includes("Audit Program 14")) return "/14";
      else if (applicationStatus.includes("Audit Program 9")) return "/9";
      else if (applicationStatus.includes("Audit Program 45")) return "/45";
      else if (applicationStatus.includes("Audit Program 914")) return "/914";
      else if (applicationStatus.includes("Audit Program 1445")) return "/1445";
      else if (applicationStatus.includes("Audit Program 945")) return "/945";
      else if (applicationStatus.includes("Audit Program 91445"))
        return "/91445";
      else return "";
    } else if (applicationStatus.includes("Application Review")) {
      if (applicationStatus.includes("Fill Audit Program 14")) return "/14";
      else if (applicationStatus.includes("Fill Audit Program 9")) return "/9";
      else if (applicationStatus.includes("Fill Audit Program 45"))
        return "/45";
      else if (applicationStatus.includes("Fill Audit Program 914"))
        return "/914";
      else if (applicationStatus.includes("Fill Audit Program 1445"))
        return "/1445";
      else if (applicationStatus.includes("Fill Audit Program 945"))
        return "/945";
      else if (applicationStatus.includes("Fill Audit Program 91445"))
        return "/91445";
      else return "";
    }
    return "";
  };

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
              {applicationStatus.includes(
                "Audit Plan Stage 1 Acceptance Pending"
              )
                ? "Audit Plan Stage 1 Acceptance"
                : applicationStatus.includes("Audit Plan 2 Acceptance Pending")
                ? "Audit Plan 2 Acceptance"
                : "Send Remark"}
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
                  : applicationStatus.includes(
                      "Fill Non conformity Remarks Stage 1"
                    )
                  ? "Create Non conformity"
                  : applicationStatus.includes(
                      "Fill Non conforimity Acceptance Stage 1"
                    )
                  ? "Accept/Reject Non conformity"
                  : "Accept/Reject Closure"}
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
                  {applicationStatus.includes("Fill Quotation Choice") ||
                  applicationStatus.includes(
                    "Fill Non conformity Remarks Stage 1"
                  )
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
                  {applicationStatus.includes("Fill Quotation Choice") ||
                  applicationStatus.includes(
                    "Fill Non conformity Remarks Stage 1"
                  )
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
      <Modal
        open={fullModalOpen}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="modal">
            <button
              className="modal__close-btn"
              onClick={() => setFullModalOpen(false)}
            >
              &#9587;
            </button>
            <div className="modal__title">
              {applicationStatus.includes(
                "Audit Plan Stage 1 Acceptance Pending"
              )
                ? "Audit Plan Stage 1 Acceptance"
                : applicationStatus.includes("Audit Plan 2 Acceptance Pending")
                ? "Audit Plan Stage 2 Acceptance"
                : "Send Remark"}
            </div>
            <div className="input__container checkbox-container">
              <label>
                {applicationStatus.includes(
                  "Audit Plan Stage 1 Acceptance Pending"
                )
                  ? "Accept/Reject Audit Plan Stage 1"
                  : applicationStatus.includes(
                      "Audit Plan 2 Acceptance Pending"
                    )
                  ? "Accept/Reject Audit Plan 2"
                  : applicationStatus.includes(
                      "Fill Intimation Letter Stage 1 Remarks"
                    )
                  ? "Accept/Reject Intimation Letter Stage 1"
                  : applicationStatus.includes(
                      "Fill Intimation Letter Stage 2 Remarks"
                    )
                  ? "Accept/Reject Intimation Letter Stage 2"
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
      {dataLoading ? (
        <div className="center">
          <Spinner size={50} />
        </div>
      ) : (
        <div className="application__info">
          <h2>Application (ID : {id})</h2>
          <button
            className="add-btn"
            onClick={() => {
              getApplicationDetails();
              setRemarks(null);
            }}
          >
            Refresh
          </button>

          {/* Remark only modal */}
          {state.role === "Auditor" &&
            (applicationStatus.includes(
              "Fill Remarks for Application Review"
            ) ||
              applicationStatus.includes(
                "Fill Audit Report Stage 1 Remarks"
              )) && (
              <button className="add-btn" onClick={() => setModalOpen(true)}>
                {applicationStatus.includes("Fill Audit Report Stage 1 Remarks")
                  ? "Fill Audit Report Stage 1 Remarks"
                  : applicationStatus.includes(
                      "Audit Plan Stage 1 Acceptance Pending"
                    )
                  ? "Accept Audit Plan Stage 1"
                  : applicationStatus.includes(
                      "Audit Plan 2 Acceptance Pending"
                    )
                  ? "Accept Audit Plan 2"
                  : applicationStatus.includes("Fill Remarks for App Review")
                  ? "Fill Remarks for App Review"
                  : "Send Remark"}
              </button>
            )}

          {/* Yes/No modal */}
          {((state.role === "Admin Auditor" &&
            applicationStatus.includes("Fill Quotation Choice")) ||
            (state.role === "Auditor" &&
              (applicationStatus.includes(
                "Fill Non conformity Remarks Stage 1"
              ) ||
                applicationStatus.includes(
                  "Fill Closure Acceptance Stage 1"
                ))) ||
            (state.role === "Client" &&
              applicationStatus.includes(
                "Fill Non conforimity Acceptance Stage 1"
              ))) && (
            <button className="add-btn" onClick={() => setConfModalOpen(true)}>
              {applicationStatus.includes(
                "Fill Non conforimity Acceptance Stage 1"
              )
                ? "Fill Non conforimity Acceptance Stage 1"
                : applicationStatus.includes("Fill Quotation Choice")
                ? "Fill Quotation Choice"
                : applicationStatus.includes(
                    "Fill Non conformity Remarks Stage 1"
                  )
                ? "Fill Non Conformity Choice"
                : applicationStatus.includes("Fill Closure Acceptance Stage 1")
                ? "Fill Closure Acceptance Stage 1"
                : "Fill Choice"}
            </button>
          )}

          {/* Full Modal */}
          {(applicationStatus.includes(
            "Fill Intimation Letter Stage 1 Remarks"
          ) ||
            applicationStatus.includes(
              "Fill Intimation Letter Stage 2 Remarks"
            ) ||
            applicationStatus.includes("Fill Audit Plan Stage 1 Remarks") ||
            applicationStatus.includes("Fill Audit Plan Stage 2 Remarks")) && (
            <button className="add-btn" onClick={() => setFullModalOpen(true)}>
              {applicationStatus.includes(
                "Fill Intimation Letter Stage 1 Remarks"
              )
                ? "Fill Intimation letter Stage 1 Remarks"
                : applicationStatus.includes(
                    "Fill Intimation Letter Stage 2 Remarks"
                  )
                ? "Fill Intimation letter Stage 2 Remarks"
                : applicationStatus.includes("Fill Audit Plan Stage 1 Remarks")
                ? "Fill Audit Plan Stage 1 Remarks"
                : applicationStatus.includes("Fill Audit Plan Stage 2 Remarks")
                ? "Fill Audit Plan Stage 2 Remarks"
                : "Send Remarks"}
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
          {state.role !== "Auditor" &&
            !applicationStatus.includes("Application Form Incomplete") && (
              <div className="application_info-section">
                <NavLink to="application-form" className="link-without-style">
                  <button className="application__btn">
                    <img
                      src={
                        state.role === "Admin Auditor" &&
                        applicationStatus.length == 1
                          ? request
                          : view
                      }
                      alt="view"
                    />
                    <p>
                      {state.role === "Admin Auditor" &&
                      applicationStatus.length == 1
                        ? "Fill Application Ref ID"
                        : `${
                            applicationStatus.includes("Application Rejected")
                              ? "Update"
                              : "View"
                          } Application Form`}
                    </p>
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
          {((state.role === "Admin Auditor" && checkAuditProgram() !== "") ||
            checkShowAudit()) && (
            <div className="application_info-section">
              <NavLink
                to={`audit-program${checkAuditProgram()}`}
                className="link-without-style"
              >
                <button className="application__btn">
                  <img src={checkShowAudit() ? view : request} alt="view" />
                  <p>{`${
                    checkShowAudit() ? "View" : "Fill"
                  } Audit Program Form`}</p>
                </button>
              </NavLink>
              <button className="application__btn application__btn--green">
                <img src={print} alt="print" />
                <p>Print Audit Program Form</p>
              </button>
            </div>
          )}

          {/* Intimation Letter Stage 1 */}
          {((state.role === "Admin Auditor" &&
            applicationStatus.includes("Fill Intimation Letter Stage 1")) ||
            applicationStatus.includes("Intimation Letter Stage 1")) && (
            <div className="application_info-section">
              <NavLink to="intimation-letter-1" className="link-without-style">
                <button className="application__btn">
                  <img
                    src={
                      applicationStatus.includes("Intimation Letter Stage 1") &&
                      !(
                        state.role === "Admin Auditor" &&
                        applicationStatus.includes(
                          "Intimation Letter 1 Rejected"
                        )
                      )
                        ? view
                        : request
                    }
                    alt="view"
                  />
                  <p>{`${
                    state.role === "Admin Auditor" &&
                    applicationStatus.includes("Intimation Letter 1 Rejected")
                      ? "Update"
                      : applicationStatus.includes("Intimation Letter Stage 1")
                      ? "View"
                      : "Fill"
                  } Intimation Letter Stage 1 Form`}</p>
                </button>
              </NavLink>
              <button className="application__btn application__btn--green">
                <img src={print} alt="print" />
                <p>Print Intimation Letter Stage 1 Form</p>
              </button>
            </div>
          )}

          {/* Audit Plan Stage 1 */}
          {((state.role === "Admin Auditor" &&
            applicationStatus.includes("Audit Plan Stage 1")) ||
            (state.role === "Auditor" &&
              (applicationStatus.includes("Fill Audit Plan Stage 1") ||
                applicationStatus.includes("Audit Plan 1 rejected")))) && (
            <div>
              {applicationStatus.includes("Audit Plan Stage 1")
                ? "Update"
                : "Upload"}{" "}
              Audit Plan Stage 1
            </div>
          )}
          <div className="application_info-section">
            {((state.role === "Admin Auditor" &&
              applicationStatus.includes("Audit Plan Stage 1")) ||
              (state.role === "Auditor" &&
                (applicationStatus.includes("Fill Audit Plan Stage 1") ||
                  applicationStatus.includes("Audit Plan 1 rejected")))) && (
              <label className="application__btn" htmlFor="audit-plan-1-file">
                <img src={upload} alt="view" />
                <input
                  type="file"
                  id="audit-plan-1-file"
                  onChange={(e) => setAuditPlan1(e.target.files[0])}
                  accept="application/msword, application/pdf, .docx"
                />
              </label>
            )}
            {applicationStatus.includes("Audit Plan Stage 1") && (
              <button
                className="application__btn application__btn--green"
                onClick={handleDownload}
              >
                <img src={download} alt="print" />
                <p>Download Audit Plan stage 1 Form</p>
              </button>
            )}
          </div>
          {((state.role === "Admin Auditor" &&
            applicationStatus.includes("Audit Plan Stage 1")) ||
            (state.role === "Auditor" &&
              (applicationStatus.includes("Fill Audit Plan Stage 1") ||
                applicationStatus.includes("Audit Plan 1 rejected")))) && (
            <div>
              <button
                className="remarks-text add-btn pt-0"
                disabled={!auditPlan1}
                onClick={() => uploadFile("plan1")}
              >
                Upload
              </button>
            </div>
          )}

          {/* Audit Report Stage 1 */}
          {((state.role === "Admin Auditor" &&
            applicationStatus.includes("Audit Report Stage 1")) ||
            (state.role === "Auditor" &&
              (applicationStatus.includes("Fill Audit Report Stage 1") ||
                applicationStatus.includes(
                  "Audit Report Stage 1 Rejected"
                )))) && (
            <div>
              {applicationStatus.includes("Audit Report Stage 1")
                ? "Update"
                : "Upload"}{" "}
              Audit Report Stage 1
            </div>
          )}
          <div className="application_info-section">
            {((state.role === "Admin Auditor" &&
              applicationStatus.includes("Audit Report Stage 1")) ||
              (state.role === "Auditor" &&
                (applicationStatus.includes("Fill Audit Report Stage 1") ||
                  applicationStatus.includes(
                    "Audit Report Stage 1 Rejected"
                  )))) && (
              <label className="application__btn" htmlFor="audit-report-1-file">
                <img src={upload} alt="view" />
                <input
                  type="file"
                  id="audit-report-1-file"
                  onChange={(e) => setAuditReport1(e.target.files[0])}
                  accept="application/msword, application/pdf, .docx"
                />
              </label>
            )}
            {applicationStatus.includes("Audit Report Stage 1") && (
              <button
                className="application__btn application__btn--green"
                onClick={handleDownload}
              >
                <img src={download} alt="print" />
                <p>Download Audit Report stage 1 Form</p>
              </button>
            )}
          </div>
          {((state.role === "Admin Auditor" &&
            applicationStatus.includes("Audit Report Stage 1")) ||
            (state.role === "Auditor" &&
              (applicationStatus.includes("Fill Audit Report Stage 1") ||
                applicationStatus.includes(
                  "Audit Report Stage 1 Rejected"
                )))) && (
            <div>
              <button
                className="remarks-text add-btn pt-0"
                disabled={!auditReport1}
                onClick={() => uploadFile("report1")}
              >
                Upload
              </button>
            </div>
          )}

          <>
            {/* {((state.role === "Admin Auditor" &&
            applicationStatus.includes("Intimation Letter 1")) ||
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
          )} */}

            {/* {((state.role === "Auditor" &&
            applicationStatus.includes("Audit Plan Stage 1 Accepted")) ||
            applicationStatus.includes("Audit Report Stage 1")) && (
            <div className="application_info-section">
              <NavLink to="audit-report-stage-1" className="link-without-style">
                <button className="application__btn">
                  <img
                    src={
                      applicationStatus.includes("Non Confirmities Raised") ||
                      applicationStatus.includes("Audit Report Stage 1")
                        ? view
                        : request
                    }
                    alt="view"
                  />
                  <p>{`${
                    applicationStatus.includes("Non Confirmities Raised") ||
                    applicationStatus.includes("Audit Report Stage 1")
                      ? "View"
                      : "Fill"
                  } Audit Report Stage 1 Form`}</p>
                </button>
              </NavLink>
              <button className="application__btn application__btn--green">
                <img src={print} alt="print" />
                <p>Print Audit Program 1 Form</p>
              </button>
            </div>
          )} */}
          </>

          {/* Non confirmities 1 */}
          {((state.role === "Admin Auditor" &&
            applicationStatus.includes("Form 39B Stage 1")) ||
            ((state.role === "Auditor" || state.role === "Client") &&
              (applicationStatus.includes("Fill Form 39B Stage 1") ||
                applicationStatus.includes("Update Form 39B Stage 1") ||
                applicationStatus.includes("Form 39B Stage 1")))) && (
            <div className="application_info-section">
              <NavLink
                to="corrective-action-report"
                className="link-without-style"
              >
                <button className="application__btn">
                  <img
                    src={
                      !applicationStatus.includes("Fill Form 39B Stage 1") &&
                      !applicationStatus.includes("Update Form 39B Stage 1")
                        ? view
                        : request
                    }
                    alt="view"
                  />
                  <p>{`${
                    !applicationStatus.includes("Fill Form 39B Stage 1") &&
                    !applicationStatus.includes("Update Form 39B Stage 1")
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
            applicationStatus.includes("Fill Intimation Letter Stage 2")) ||
            applicationStatus.includes("Intimation Letter Stage 2")) && (
            <div className="application_info-section">
              <NavLink to="intimation-letter-2" className="link-without-style">
                <button className="application__btn">
                  <img
                    src={
                      applicationStatus.includes("Intimation Letter Stage 2") &&
                      (!applicationStatus.includes(
                        "Intimation Letter 2 Rejected"
                      ) ||
                        state.role !== "Admin Auditor")
                        ? view
                        : request
                    }
                    alt="view"
                  />
                  <p>{`${
                    state.role === "Admin Auditor" &&
                    applicationStatus.includes("Intimation Letter 2 Rejected")
                      ? "Update"
                      : applicationStatus.includes("Intimation Letter Stage 2")
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

          {/* Audit Plan Stage 2 */}
          {((state.role === "Admin Auditor" &&
            applicationStatus.includes("Audit Plan Stage 2")) ||
            (state.role === "Auditor" &&
              (applicationStatus.includes("Fill Audit Plan Stage 2") ||
                applicationStatus.includes("Audit Plan 2 rejected")))) && (
            <div>
              {applicationStatus.includes("Audit Plan Stage 2")
                ? "Update"
                : "Upload"}{" "}
              Audit Plan Stage 2
            </div>
          )}
          <div className="application_info-section">
            {((state.role === "Admin Auditor" &&
              applicationStatus.includes("Audit Plan Stage 2")) ||
              (state.role === "Auditor" &&
                (applicationStatus.includes("Fill Audit Plan Stage 2") ||
                  applicationStatus.includes("Audit Plan 2 rejected")))) && (
              <label className="application__btn" htmlFor="audit-plan-2-file">
                <img src={upload} alt="view" />
                <input
                  type="file"
                  id="audit-plan-2-file"
                  onChange={(e) => setAuditPlan2(e.target.files[0])}
                  accept="application/msword, application/pdf, .docx"
                />
              </label>
            )}
            {applicationStatus.includes("Audit Plan Stage 2") && (
              <button
                className="application__btn application__btn--green"
                onClick={handleDownload}
              >
                <img src={download} alt="print" />
                <p>Download Audit Plan stage 2 Form</p>
              </button>
            )}
          </div>
          {((state.role === "Admin Auditor" &&
            applicationStatus.includes("Audit Plan Stage 2")) ||
            (state.role === "Auditor" &&
              (applicationStatus.includes("Fill Audit Plan Stage 2") ||
                applicationStatus.includes("Audit Plan 2 rejected")))) && (
            <div>
              <button
                className="remarks-text add-btn pt-0"
                disabled={!auditPlan2}
                onClick={() => uploadFile("plan2")}
              >
                Upload
              </button>
            </div>
          )}

          {/* Audit Report Stage 2 */}
          {((state.role === "Admin Auditor" &&
            applicationStatus.includes("Audit Report Stage 2")) ||
            (state.role === "Auditor" &&
              (applicationStatus.includes("Fill Audit Report Stage 2") ||
                applicationStatus.includes(
                  "Audit Report Stage 2 Rejected"
                )))) && (
            <div>
              {applicationStatus.includes("Audit Report Stage 2")
                ? "Update"
                : "Upload"}{" "}
              Audit Report Stage 2
            </div>
          )}
          <div className="application_info-section">
            {((state.role === "Admin Auditor" &&
              applicationStatus.includes("Audit Report Stage 2")) ||
              (state.role === "Auditor" &&
                (applicationStatus.includes("Fill Audit Report Stage 2") ||
                  applicationStatus.includes(
                    "Audit Report Stage 2 Rejected"
                  )))) && (
              <label className="application__btn" htmlFor="audit-report-2-file">
                <img src={upload} alt="view" />
                <input
                  type="file"
                  id="audit-report-2-file"
                  onChange={(e) => setAuditReport2(e.target.files[0])}
                  accept="application/msword, application/pdf, .docx"
                />
              </label>
            )}
            {applicationStatus.includes("Audit Report Stage 2") && (
              <button
                className="application__btn application__btn--green"
                onClick={handleDownload}
              >
                <img src={download} alt="print" />
                <p>Download Audit Report stage 2 Form</p>
              </button>
            )}
          </div>
          {((state.role === "Admin Auditor" &&
            applicationStatus.includes("Audit Report Stage 2")) ||
            (state.role === "Auditor" &&
              (applicationStatus.includes("Fill Audit Report Stage 2") ||
                applicationStatus.includes(
                  "Audit Report Stage 2 Rejected"
                )))) && (
            <div>
              <button
                className="remarks-text add-btn pt-0"
                disabled={!auditReport2}
                onClick={() => uploadFile("report2")}
              >
                Upload
              </button>
            </div>
          )}

          <>
            {/* {((state.role === "Auditor" &&
              applicationStatus.includes("Fill Audit Plan Stage 2")) ||
              applicationStatus.includes("Audit Plan Stage 2")) && (
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

            {((state.role === "Auditor" &&
              applicationStatus.includes("Audit Plan 2 Accepted")) ||
              applicationStatus.includes("Audit Report 2")) && (
              <div className="application_info-section">
                <NavLink
                  to="audit-report-stage-2"
                  className="link-without-style"
                >
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
            )} */}
          </>

          {/* Non confirmities 2 */}
          {((state.role === "Admin Auditor" &&
            applicationStatus.includes("Form 39B Stage 2")) ||
            ((state.role === "Auditor" || state.role === "Client") &&
              (applicationStatus.includes("Fill Form 39B Stage 2") ||
                applicationStatus.includes("Update Form 39B Stage 2") ||
                applicationStatus.includes("Form 39B Stage 2")))) && (
            <div className="application_info-section">
              <NavLink
                to="corrective-action-report-2"
                className="link-without-style"
              >
                <button className="application__btn">
                  <img
                    src={
                      !applicationStatus.includes("Fill Form 39B Stage 2") &&
                      !applicationStatus.includes("Update Form 39B Stage 2")
                        ? view
                        : request
                    }
                    alt="view"
                  />
                  <p>{`${
                    !applicationStatus.includes("Fill Form 39B Stage 2") &&
                    !applicationStatus.includes("Update Form 39B Stage 2")
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
              applicationStatus.includes("Audit Report Stage 1 ihi")) && (
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

          {!remarks &&
            ((state.role === "Admin Auditor" &&
              ((applicationStatus.includes("Application Reviewer Remarks") &&
                !applicationStatus.includes("Intimation Letter 1")) ||
                applicationStatus.includes(
                  "Intimation Letter Stage 1 Remarks"
                ) ||
                applicationStatus.includes("Audit Plan Stage 1 Remarks") ||
                applicationStatus.includes("Audit Plan Stage 2 Remarks") ||
                applicationStatus.includes(
                  "Audit Report Stage 1 Remarks by Application Reviewer"
                ) ||
                applicationStatus.includes(
                  "Intimation Letter Stage 2 Remarks"
                ))) ||
              (state.role === "Auditor" &&
                (applicationStatus.includes("Audit Plan Stage 1 Remarks") ||
                  applicationStatus.includes("Audit Plan Stage 2 Remarks") ||
                  applicationStatus.includes(
                    "Audit Report Stage 1 Remarks by Application Reviewer"
                  ) ||
                  applicationStatus.includes(
                    "Audit Report Stage 2 Remarks by Application Reviewer"
                  ) ||
                  applicationStatus.includes("Application Review Remarks") ||
                  applicationStatus.includes(
                    "Intimation Letter Stage 1 Remarks"
                  ) ||
                  applicationStatus.includes(
                    "Intimation Letter Stage 2 Remarks"
                  ))) ||
              (state.role === "Client" &&
                (applicationStatus.includes(
                  "Intimation Letter Stage 1 Remarks"
                ) ||
                  applicationStatus.includes(
                    "Intimation Letter Stage 2 Remarks"
                  )))) && (
              <button className="remarks-text add-btn" onClick={getRemarks}>
                Show Remarks
              </button>
            )}
          {remarks?.length > 0 && (
            <>
              <h3 className="remarks-head">Remarks</h3>
              <ul className="remarks-list">
                {remarks.map((remark) => (
                  <li className="remarks-remark" key={remark.id}>
                    Remark : {remark?.remark} &nbsp; | &nbsp; Sender :{" "}
                    {remark?.sender_name
                      ? remark?.sender_name
                      : applicationStatus.includes(
                          "Audit Plan Stage 1 Remarks"
                        ) &&
                        !applicationStatus.includes(
                          "Audit Report Stage 1 Remarks by Application Reviewer"
                        )
                      ? "Client"
                      : "Auditor"}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ApplicationInfo;
