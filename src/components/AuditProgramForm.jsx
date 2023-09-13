import React, { useContext, useEffect, useState } from "react";
import { auditProgramFormSchema } from "../validation/formSchema";
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

const AuditProgramInputs = {
  org_name: "Name of Organization",
  address: "Address",
  scope: "Scope",
  standard: "Standard",
  sites_2b_audited: "Sites to be audited",
  certi_audit: "Certification Audit",
  surveillance_audit: "Surveillance Audit",
};

const ProcessColumns = {
  man_days: "Man-days",
  date_of_planning: "Date of Planning",
  lead_auditor: "Lead Auditor",
  auditor: "Auditor",
  technical_expert: "Technical Expert",
};

const ProcessRows = {
  ProcessStage1: "Stage 1",
  ProcessStage2: "Stage 2",
  ProcessSurveillance1: "Surveillance 1",
  ProcessSurveillance2: "Surveillance 2",
  ProcessRenewal: "Renewal",
};

const colKeys = {
  stage1: "Stage 1",
  stage2: "Stage 2",
  sa1: "SA-1",
  sa2: "SA-2",
  renewal: "Renewal",
};

const rowKeys = {
  TopManagePolicyImprove:
    "Top Management Policy & Objectives Continual Improvement",
  QMSDocConOrgRiskIntMRM:
    "QMS Documentation, Context of Organization, Risk, Internal Audit & MRM",
  HRTrainWork: "HR & Training Competence, & Work",
  MarketCustReqFeedback:
    "Marketing Customer Requirements, Feedback/ Complaint/ Satisfaction",
  ProductionQAMaintAnalyCA:
    "Production, QA & Maintenance Calibration, Data Analysis & CA",
  PurchaseStoresDispatch: "Purchase, Stores & Dispatch",
  UseOfLogo: "Use of Logo",
};

const initialValues = {
  AuditProgram: {
    org_name: "",
    address: "",
    scope: "",
    standard: "",
    sites_2b_audited: "",
    certi_audit: "",
    surveillance_audit: "",
  },

  ProcessStage1: {
    man_days: "",
    date_of_planning: "",
    lead_auditor: "",
    auditor: "",
    technical_expert: "",
  },

  ProcessStage2: {
    man_days: "",
    date_of_planning: "",
    lead_auditor: "",
    auditor: "",
    technical_expert: "",
  },

  ProcessSurveillance1: {
    man_days: "",
    date_of_planning: "",
    lead_auditor: "",
    auditor: "",
    technical_expert: "",
  },

  ProcessSurveillance2: {
    man_days: "",
    date_of_planning: "",
    lead_auditor: "",
    auditor: "",
    technical_expert: "",
  },

  ProcessRenewal: {
    man_days: "",
    date_of_planning: "",
    lead_auditor: "",
    auditor: "",
    technical_expert: "",
  },

  TopManagePolicyImprove: {
    stage1: "No",
    stage2: "No",
    sa1: "No",
    sa2: "No",
    renewal: "No",
  },

  QMSDocConOrgRiskIntMRM: {
    stage1: "No",
    stage2: "No",
    sa1: "No",
    sa2: "No",
    renewal: "No",
  },

  HRTrainWork: {
    stage1: "No",
    stage2: "No",
    sa1: "No",
    sa2: "No",
    renewal: "No",
  },

  MarketCustReqFeedback: {
    stage1: "No",
    stage2: "No",
    sa1: "No",
    sa2: "No",
    renewal: "No",
  },

  ProductionQAMaintAnalyCA: {
    stage1: "No",
    stage2: "No",
    sa1: "No",
    sa2: "No",
    renewal: "No",
  },

  PurchaseStoresDispatch: {
    stage1: "No",
    stage2: "No",
    sa1: "No",
    sa2: "No",
    renewal: "No",
  },

  UseOfLogo: {
    stage1: "No",
    stage2: "No",
    sa1: "No",
    sa2: "No",
    renewal: "No",
  },
};

const AuditProgramForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMsg, setAlertMsg] = useState("");
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { state } = useContext(AuthContext);
  const id = pathname.slice(13).slice(0, -14);
  const [initialForm, setInitialForm] = useState(initialValues);

  const getFormDetails = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${state.token}` },
      };
      const res = await axios.get(
        BASE_URL + `/api/audit_program/get/${id}`,
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
    validationSchema: auditProgramFormSchema,
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
            `/api/audit_program/${
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
              <h2 className="form-sub-title">Audit Program Form</h2>

              <fieldset disabled={state.role === "Client"}>
                {Object.keys(AuditProgramInputs).map((key, index) => (
                  <div className="input__container" key={key}>
                    <label
                      htmlFor={key}
                    >{`${AuditProgramInputs[key]} :`}</label>
                    <input
                      type={index === 5 || index === 6 ? "date" : "text"}
                      name={`AuditProgram.${key}`}
                      id={key}
                      value={values.AuditProgram[key]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={`Enter ${AuditProgramInputs[key]}`}
                    />
                    <div className="input__error-container">
                      {errors.AuditProgram?.[key] ||
                      touched.AuditProgram?.[key] ? (
                        <p className="input__error">
                          {errors.AuditProgram?.[key]}
                        </p>
                      ) : null}
                    </div>
                  </div>
                ))}

                <>
                  <div className="input__container">
                    <table className="table-form">
                      <thead>
                        <tr>
                          <th></th>
                          {Object.keys(ProcessColumns).map(
                            (columnKey, index) => (
                              <th
                                className={index === 0 ? "input-small" : ""}
                                key={columnKey}
                              >
                                {ProcessColumns[columnKey]}
                              </th>
                            )
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(ProcessRows).map((rowKey) => (
                          <tr key={rowKey} className="table-row">
                            <th className="row-head">{ProcessRows[rowKey]}</th>
                            {Object.keys(ProcessColumns).map(
                              (columnKey, index) => (
                                <td key={`${rowKey}-${columnKey}`}>
                                  <input
                                    type={
                                      index === 0
                                        ? "tel"
                                        : index === 1
                                        ? "date"
                                        : "text"
                                    }
                                    className={
                                      index === 0
                                        ? "input-small"
                                        : index == 1
                                        ? "font-small"
                                        : ""
                                    }
                                    name={`${rowKey}.${columnKey}`}
                                    value={values?.[rowKey]?.[columnKey]}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    onKeyDown={(e) => {
                                      if (!index) {
                                        const key = e.key;
                                        if (
                                          !/^\d$/.test(key) &&
                                          key !== "Backspace" &&
                                          key !== "Delete"
                                        ) {
                                          e.preventDefault();
                                        }
                                      }
                                    }}
                                  />
                                  {touched?.[rowKey]?.[columnKey] &&
                                    errors?.[rowKey]?.[columnKey] && (
                                      <div>{errors[rowKey][columnKey]}</div>
                                    )}
                                </td>
                              )
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>

                <>
                  <h3 className="form-sub-title"></h3>

                  <div className="input__container">
                    <table className="table-form">
                      <thead>
                        <tr>
                          <th className="row-head-big"></th>
                          {Object.keys(colKeys).map((colKey) => (
                            <th className="column-head-medium" key={colKey}>
                              {colKeys[colKey]}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(rowKeys).map((rowKey) => (
                          <tr key={rowKey} className="table-row">
                            <th className="row-head m-med">
                              {rowKeys[rowKey]}
                            </th>
                            {Object.keys(colKeys).map((colKey) => (
                              <td key={`${rowKey}-${colKey}`}>
                                <label className="checkbox-label input-small">
                                  <input
                                    type="checkbox"
                                    name={`${rowKey}.${colKey}`}
                                    checked={
                                      values?.[rowKey]?.[colKey] === "Yes"
                                    }
                                    onChange={(e) =>
                                      setFieldValue(
                                        `${rowKey}.${colKey}`,
                                        e.target.checked ? "Yes" : "No"
                                      )
                                    }
                                    onBlur={handleBlur}
                                  />
                                </label>
                                {touched?.[rowKey]?.[colKey] &&
                                  errors?.[rowKey]?.[colKey] && (
                                    <div>{errors[rowKey][colKey]}</div>
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

              {state.role === "Admin Auditor" && (
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

export default AuditProgramForm;
