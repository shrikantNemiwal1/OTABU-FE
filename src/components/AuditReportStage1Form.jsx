import React, { useContext, useEffect, useState } from "react";
import { auditReportStage1FormSchema } from "../validation/formSchema";
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
  org_name: "Name of the Organization",
  address: "Address",
  site_addrs: "Site Address (If any)",
  num_emp: "No. of Employees",
  email: "E mail id",
  contact_person: "Contact Person ",
  telephone: "Telephone/Fax",
  scope: "Scope",
  iaf_code: "IAF  Code",
  qms_accredit: "QMS Accreditation",
  clause_non_appl: "Clause Non applicability",
  audt_tm_lead: "Lead Auditor",
  audt_tm_auditor: "Auditor",
  audt_tm_tech_expert: "Technical Expert",
  audt_tm_durn: "Audit duration Manday",
  date_audt: "Date of Audit",
  audt_obj: "Audit Objective",
};

const ComplianceInputs = {
  manag_sys_addr:
    "Does the management system address the requirements of the audit standard(s)",
  loc_condi_appr:
    "Are company location(s) and conditions appropriate to proceed to stage 2",
  org_undstd:
    "Rate the organisations understanding of the standard requirements",
  scp_apro_2_act:
    "Is the Scope of the MS appropriate to the activities based on the context assessment",
  org_apro_idnt:
    "Has the organisation appropriately identified compliance obligations",
  org_eval_comp:
    "Has the organisation evaluated their compliance with relevant requirements",
  fulint_audt_org:
    "Has a full internal audit been completed appropriately by the organisation",
};

const Columns = {
  Comment: "Comment",
  Status: "Status* C/N/O",
};

const Rows = {
  contxt_org: "Context of Organization (SWOT & PESTLE Analysis)",
  ned_expt: "Need and Expectation of Interested Parties",
  scope_work: "Scope of Work with Justification of Exclusion if any",
  quaty_manag: "Quality Management System and Its processes",
  risk_oppor: "Risk and Opportunity",
  chnge_contrl: "Change Control",
  leadership: "Leadership and Commitment",
  est_qua_pol: "Establishing & Communicating the Quality Policy",
  qual_obj_plan: "Quality Objectives & planning to achieve them",
  org_role_res: "Organizational roles, responsibilities and authorities",
  appro_statu: "Appropriate statutory & regulatory and legal requirements",
  resrce_compet: "Resources, Competency, Awareness and Trainings",
  doc_info: "Documented Information",
  oper_plan: "Operation Planning & Control",
  rvew_chnge:
    "Determine, Review & Changes of the requirements of Product and Services",
  desig_dev: "Design and Development of Products and Services",
  contl_exter:
    "Control of Externally Provided Processes, Products and Services",
  prodn_ser_prov:
    "Production and Services Provision, Identification & Traceability, Post Delivery Activities",
  contr_n_confo_out: "Control of Non-Conforming Output and Corrective Action",
  cust_sats_fedbk: "Customer Satisfaction, Feedback and Complaints",
  inter_audt_recd: "Internal Audit Record",
  manag_revi_recd: "Management Review Record",
  how_main_acti:
    "How’s the maintenance activity documented? Has the organisation established process of calibration? How does the organisation meet the requirement of Infrastructure and Environment necessary for its process?",
  contin_impr: "Continual Improvement",
};

const RecomendDisclaimInputsAuditor = {
  sign_off: "Sign Off ",
  ogspl_rpt_sub: "OGSPL Report Submission",
  auditor_name: "Name of Auditor",
  auditor_sign: "Signature",
};

const initialValues = {
  "Non Confirmity": "",
  AuditReport_1: {
    org_name: "",
    address: "",
    site_addrs: "",
    num_emp: "",
    email: "",
    contact_person: "",
    telephone: "",
    scope: "",
    iaf_code: "",
    qms_accredit: "",
    clause_non_appl: "",
    audt_tm_lead: "",
    audt_tm_auditor: "",
    audt_tm_tech_expert: "",
    audt_tm_durn: "",
    date_audt: "",
    audt_obj: "",
  },
  OpenCloseMeet: {
    s_id: "",
    attendee: "",
    designa: "",
    open_meet: "",
    clos_meet: "",
  },
  AuditConcluions: {
    change_clnt_detail: "",
    manag_sys_addr: "",
    loc_condi_appr: "",
    org_undstd: "",
    scp_apro_2_act: "",
    org_apro_idnt: "",
    org_eval_comp: "",
    fulint_audt_org: "",
    org_proced_2: "",
    tot_num_defici: "",
  },
  Improvement: {
    s_no: "",
    detil: "",
    clnt_propos_act: "",
    audr_follow_note: "",
    date_closed: "",
  },
  NonConfirmity: {
    non_confirmity: "",
  },
  Comment: {
    contxt_org: "",
    ned_expt: "",
    scope_work: "",
    quaty_manag: "",
    risk_oppor: "",
    chnge_contrl: "",
    leadership: "",
    est_qua_pol: "",
    qual_obj_plan: "",
    org_role_res: "",
    appro_statu: "",
    resrce_compet: "",
    doc_info: "",
    oper_plan: "",
    rvew_chnge: "",
    desig_dev: "",
    contl_exter: "",
    prodn_ser_prov: "",
    contr_n_confo_out: "",
    cust_sats_fedbk: "",
    inter_audt_recd: "",
    manag_revi_recd: "",
    how_main_acti: "",
    contin_impr: "",
  },
  Status: {
    contxt_org: "",
    ned_expt: "",
    scope_work: "",
    quaty_manag: "",
    risk_oppor: "",
    chnge_contrl: "",
    leadership: "",
    est_qua_pol: "",
    qual_obj_plan: "",
    org_role_res: "",
    appro_statu: "",
    resrce_compet: "",
    doc_info: "",
    oper_plan: "",
    rvew_chnge: "",
    desig_dev: "",
    contl_exter: "",
    prodn_ser_prov: "",
    contr_n_confo_out: "",
    cust_sats_fedbk: "",
    inter_audt_recd: "",
    manag_revi_recd: "",
    how_main_acti: "",
    contin_impr: "",
  },
  RecomendDisclaim: {
    sign_off: "",
    ogspl_rpt_sub: "",
    auditor_name: "",
    auditor_sign: "",
    name: "",
    sign: "",
    design: "",
  },
};

const AuditReportStage1Form = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMsg, setAlertMsg] = useState("");
  const [initialForm, setInitialForm] = useState(initialValues);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { state } = useContext(AuthContext);
  const id = pathname.slice(13).slice(0, -19);

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
    //getFormDetails();
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
    validationSchema: auditReportStage1FormSchema,
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
              <h2 className="form-sub-title">Audit Report Stage 1 Form</h2>

              <fieldset disabled={state.role !== "Auditor"}>
                {Object.keys(CommonInputs).map((key, index) => (
                  <div className="input__container" key={key}>
                    <label htmlFor={key}>{`${CommonInputs[key]} :`}</label>
                    <input
                      type={index === 15 ? "date" : "text"}
                      name={`AuditReport_1.${key}`}
                      id={key}
                      value={values.AuditReport_1[key]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={`Enter ${CommonInputs[key]}`}
                    />
                    <div className="input__error-container">
                      {errors.AuditReport_1?.[key] ||
                      touched.AuditReport_1?.[key] ? (
                        <p className="input__error">
                          {errors.AuditReport_1?.[key]}
                        </p>
                      ) : null}
                    </div>
                  </div>
                ))}

                <div className="input__container checkbox-container">
                  <label>
                    Changes In Client Details According To Client Application
                    Form?
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="radio"
                      name="AuditConcluions.change_clnt_detail"
                      value="Yes"
                      checked={
                        values.AuditConcluions.change_clnt_detail === "Yes"
                      }
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <p>Yes</p>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="radio"
                      name="AuditConcluions.change_clnt_detail"
                      value="No"
                      checked={
                        values.AuditConcluions.change_clnt_detail === "No"
                      }
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <p>No</p>
                  </label>
                  <div className="input__error-container">
                    {errors.AuditConcluions?.change_clnt_detail ||
                    touched.AuditConcluions?.change_clnt_detail ? (
                      <p className="input__error">
                        {errors.AuditConcluions?.change_clnt_detail}
                      </p>
                    ) : null}
                  </div>
                </div>

                {Object.keys(ComplianceInputs).map((key, index) => (
                  <div
                    key={key}
                    className="input__container checkbox-container"
                  >
                    <label>{ComplianceInputs[key]} :</label>
                    <label className="checkbox-label">
                      <input
                        type="radio"
                        name={`AuditConcluions.[${key}]`}
                        value="Full Compliance"
                        checked={
                          values.AuditConcluions[key] === "Full Compliance"
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <p>Full Compliance</p>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="radio"
                        name={`AuditConcluions.[${key}]`}
                        value="Partial Compliance"
                        checked={
                          values.AuditConcluions[key] === "Partial Compliance"
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <p>Partial Compliance</p>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="radio"
                        name={`AuditConcluions.[${key}]`}
                        value="Non-Compliance"
                        checked={
                          values.AuditConcluions[key] === "Non-Compliance"
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <p>Non Compliance</p>
                    </label>
                    <div className="input__error-container">
                      {errors.AuditConcluions?.[key] ||
                      touched.AuditConcluions?.[key] ? (
                        <p className="input__error">
                          {errors.AuditConcluions?.[key]}
                        </p>
                      ) : null}
                    </div>
                  </div>
                ))}

                <div className="input__container checkbox-container">
                  <label>
                    Is the organisation ready to proceed to Stage 2:
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="radio"
                      name="AuditConcluions.org_proced_2"
                      value="Yes"
                      checked={values.AuditConcluions.org_proced_2 === "Yes"}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <p>Yes</p>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="radio"
                      name="AuditConcluions.org_proced_2"
                      value="Yes with conditions"
                      checked={
                        values.AuditConcluions.org_proced_2 ===
                        "Yes with conditions"
                      }
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <p>Yes with conditions</p>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="radio"
                      name="AuditConcluions.org_proced_2"
                      value="No"
                      checked={values.AuditConcluions.org_proced_2 === "No"}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <p>No</p>
                  </label>
                  <div className="input__error-container">
                    {errors.AuditConcluions?.org_proced_2 ||
                    touched.AuditConcluions?.org_proced_2 ? (
                      <p className="input__error">
                        {errors.AuditConcluions?.org_proced_2}
                      </p>
                    ) : null}
                  </div>
                </div>

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
                          <th>Requirement</th>
                          {Object.keys(Columns).map((columnKey, index) => (
                            <th
                              key={columnKey}
                              className={index == 1 ? "input-small" : ""}
                            >
                              {Columns[columnKey]}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(Rows).map((rowKey, index) => (
                          <tr key={rowKey} className="table-row">
                            <th className="row-head text-start">
                              {index + 1}
                              {`. `}
                              {Rows[rowKey]}
                            </th>
                            {Object.keys(Columns).map((columnKey, index) => (
                              <td key={`${rowKey}-${columnKey}`}>
                                <input
                                  type="text"
                                  name={`${columnKey}.${rowKey}`}
                                  value={values?.[columnKey]?.[rowKey]}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  className={
                                    index == 1 ? "input-small" : "input-big"
                                  }
                                />
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

                <div className="input__container checkbox-container checkbox-container-vert">
                  <label>RECOMMENDATION:</label>
                  <label className="checkbox-label">
                    <input
                      type="radio"
                      name="AuditConcluions.org_proced_2"
                      value="Recommended Proceeding With Stage 2"
                      checked={
                        values.AuditConcluions.org_proced_2 ===
                        "Recommended Proceeding With Stage 2"
                      }
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <p>Recommended Proceeding With Stage 2</p>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="radio"
                      name="AuditConcluions.org_proced_2"
                      value="Not Recommend proceeding to stage 2 until objective evidence has been submitted to OTABU showing that the concerns raised by the auditor (s) have been rectified. A date for stage 2 will then be agreed. (within 60 days from this audit date)"
                      checked={
                        values.AuditConcluions.org_proced_2 ===
                        "Not Recommend proceeding to stage 2 until objective evidence has been submitted to OTABU showing that the concerns raised by the auditor (s) have been rectified. A date for stage 2 will then be agreed. (within 60 days from this audit date)"
                      }
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <p>
                      Not Recommend proceeding to stage 2 until objective
                      evidence has been submitted to OTABU showing that the
                      concerns raised by the auditor (s) have been rectified. A
                      date for stage 2 will then be agreed. (within 60 days from
                      this audit date)
                    </p>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="radio"
                      name="AuditConcluions.org_proced_2"
                      value="Not Recommend proceeding without a further stage 1 Audit due to the severity of the concerns raised by the audit team"
                      checked={
                        values.AuditConcluions.org_proced_2 ===
                        "Not Recommend proceeding without a further stage 1 Audit due to the severity of the concerns raised by the audit team"
                      }
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <p>
                      Not Recommend proceeding without a further stage 1 Audit
                      due to the severity of the concerns raised by the audit
                      team
                    </p>
                  </label>
                  <div className="input__error-container">
                    {errors.AuditConcluions?.org_proced_2 ||
                    touched.AuditConcluions?.org_proced_2 ? (
                      <p className="input__error">
                        {errors.AuditConcluions?.org_proced_2}
                      </p>
                    ) : null}
                  </div>
                </div>

                {Object.keys(RecomendDisclaimInputsAuditor).map(
                  (key, index) => (
                    <div className="input__container" key={key}>
                      <label
                        htmlFor={key}
                      >{`${RecomendDisclaimInputsAuditor[key]} :`}</label>
                      <input
                        type={index === 0 || index === 3 ? "file" : "text"}
                        name={`RecomendDisclaim.${key}`}
                        id={key}
                        value={values.RecomendDisclaim[key]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder={`Enter ${RecomendDisclaimInputsAuditor[key]}`}
                      />
                      <div className="input__error-container">
                        {errors.RecomendDisclaim?.[key] ||
                        touched.RecomendDisclaim?.[key] ? (
                          <p className="input__error">
                            {errors.RecomendDisclaim?.[key]}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  )
                )}
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

export default AuditReportStage1Form;
