import React, { useContext, useEffect, useState } from "react";
import { correctiveActionReportFormSchema } from "../validation/formSchema";
import { changedDivisions } from "./ApplicationFormHelper";
import { useFormik } from "formik";
import "./styles/registration.scss";
import "./styles/checkbox.scss";
import Spinner from "./Spinner";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const inputs = {
  car_no: "CAR No.",
  date: "Date",
  company: "Company / Process",
  standard: "Standard",
  clause: "Clause",
  category: "Category: Major/Minor",
  non_conf_obs: "Nonconformity Observed (incl. objective evidence):",
  auditor_sign: "Auditor Signature",
  auditee_accep: "Auditee Acceptance",
  root_cause: "Root Cause analysis",
  corton: "Correction",
  cortve_actn: "Corrective action",
  responsibility: "Responsibility",
  prop_impl_date: "Proposed Implementation Date",
  cortve_atn_pln: "Corrective Action Plan: Accepted/Rejected",
  assessed_by_1: "Assessed By",
  date_1: "Date",
  verifi_onsite:
    "Verification of Onsite Closure (to be verified in the next assessment cycle)",
  assessed_by_2: "Assessed By",
  date_2: "Date",
};

const initialValues = {
  car_no: "",
  date: "",
  company: "",
  standard: "",
  clause: "",
  category: "",
  non_conf_obs: "",
  auditor_sign: "",
  auditee_accep: "",
  root_cause: "",
  corton: "",
  cortve_actn: "",
  responsibility: "",
  prop_impl_date: "",
  cortve_atn_pln: "",
  assessed_by_1: "",
  date_1: "",
  verifi_onsite: "",
  assessed_by_2: "",
  date_2: "",
};

const CorrectiveActionReport = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMsg, setAlertMsg] = useState("");
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { state } = useContext(AuthContext);
  const id = pathname.slice(13).slice(0, -25);
  const [initialForm, setInitialForm] = useState(initialValues);

  const getFormDetails = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${state.token}` },
      };
      const res = await axios.get(
        BASE_URL + `/api/audit_report_1/get_non_conformity/${id}`,
        config
      );
      console.log(res?.data);
      setInitialForm(res?.data);
      setFormSubmitted(true);
    } catch (error) {
      console.log(error?.response?.data?.msg);
    }
    setFormLoading(false);
  };

  useEffect(() => {
    getFormDetails();
  }, []);

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    dirty,
    setValues,
  } = useFormik({
    initialValues: initialForm,
    validationSchema: correctiveActionReportFormSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      console.log(values);
      if (!dirty) {
        console.log("form unchanged");
        return;
      }
      setIsLoading(true);

      const formValues = values;

      try {
        const response = await axios({
          method: formSubmitted ? "put" : "post",
          url:
            BASE_URL +
            `/api/audit_report_1/${
              formSubmitted
                ? `update_non_conformity`
                : state.role === "Auditor"
                ? `create_non_conformity_auditor`
                : "create_non_conformity_client"
            }/${id}`,
          data: formValues,
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        });
        setAlertType("success");
        setAlertMsg("Form Submitted Successfully");
        setOpen(true);
        setTimeout(() => {
          navigate(-1);
        }, 3000);
      } catch (error) {
        setAlertType("error");
        setAlertMsg(error?.response?.data?.msg);
        setOpen(true);
        console.log(error?.response?.data?.msg);
      }
      setIsLoading(false);
    },
  });

  return (
    <>
      {formLoading ? (
        <div className="center">
          <Spinner size={50} />
        </div>
      ) : (
        <div className="registration">
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
          <form onSubmit={handleSubmit}>
            <div className="registration__form">
              <h2 className="form-sub-title">Corrective Action Report Form</h2>

              <fieldset disabled={state.role === "Admin Auditor"}>
                {Object.keys(inputs).map((key, index) => (
                  <div className="input__container" key={key}>
                    <label htmlFor={key}>{`${inputs[key]} :`}</label>
                    <input
                      type={
                        index === 7
                          ? "file"
                          : [1, 16, 19].includes(index)
                          ? "date"
                          : "text"
                      }
                      name={key}
                      id={key}
                      value={values[key]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={`Enter ${inputs[key]}`}
                    />
                    <div className="input__error-container">
                      {errors[key] || touched[key] ? (
                        <p className="input__error">{errors[key]}</p>
                      ) : null}
                    </div>
                  </div>
                ))}

                {/* <div className="input__container">
                  <label htmlFor="auditor_sign">Auditor Signature :</label>
                  <input
                    type="file"
                    name="auditor_sign"
                    id="auditor_sign"
                    value={values.sign_otabu}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <div className="input__error-container">
                    {errors.auditor_sign && touched.auditor_sign ? (
                      <p className="input__error">{errors.auditor_sign}</p>
                    ) : null}
                  </div>
                </div> */}
              </fieldset>

              {/* Submit */}
              {(state.role === "Auditor" || state.role === "Client") && (
                <div className="input__container">
                  <button
                    className="registration__submit"
                    type="submit"
                    onClick={handleSubmit}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Spinner size={25} color="white" />
                    ) : formSubmitted ? (
                      "Update"
                    ) : (
                      "Submit"
                    )}
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default CorrectiveActionReport;
