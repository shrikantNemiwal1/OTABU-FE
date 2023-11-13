import { useContext, useEffect, useState } from "react";
import { auditPlanStage2FormSchema } from "../validation/formSchema";
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
  audit_date: "Audit Date(s)",
  standard: "Standard(s)",
  location: "Location",
  type_of_assessment: "Type of Assessment",
  client_rep: "Client Rep",
  temp_site_1: "Temp Sites 1",
  temp_site_2: "Temp Sites 2",
  audit_duration: "Audit Duration",
  lead_auditor: "Lead Auditor",
  additional_auditors: "Additional Auditor(s)",
  scope: "Scope of Certification",
};

const Columns = {
  LeadAuditorRes2: "Lead Auditor/Team Leader Responsibilities",
  TeamMemberrRes2: "Team Member Responsibilities",
  ObserversRes2: "Observer Responsibilities",
  Auditee2: "Auditee Name(s) / Department",
  CompletedRes2: "Completed (Y/N)",
};

const Rows = {
  opening_meeting: "Opening Meeting",
  site_tour: "Site Tour/Factory visit",
  top_manage: "Top Management/Management System Co-Coordinator",
  documentation: "Documentation",
  marketing: "Marketing / Business Development",
  maintenance: "Maintenance",
  hr: "HR",
  purchase: "Purchase/Store",
  production_qual: "Production & Quality",
  report_prep: "Report preparation",
  closing_meet: "Closing Meeting",
};

const initialValues = {
  AuditPlan2: {
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
  },

  LeadAuditorRes2: {
    opening_meeting: "",
    site_tour: "",
    top_manage: "",
    documentation: "",
    marketing: "",
    maintenance: "",
    hr: "",
    purchase: "",
    production_qual: "",
    report_prep: "",
    closing_meet: "",
  },

  TeamMemberrRes2: {
    opening_meeting: "",
    site_tour: "",
    top_manage: "",
    documentation: "",
    marketing: "",
    maintenance: "",
    hr: "",
    purchase: "",
    production_qual: "",
    report_prep: "",
    closing_meet: "",
  },

  ObserversRes2: {
    opening_meeting: "",
    site_tour: "",
    top_manage: "",
    documentation: "",
    marketing: "",
    maintenance: "",
    hr: "",
    purchase: "",
    production_qual: "",
    report_prep: "",
    closing_meet: "",
  },

  Auditee2: {
    opening_meeting: "",
    site_tour: "",
    top_manage: "",
    documentation: "",
    marketing: "",
    maintenance: "",
    hr: "",
    purchase: "",
    production_qual: "",
    report_prep: "",
    closing_meet: "",
  },

  CompletedRes2: {
    opening_meeting: "No",
    site_tour: "No",
    top_manage: "No",
    documentation: "No",
    marketing: "No",
    maintenance: "No",
    hr: "No",
    purchase: "No",
    production_qual: "No",
    report_prep: "No",
    closing_meet: "No",
  },
};

const AuditPlanStage2Form = () => {
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
        BASE_URL + `/api/audit_plan_2/get/${id}`,
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
  } = useFormik({
    initialValues: initialForm,
    validationSchema: auditPlanStage2FormSchema,
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
            `/api/audit_plan_2/${
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
              <h2 className="form-sub-title">Audit Plan 2 Form</h2>

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
                      name={`AuditPlan2.${key}`}
                      id={key}
                      value={values.AuditPlan2[key]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={`Enter ${CommonInputs[key]}`}
                    />
                    <div className="input__error-container">
                      {errors.AuditPlan2?.[key] || touched.AuditPlan2?.[key] ? (
                        <p className="input__error">
                          {errors.AuditPlan2?.[key]}
                        </p>
                      ) : null}
                    </div>
                  </div>
                ))}

                <h2 className="form-sub-title"></h2>
                <>
                  <div className="input__container">
                    <table className="table-form">
                      <thead>
                        <tr>
                          <th>Process/Function</th>
                          {Object.keys(Columns).map((columnKey) => (
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
                                {index === 4 ? (
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

export default AuditPlanStage2Form;
