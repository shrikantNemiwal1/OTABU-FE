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

const colInitialValues = {
  stage1: "No",
  stage2: "No",
  sa1: "No",
  sa2: "No",
  renewal: "No",
};

const rowKeys = {
  9: [
    "Performance of Last 03 Years",
    "Top Management- Internal Audit, MRM, Control of Documented Information",
    "Top Management / Management System Co-Ordinator - Top Management Commitment, Regulatory and Statutory Requirement of the Product, Scope of QMS, its applicability, Planning of Changes, Customer Focus and Quality Policy & Quality objectives and planning to achieve them",
    "Top Management - Sequence and Interaction of Processes and its expected Inputs and Output., internal external issues, needs & expectation of interested parties, Scope of certification & its applicability, Quality Management Processes",
    "Marketing / Business Development – Customer communication, Determining the requirements for products and services, Review of the requirements for products and services, Changes to requirements for products and services, Feedback, Customer Satisfaction, Customer complaint handling.",
    "HR - Roles and Responsibility, Competence Training and Awareness.",
    "Maintenance – Preventive / Breakdown Maintenance, Work Environment.",
    "Top Management - Risk & Opportunity considering the internal external issues, needs & expectation of interested parties",
    "Management System Co-Ordinator - Organizational Knowledge, Continual Improvement.",
    "Production- Production Planning & Control, control of service provision, Work Instruction, Process Flow Chart, Product identification and traceability, Product preservation, Customer property, Post delivery activities",
    "Quality Control – inprocess inspection, Final inspection Control of Non Conformance of the product, Control of Non Conformance of the product, Control of Monitoring and Measuring resources (Calibration), Analysis and evaluation",
    "Purchase - Control of Externally Provided Process - No. of approved Supplier, Supplier Evaluation records, Supplier Rating, Supplier Purchase order and  Incoming Inspection report",
    "a) internal audits and management review;\nb) a review of actions taken on nonconformities identified during the previous audit; \nc) complaints handling; \nd) effectiveness of the management system with regard to achieving the certified client’s objectives and the intended results of the respective management system (s); \ne) progress of planned activities aimed at continual improvement; \nf) continuing operational control; \ng) review of any changes;",
    "use of marks and/or any other reference to certification."
  ],
  14: [
    "Performance of Last 03 Years.",
    "Top Management - Internal audit, Management Review Meeting, Leadership and commitment, Environmental policy, Environmental objectives and planning to achieve them",
    "Top Management - Context of the organization, internal & external issues, Understanding the needs and expectations of interested parties, Determining the scope of the environmental management system, Environmental management system",
    "Operations – Risk and Opportunities considering the Context of the organization, internal & external issues, Understanding the needs and expectations of interested parties, environmental aspects & its impacts",
    "Operations- environmental aspects & its impacts, and Operational Control considering the Context of the organization, internal & external issues, Understanding the needs and expectations of interested parties, environmental aspects & its impacts",
    "Quality - Monitoring Disposal of Hazardous waste, Monitoring and Measurement of Electricity Consumption, Monitoring and Measurement of Dieseal Consumption, Monitoring and Measurement of Water Consumption, E-Wastages for Disposal, Stack Emission test report, Noise level Test Report, Ambient Air Quality Test report, Verification Legal Compliances",
    "Admin – Emergency Preparedness & Response, Compliance Obligation, Compliance Evaluation.",
    "Human Resource - Organizational roles, responsibilities and authorities, Environment for the operation of processes,  ",
    "Human Resource - Competence, Awareness, Communication",
    "Quality -  Control of nonconforming outputs, improvements, continual improvements, corrective action.",
    "Management Representative - documented information’s, Creating and updating,  Control of documented information",
    "Admin – Compliance obligations, Evaluation of compliances",
    "a) internal audits and management review;\nb) a review of actions taken on nonconformities identified during the previous audit;\nc) complaints handling;\nd) effectiveness of the management system with regard to achieving the certified client’s objectives and the intended results of the respective management system (s); \ne) progress of planned activities aimed at continual improvement; \nf) continuing operational control;\ng) review of any changes;",
    "use of marks and/or any other reference to certification.",
  ],
  45: [
    "Review of Last 03 Years Performance",
    "RTop Management – Internal Audit, Management Review Meeting,",
    "Management Representative – Documented information,  Creating and updating,  Control of documented information",
    "Top Management – Understanding the organization and its context,  Understanding the needs and expectations of workers and other interested parties,  Determining the scope of the OH&S management system,  OH&S management system",
    "Top Management – Leadership and commitment,  OH&S policy,  OH&S objectives,  Planning to achieve OH&S objectives",
    "Operations - Hazard identification and assessment of risks and opportunities, Assessment of OH&S risks and other risks to the OH&S management system, Assessment of OH&S opportunities and other opportunities for the OH&S management system",
    "Top Management - Actions to address risks and opportunities considering Understanding the organization and its context, Understanding the needs and expectations of workers and other interested parties",
    "Human Resource - Organizational roles, responsibilities and authorities, Consultation and participation of workers",
    "Operations - Operational planning and control, Understanding the organization and its context, Understanding the needs and expectations of workers and other interested parties, Hazard identification and assessment of risks and opportunities, eliminating hazards and reducing OH&S risks, Management of change",
    "Admin - Determination of legal requirements and other requirements, Evaluation of Compliances",
    "Human Resource – Competence, Awareness & Communication.",
    "Purchase - Procurement, Contractors, Outsourcing",
    "Quality – Performance evaluation, Monitoring, measurement, analysis and performance evaluation related to accident report, Work Permit, Environmental testing, Incident, nonconformity and corrective action, Improvement, Continual improvement",
    "a) internal audits and management review;\nb) a review of actions taken on nonconformities identified during the previous audit;\nc) complaints handling;\nd) effectiveness of the management system with regard to achieving the certified client’s objectives and the intended results of the respective management system (s);\ne) progress of planned activities aimed at continual improvement;\nf) continuing operational control;\ng) review of any changes;",
  ],
  914: [
    "Performance of Last 03 Years.",
    "Management Representative – Internal Audit & Management Review Meeting",
    "Top Management – Leadership and commitment,  Customer Focus,  Establishing the IMS Policy,  Communicating the IMS policy, IMS Objectives & Planning to achieve them",
    "Top Management -  Understanding the organization and its context,  Understanding the needs and expectations of interested parties related to IMS",
    "Top Management -   Determining the scope of the integrated management system, Exclusion and Justification, integrated management system and its processes related to IMS",
    "Human Resource - Organizational roles, responsibilities and authorities related to IMS",
    "Top Management - Actions to address risks and opportunities related to IMS",
    "Admin - Emergency preparedness and response.",
    "Admin -  Compliance obligations, Evaluation of Compliances",
    "Human Resource – infracture, people, resources,  Environment for the operation of processes, Competence , Awareness",
    "Operations - Environmental Aspects",
    "Operations - Resource Planning, Machine Plan, Quality Plan, Control Plan, Assembly Planning, Dispatch Plan, Preventive/Breakdown Maintenance plan, Control of production and service provision,  Identification and traceability,  Property belonging to customers or external providers.,  Preservation,  Post-delivery activities,  Control of changes process",
    "Marketing -  Customer communication,  Determining the requirements for products and services,  Review of the requirements for products and services,  Changes to requirements for products and services related to  scope of certification, Customer satisfaction, customer complaints, ",
    "Quality - Monitoring, measurement, analysis and evaluation related to  Electricity Monthly Basis, Monitoring of Stack Emission, Monitoring Ambient Air Quality Monitoring Report, Ambient Noise Level Monitoring Report, STP water Report,",
    "Purchase -  Control of externally provided processes, products and services, Type and extent of control,  Information for external providers, outsourcing, contracting.",
    "Quality - Final inspection, In process & Testing   related to scope of certification, Analysis and evaluation",
    "Quality - Control of nonconforming outputs, Corrective Action, incident investigation, Improvement, Continual improvements",
    "a) internal audits and management review;\nb) a review of actions taken on nonconformities identified during the previous audit;\nc) complaints handling;\nd) effectiveness of the management system with regard to achieving the certified client’s objectives and the intended results of the respective management system (s);\ne) progress of planned activities aimed at continual improvement;\nf) continuing operational control;\ng) review of any changes;",
    "use of marks and/or any other reference to certification.",
  ],
  945: [
    "Performance of Last 03 Years.",
    "Management Representative – Internal Audit & Management Review Meeting",
    "Top Management – Leadership and commitment,  Customer Focus,  Establishing the IMS Policy,  Communicating the IMS policy, IMS Objectives & Planning to achieve them",
    "Top Management -  Understanding the organization and its context,  Understanding the needs and expectations of interested parties related to IMS",
    "Top Management -   Determining the scope of the integrated management system, Exclusion and justification,  integrated management system and its processes related to IMS",
    "Human Resource - Organizational roles, responsibilities and authorities related to IMS",
    "Top Management - Actions to address risks and opportunities related to IMS",
    "Admin - Consultation and participation of workers, Emergency preparedness and response.",
    "Operations – Hazard identification and risk Assessment, Assessment of OH&S risks and other risks to the OH&S management system, Assessment of OH&S opportunities and other opportunities for the OH&S management system  ",
    "Admin -  Compliance obligations, Evaluation of Compliances",
    "Human Resource – infracture, people, resources,  Environment for the operation of processes, Competence , Awareness",
    "Operations - Resource Planning, Machine Plan, Quality Plan, Control Plan, Assembly Planning, Dispatch Plan, Preventive/Breakdown Maintenance plan, Control of production and service provision,  Identification and traceability,  Property belonging to customers or external providers.,  Preservation,  Post-delivery activities,  Control of changes process",
    "Marketing -  Customer communication,  Determining the requirements for products and services,  Review of the requirements for products and services,  Changes to requirements for products and services related to  scope of certification, Customer satisfaction, customer complaints, ",
    "Quality - Accident incident records, Medical Health Examination, Work Permit, HIRA Monitoring, First Aid Box inspection, Inspection report of Fire Alarm System, Monitoring of legal compliances,  ",
    "Purchase - Control of externally provided processes, products and services, Type and extent of control, Information for external providers, outsourcing, contracting.",
    "Purchase - Control of externally provided processes, products and services, Type and extent of control, Information for external providers, outsourcing, contracting.",
    "Quality - Control of nonconforming outputs, Corrective Action, incident investigation, Improvement, Continual improvements",
    "a) internal audits and management review;\nb) a review of actions taken on nonconformities identified during the previous audit;\nc) complaints handling;\nd) effectiveness of the management system with regard to achieving the certified client’s objectives and the intended results of the respective management system (s);\ne) progress of planned activities aimed at continual improvement;\nf) continuing operational control;\ng) review of any changes;",
    "use of marks and/or any other reference to certification.",
  ],
  1445: [
    "Performance of Last 03 Years.",
    "Management Representative – Internal Audit & Management Review Meeting",
    "Top Management – Leadership and commitment,    Establishing the IMS Policy,  Communicating the IMS policy, IMS Objectives & Planning to achieve them",
    "Top Management -  Understanding the organization and its context,  Understanding the needs and expectations of interested parties related to IMS",
    "Top Management -   Determining the scope of the integrated management system,   integrated management system and its processes related to IMS",
    "Human Resource - Organizational roles, responsibilities and authorities related to IMS",
    "Top Management - Actions to address risks and opportunities related to IMS",
    "Admin - Consultation and participation of workers, Emergency preparedness and response.",
    "Operations – Hazard identification and risk Assessment, Assessment of OH&S risks and other risks to the OH&S management system, Assessment of OH&S opportunities and other opportunities for the OH&S management system  ",
    "Admin -  Compliance obligations, Evaluation of Compliances",
    "Human Resource – infracture, resources,  Environment for the operation of processes, Competence , Awareness",
    "Operations - Environmental Aspects",
    "Quality - Monitoring, measurement, analysis and evaluation related to  Electricity Monthly Basis, Monitoring of Stack Emission, Monitoring Ambient Air Quality Monitoring Report, Ambient Noise Level Monitoring Report, STP water Report, accident report, Work Permit, Monitoring identified haxards and its risk assessment, Disposal of wastages. ",
    "Purchase -  outsourcing, contracting.",
    "Quality - Control of nonconforming outputs, Corrective Action, incident investigation, Improvement, Continual improvements",
    "a) internal audits and management review;\nb) a review of actions taken on nonconformities identified during the previous audit;\nc) complaints handling;\nd) effectiveness of the management system with regard to achieving the certified client’s objectives and the intended results of the respective management system (s);\ne) progress of planned activities aimed at continual improvement;\nf) continuing operational control;\ng) review of any changes;",
    "use of marks and/or any other reference to certification.",
  ],
  91445: [
    "Performance of Last 03 Years.",
    "Performance of Last 03 Years.",
    "Top Management – Leadership and commitment,  Customer Focus,  Establishing the IMS Policy,  Communicating the IMS policy, IMS Objectives & Planning to achieve them",
    "Top Management - Understanding the organization and its context,  Understanding the needs and expectations of interested parties related to IMS",
    "Top Management - Determining the scope of the integrated management system,   integrated management system and its processes related to IMS",
    "Human Resource - Organizational roles, responsibilities and authorities related to IMS",
    "Top Management - Actions to address risks and opportunities related to IMS",
    "Admin - Consultation and participation of workers, Emergency preparedness and response.",
    "Operations – Hazatrd identification and risk Assessment, Assessment of OH&S risks and other risks to the OH&S management system, Assessment of OH&S opportunities and other opportunities for the OH&S management system",
    "Admin - Compliance obligations, Evaluation of Compliances",
    "Human Resource – infracture, people, resources,  Environment for the operation of processes, Competence , Awareness",
    "Operations - Environmental Aspects",
    "Operations - Resource Planning, Machine Plan, Quality Plan, Control Plan, Assembly Planning, Dispatch Plan, Preventive/Breakdown Maintenance plan, Control of production and service provision,  Identification and traceability,  Property belonging to customers or external providers.,  Preservation,  Post-delivery activities,  Control of changes process",
    "Marketing - Customer communication,  Determining the requirements for products and services,  Review of the requirements for products and services,  Changes to requirements for products and services related to  scope of certification, Customer satisfaction, customer complaints, ",
    "Quality - Monitoring, measurement, analysis and evaluation related to  Electricity Monthly Basis, Monitoring of Stack Emission, Monitoring Ambient Air Quality Monitoring Report, Ambient Noise Level Monitoring Report, STP water Report,",
    "Purchase - Control of externally provided processes, products and services, Type and extent of control,  Information for external providers, outsourcing, contracting.",
    "Quality - Final inspection, In process & Testing   related to scope of certification, Analysis and evaluation",
    "Quality - Control of nonconforming outputs, Corrective Action, incident investigation, Improvement, Continual improvements",
    "a) internal audits and management review;\nb) a review of actions taken on nonconformities identified during the previous audit;\nc) complaints handling;\nd) effectiveness of the management system with regard to achieving the certified client’s objectives and the intended results of the respective management system (s); \ne) progress of planned activities aimed at continual improvement;\nf) continuing operational control;\ng) review of any changes;",
    "use of marks and/or any other reference to certification.",
  ],
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

  // TopManagePolicyImprove: {
  //   stage1: "No",
  //   stage2: "No",
  //   sa1: "No",
  //   sa2: "No",
  //   renewal: "No",
  // },

  // QMSDocConOrgRiskIntMRM: {
  //   stage1: "No",
  //   stage2: "No",
  //   sa1: "No",
  //   sa2: "No",
  //   renewal: "No",
  // },

  // HRTrainWork: {
  //   stage1: "No",
  //   stage2: "No",
  //   sa1: "No",
  //   sa2: "No",
  //   renewal: "No",
  // },

  // MarketCustReqFeedback: {
  //   stage1: "No",
  //   stage2: "No",
  //   sa1: "No",
  //   sa2: "No",
  //   renewal: "No",
  // },

  // ProductionQAMaintAnalyCA: {
  //   stage1: "No",
  //   stage2: "No",
  //   sa1: "No",
  //   sa2: "No",
  //   renewal: "No",
  // },

  // PurchaseStoresDispatch: {
  //   stage1: "No",
  //   stage2: "No",
  //   sa1: "No",
  //   sa2: "No",
  //   renewal: "No",
  // },

  // UseOfLogo: {
  //   stage1: "No",
  //   stage2: "No",
  //   sa1: "No",
  //   sa2: "No",
  //   renewal: "No",
  // },
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
  const [auditTable, setAuditTable] = useState(
    Array.from({ length: 20 }, () => ({ ...colInitialValues }))
  );

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
      setIsLoading(true);

      const formValues = {
        AuditProgram: values?.AuditProgram,
        Array: [
          values?.ProcessStage1,
          values?.ProcessStage2,
          values?.ProcessSurveillance1,
          values?.ProcessSurveillance2,
          values?.ProcessRenewal,
          ...auditTable.slice(0, rowKeys[9].length),
        ],
      };

      console.log(formValues);

      try {
        const response = await axios({
          method: formSubmitted ? "put" : "post",
          url:
            BASE_URL +
            `/api/audit_program/${formSubmitted ? "update" : "create"}/${id}`,
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
                    <table className="table-form checkbox-table">
                      <thead>
                        <tr>
                          <th className="row-head-large"></th>
                          {Object.keys(colKeys).map((colKey) => (
                            <th className="column-head" key={colKey}>
                              {colKeys[colKey]}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {rowKeys["9"].map((rowKey, index) => (
                          <tr key={rowKey} className="table-row">
                            <th className="row-head m-med">{rowKey}</th>
                            {Object.keys(colKeys).map((colKey) => (
                              <td key={`${rowKey}-${colKey}`}>
                                <label className="checkbox-label input-small">
                                  <input
                                    type="checkbox"
                                    name={`${rowKey}.${colKey}`}
                                    checked={
                                      auditTable?.[index]?.[colKey] === "Yes"
                                    }
                                    onChange={(e) =>
                                      setAuditTable((prevState) => {
                                        const newArray = [...prevState];
                                        newArray[index] = {
                                          ...newArray[index],
                                          [colKey]: e.target.checked
                                            ? "Yes"
                                            : "No",
                                        };
                                        return newArray;
                                      })
                                    }
                                  />
                                </label>
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
