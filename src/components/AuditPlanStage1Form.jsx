import React, { useContext, useEffect, useState } from "react";
import { auditPlanStage1FormSchema } from "../validation/formSchema";
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

const CommonInputs = {
  client: "Client",
  audit_date: "Audit Date",
  standard: "Standard",
  location: "Location",
  type_of_assessment: "Type of Assessment",
  client_rep: "Client Rep",
  temp_site_1: "Temp Sites 1",
  temp_site_2: "Temp Sites 2",
  audit_duration: "Audit Duration",
  lead_auditor: "Lead Auditor",
  additional_auditors: "Additional Auditor",
  scope: "Scope of Certification",
};

const Columns = {
  LeadAuditorRes: "Lead Auditor/Team Leader Responsibilities",
  TeamMemberrRes: "Team Member Responsibilities",
  ObserversRes: "Observers/Interpreters Responsibilities",
  CompletedRes: "Completed (Y/N)",
};

const Rows = {
  opening_meeting:
    "Opening meeting -Introduction -Explain about audit process Verified Business, Marketing & Sales Process",
  visit_of_depts:
    "Visit of departments: Verify scope related aspects on Plant Visit",
  documentation:
    "QMS, OH&S, EMS documentation Document review, Documentation requirements & control",
  resource_manage:
    "Resource Management:Recruitment process Training process Individual's record, & Safety measures and maintenance",
  interview_top_manage:
    "Interview Top Management & MR: • Confirm organization details, • Related statutory, regulatory and contractual aspects and compliance to be identified and/or reviewed • Identify any changes to systems people and processes • Assess the effectiveness of Objectives • Determine if the requirements of the Standard(s) are understood Interview with Top Management, Worker Represntative, Person who look the monitoring of Health & Safety of Staff, Mid Level Managements, Low Level Workers and Any contractors ",
  mr_activities: "MR activities: MRM/IQA/CAPA/Analysis of Data",
  risk_manage:
    "Risk Management QMS, Aspect/Impact Analysis & Risk Analysis HIRA & Opportunities of QMS, EMS, OHS",
  emergency: "Emergency Preparedness Plan & response",
  productions: "Productions/Services Provision",
  maintenance_record: "Maintenance Record",
};

const initialValues = {
  AuditPlan: {
    client: "",
    audit_date: "",
    standard: "",
    location: "",
    type_of_assessment: "",
    client_rep: "",
    temp_site_1: "",
    temp_site_2: "",
    audit_duration: "",
    lead_auditor: "",
    additional_auditors: "",
    scope: "",
    temp_site: "",
  },
  LeadAuditorRes: {
    opening_meeting: "",
    visit_of_depts: "",
    documentation: "",
    resource_manage: "",
    interview_top_manage: "",
    mr_activities: "",
    risk_manage: "",
    emergency: "",
    productions: "",
    maintenance_record: "",
  },
  TeamMemberrRes: {
    opening_meeting: "",
    visit_of_depts: "",
    documentation: "",
    resource_manage: "",
    interview_top_manage: "",
    mr_activities: "",
    risk_manage: "",
    emergency: "",
    productions: "",
    maintenance_record: "",
  },
  ObserversRes: {
    opening_meeting: "",
    visit_of_depts: "",
    documentation: "",
    resource_manage: "",
    interview_top_manage: "",
    mr_activities: "",
    risk_manage: "",
    emergency: "",
    productions: "",
    maintenance_record: "",
  },
  CompletedRes: {
    opening_meeting: "No",
    visit_of_depts: "No",
    documentation: "No",
    resource_manage: "No",
    interview_top_manage: "No",
    mr_activities: "No",
    risk_manage: "No",
    emergency: "No",
    productions: "No",
    maintenance_record: "No",
  },
};

const AuditProgramStage1Form = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMsg, setAlertMsg] = useState("");
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { state } = useContext(AuthContext);
  const id = pathname.slice(13).slice(0, -19);
  const [initialForm, setInitialForm] = useState(initialValues);

  const getFormDetails = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${state.token}` },
      };
      const res = await axios.get(
        BASE_URL + `/api/audit_plan/get/${id}`,
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
    validationSchema: auditPlanStage1FormSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      console.log(values);
      if (!dirty) {
        console.log("form unchanged");
        return;
      }
      setIsLoading(true);

      const formValues = formSubmitted
        ? changedDivisions(initialForm, values)
        : values;

      try {
        const response = await axios({
          method: formSubmitted ? "patch" : "post",
          url:
            BASE_URL +
            `/api/audit_plan/${
              formSubmitted ? "partial_update" : "create"
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
              <h2 className="form-sub-title">Audit Plan 1 Form</h2>

              <fieldset
                disabled={
                  state.role === "Client" || state.role === "Admin Auditor"
                }
              >
                {Object.keys(CommonInputs).map((key, index) => (
                  <div className="input__container" key={key}>
                    <label htmlFor={key}>{`${CommonInputs[key]} :`}</label>
                    <input
                      type={index === 1 ? "date" : "text"}
                      name={`AuditPlan.${key}`}
                      id={key}
                      value={values.AuditPlan[key]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={`Enter ${CommonInputs[key]}`}
                    />
                    <div className="input__error-container">
                      {errors.AuditPlan?.[key] || touched.AuditPlan?.[key] ? (
                        <p className="input__error">
                          {errors.AuditPlan?.[key]}
                        </p>
                      ) : null}
                    </div>
                  </div>
                ))}

                <div className="input__container checkbox-container">
                  <label>
                    Temporary Site Include if find in scope Installation,
                    Commissioning, Contracting Services, Waste Collection etc. :
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="radio"
                      name="AuditPlan.temp_site"
                      value="Yes"
                      checked={values.AuditPlan?.temp_site === "Yes"}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <p>Yes</p>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="radio"
                      name="AuditPlan.temp_site"
                      value="No"
                      checked={values.AuditPlan?.temp_site === "No"}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <p>No</p>
                  </label>
                  <div className="input__error-container">
                    {errors.AuditPlan?.temp_site ||
                    touched.AuditPlan?.temp_site ? (
                      <p className="input__error">
                        {errors.AuditPlan?.temp_site}
                      </p>
                    ) : null}
                  </div>
                </div>
                <h2 className="form-sub-title"></h2>
                <>
                  <div className="input__container">
                    <table className="table-form">
                      <thead>
                        <tr>
                          <th></th>
                          {Object.keys(Columns).map((columnKey, index) => (
                            <th key={columnKey}>{Columns[columnKey]}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(Rows).map((rowKey) => (
                          <tr key={rowKey} className="table-row">
                            <th className="row-head">{Rows[rowKey]}</th>
                            {Object.keys(Columns).map((columnKey, index) => (
                              <td key={`${rowKey}-${columnKey}`}>
                                {index === 3 ? (
                                  <label className="checkbox-label input-small">
                                    <input
                                      type="checkbox"
                                      name={`${columnKey}.${rowKey}`}
                                      checked={
                                        values?.[columnKey]?.[rowKey] === "Yes"
                                      }
                                      onChange={(e) =>
                                        setFieldValue(
                                          `${columnKey}.${rowKey}`,
                                          e.target.checked ? "Yes" : "No"
                                        )
                                      }
                                      onBlur={handleBlur}
                                    />
                                  </label>
                                ) : (
                                  <input
                                    type="text"
                                    name={`${columnKey}.${rowKey}`}
                                    value={values?.[columnKey]?.[rowKey]}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                  />
                                )}
                                {touched?.[columnKey]?.[rowKey] &&
                                  errors?.[columnKey]?.[rowKey] && (
                                    <div>{errors[columnKey][rowKey]}</div>
                                  )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              </fieldset>

              {/* Submit */}

              {state.role === "Auditor" && (
                <div className="input__container">
                  <button
                    className="registration__submit"
                    type="submit"
                    onClick={handleSubmit}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Spinner size={25} color="white" />
                    ) : formSubmitted && state.role !== "Client" ? (
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

export default AuditProgramStage1Form;
