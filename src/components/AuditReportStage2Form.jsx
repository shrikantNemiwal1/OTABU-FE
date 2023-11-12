import { useContext, useEffect, useState } from "react";
import { auditReportStage2FormSchema } from "../validation/formSchema";
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
  contact_person: "Contact Person",
  scope: "Scope",
  temp_site_verif:
    "Temporary Site Verification Record (Specially for Installation, Commissioning, Contracting Services, Waste Collection etc. if find in scope)",
  ea_code: "EA Code",
  adt_durn_mnday: "Audit Duration Manday (S)",
  standard: "Standard:",
  accredited_non: "Accredited/Non Accredited",
  exclusion: "Exclusions",
  lead_auditor: "Lead Auditor",
  autor_tech_expt: "Auditor/Technical Expert",
  observer: "Observer",
  interpreter: "Interpreter",
  date_audt: "Date of Audit",
  type_audt: "Type of Audit",
  product_standard: "Product Standards or Statutory Requirements",
};

const ComplianceInputs = {
  devatn_audt_pln: "Is there any deviation from the audit plan?",
  signi_iss_imptng:
    "Is there any significant issues impacting on the audit programme?",
  signi_chngs_afct_manage_sys:
    "Is there any significant issues impacting on the audit programme?",
  type_of_audit: "Type of audit (single, combined, joint or integrated)?",
  certifi_scope_appr:
    "Is the certification scope being appropriate to the organization work activities?",
  change_num_emp: "Is there any change in Number of Employees",
  open_clos_meet: "Opening & Closing Meeting Attended by Top Management ",
  effive_audt_mrm: "Effective Internal Audit & MRM Conducted? ",
  productt_staory: "Product Statutory & Regulatory Compliance Evident?",
  comments:
    "Is there any Comments on a conclusion on the appropriateness of the certification scope",
};

const Columns = {
  RecordsVerifi_DocuVerifi_1:
    "Document Verification detail with statement of Conformity ",
  RecordsVerifi_C_NC_O_1: "C/NC/O",
};

const Columns2 = {
  RecordsVerifi_DocuVerifi_2:
    "Document Verification detail with statement of Conformity",
  RecordsVerifi_C_NC_O_2: "C/NC/O",
};

const Rows = {
  previous_issues_addressed:
    "Have previous issues been addressed appropriately",
  significant_changes:
    "Has there been any significant changes including Last Audit, audit plan, audit programme etc to the company",
  clause_4_1:
    "4.1	UNDERSTANDING THE ORGANISATION (SWOT)-Has the organization determined external and internal issues?-Has the organization monitored & reviewed the issues?",
  clause_4_2:
    "4.2	-Understanding the needs & expectations of parties?-who are the relevant & interested parties?-what are the requirements identified?-are these requirements monitored & reviewed ?",
  clause_4_3:
    "4.3	DETEREMINING THE SCOPE OF QMS		-Is the documented scope contain type of product/services?-Is there any non applicable requirement of standard?-Is justification of non applicability appropriate?	",
  clause_4_4:
    "4.4	QMS & ITS PROCESSES		-are the processes of QMS identified? (with input, output, KPI & onus)-Is the sequence & interaction given?-Are the risks & opportunities identified?-Is the effectiveness of these processes monitored?",
  clause_5_0:
    "4.4	QMS & ITS PROCESSES		-are the processes of QMS identified? (with input, output, KPI & onus)-Is the sequence & interaction given?-Are the risks & opportunities identified?-Is the effectiveness of these processes monitored?		",
  clause_5_1:
    "5.1	CUSTOMER  FOCUS		-Are the customers obligatory, risk requirement identified & met?		 ",
  clause_5_2:
    "5.2	POLICY		-Is the documented policy appropriate to the context & purpose of the organization?-Does it provide framework for the objectives?-Does it include commitment to comply the requirements and continual improvements-How is it communicated internally / externally?		",
  clause_5_3:
    "5.3	ORGANISATION ROLE, RESPONSIBILITY & AUTHORITIES		-To whom responsibility & authority assigned for implementation, improvement & reporting the effectiveness of QMS?		",
  clause_6_1:
    "ACTION TO ADDRESS RISKS & OPPORTUNITIES 	-Is evaluation of effectiveness of action risk monitored?",
  clause_6_2:
    "6.2	QUALITY OBJECTIVE & PLANNING TO ACHIEVE THEM	-Are the documented objectives consistent with policy measurable, monitored, communicated & updated? -Is the action plan prepared to achieve targets?",
  clause_6_3:
    "6.3	PLANNING OF CHANGE		-Is the purpose, availability  of resource, reallocation of responsibility integrity of QMS considered in any change in QMS?",
  clause_7_1_1:
    "7.1	RESOURCES		7.1.1	-are the capabilities & constraints on existing resources considered?-What needs to be obtained from external providers? ",
  clause_7_1_2: "7.1.2	PEOPLE		-Is the competent person provided?		",
  clause_7_1_3: "7.1.3	INFRASTRUCTURE		-Is the required infrastructure provided?		",
  clause_7_1_4:
    "7.1.4	ENVIRONMENT		-Is the suitable environment of production provided?		",
  clause_7_1_5:
    "7.1.5	MONITORING & MEASURING RESORCE		-Is the fitness of monitoring & measuring resource maintained? -Is the record of fitness maintained? Is the resource identified in order to determine their status ?		",
  clause_7_1_6:
    "7.1.6	ORGANISATIONAL KNOWLEDGE		-Is the knowledge necessary for operation &of its processes & to achieve the conformity of the product identified?		",
  clause_7_2:
    "7.2	COMPETENCY		-Is the competency required identified?-Is the competency available identified?-Is the training plan prepared to fill the gap in competency?-Is the training record maintained with its effectiveness?		",
  clause_7_3:
    "7.3	AWARENESS		-Are the employees aware about quality policy, objectives, QMS effectiveness & non conformities?		",
  clause_7_4:
    "7.4	COMMUNICATION		-Are what, when, whom, how, who  identified for communication about QMS?		 ",
  clause_7_5:
    "7.5	DOCUMENTED INFORMATION		-Is there any list of documents internal/external?-How are documents identifiable reviewed & approved?-Is there any list of record?-How is distribution, assess, retention , storage, retrieval , disposal of record maintained?		",
  clause_8_1:
    "8.1	Operational  planning & control		-Is the quality plan prepared? -are the process control parameters identified _are work instructions prepared?",
  clause_8_2_1:
    "8.2.1	Customer communication		-How providing product related information?-How handling customer inquiries?-How getting customer feed -back /complaint?-Has contingency plan prepared?		",
  clause_8_2_2:
    "8.2.2	Determining the requirements  for product/services		-Has customer requirements identified?-Has applicable statutory & regulatory requirements identified?		",
  clause_8_2_3:
    "8.2.3	Review of requirements		-Are the stated, necessary, specified & regulatory requirements reviewed?-Has record of review retained?-Has the record of any change retained?		",
  clause_8_3_2:
    "8.3.2	Planning		-Has stages & control of design & development identified?-Have records of it retained?		",
  clause_8_3_3:
    "8.3.3	Input		-Has functional & requirement identified?-Is there any similar design identified?-Has statutory & regulatory -*z-*requirements, standards, code of practice, FNEA identified?-Is the record of input retained?		",
  clause_8_3_4:
    "8.3.4	Control		 -Are designs reviewed, verification & validation done?-Is the record retained?		",
  clause_8_3_5:
    "8.3.5	Design output		-Does out needs input requirement?-Does record of output retained?		",
  clause_8_3_6:
    "8.3.6	Design & development change		-Does record of change, review, authorization, preventive action retained?		",
  clause_8_4_1:
    "8.4.1	Control of Externally provided Processes, product & services		-Are the outsourced processes, product & services identified?-Is the criteria for the evaluation, selection, monitoring of performance, re-evaluation for external provider identified?-Is the record of evaluation retained?	 	",
  clause_8_4_2:
    "8.4.2	Type & extent of Control		-What type of control over the outsource provider?		",
  clause_8_4_3:
    "8.4.3	Information for external provider		-What type of information given to external provider?		",
  clause_8_5_1:
    "8.5.1	Control of Production & Services & Production		-Are the characteristics & specification documented?-Are the monitoring & measurement resources available?-Are the suitable infrastructure & environment available?-Are the competent personnel available?		",
  clause_8_5_2:
    "8.5.2	Identification & Traceability		-How is test status of the product identified?-How is traceability maintained?-Is the record of traceability maintained?		",
  clause_8_5_3:
    "8.5.3	Properties belonging to customer  or external provider		-What are the properties belonging to customer or external providers?-Does the record of damaged property retained?		",
  clause_8_5_4:
    "8.5.4	Preservation		- Is there any specific reservation requirement from storage to transportation? 		",
  clause_8_5_5:
    "8.5.5	Post delivery activities		-What type of post-delivery activities identified?		",
  clause_8_5_6:
    "8.5.6	Control of Change		-Are the changes in production & services production recorded or reviewed authorized persons for release & evidence of conformity?		",
  clause_8_6:
    "8.6	Release of product / services		-Are the products / services released by authorized person?-Is the record maintained?		",
  clause_8_7:
    "8.7	Control of Non- confirming output		-What action is taken to non conforming output?-Is the record of non conforming output & actions retained?-Is the authority identified with non conforming output?		",
  clause_9_1_1:
    "9.1	Monitoring, Measurement, Analysis & Evaluation		9.1.1	-Are what, when, how of monitoring of QMS effectiveness identified?-Is the result of effectiveness retained?		",
  clause_9_1_2:
    "9.1.2	Customer Satisfaction		-Is the customer satisfaction identified?		",
  clause_9_1_3:
    "9.1.3	Analysis & Evaluation 		-Is the product & services, customer satisfaction index, QMS effectiveness, planning, implementation, actions for risks/opportunities, performance of external providers evaluated?- Are the need for improvement identified?		",
  clause_9_2:
    "9.2	Internal Audit		-	Is the responsibility to conduct internal audit identified?-	-Is the plan scheduled auditors identified?-	Is the record for the audit maintained?		",
  clause_9_3:
    "9.3	Management review		-Is the management review record maintained?		",
  clause_10: "10	Improvement		-What are the action taken for improvement?		",
  clause_10_2: "10	Improvement		-What are the action taken for improvement?		",
  clause_10_3:
    "10.3	Continual improvement		-Is the record of suitability, adequacy & effectiveness of the quality management maintained?		",
};

const OptionInputs = [
  {
    name: "A. Stage of audit",
    key: "stage_of_audit",
    options: [
      "Stage of audit",
      "Follow Up Audit",
      "Surveillance Cum Transfer",
      "Modification",
      "Renewal",
      "Upgrade From",
      "Other",
    ],
  },
  {
    name: "B. Recommendation",
    key: "recommendation",
    options: [
      "Issuance of Certificate",
      "Refusal of the Certificate",
      "Follow Up audit",
      "Modification of the current certificate (registration no. And expiration date remain unchanged)",
      "Other",
    ],
  },
  {
    name: "C. Reason",
    key: "reason",
    options: [
      "The quality system complies with the requirements of the reference standard: Congratulations, on the basis of the above summary, Lead Auditor is pleased to put forward a recommendation for issuance of certificate.",
      "The quality system complies with the requirements of the reference standard with exception of minor NC: Congratulations, Lead Auditor is pleased to put forward a recommendation for registration of Organization upon off-site verification of closure of all issues, the NC closure need to be submitted along with the Corrective Action Plan and objective evidence with 15 days from the stage 2 audit but not later than60 days from the date of Stage 2 audit. If all non-conformances are not closed within 60 days, a full reassessment may be required. (Ref OTABU-F028 for Corrective Action Report)",
      "Evidence of major non conformities: Organization is not recommended for next assessment at this time. A follow-up assessment will be scheduled to allow for on-site verification and closure of all issues within 60 days from the date of Stage 2 audit. If all non-conformances are not closed within 60 days, a full reassessment may be required. (Ref OTABU-F028 for Corrective Action Report)",
      "Not Recommended: Organization is not recommended for certification, a Stage 2 audit will be required. To progress your application for registration, please respond to each non-conformance, with a plan showing proposed actions, timescales and responsibilities for resolution. The organization should consider the root cause of the non-conformance and the potential for related issues in other parts of your system.",
    ],
  },
];

const RecomendDisclaimInputsAuditor = {
  sign_off: "Sign Off",
  otabu_rept_sub: "OTABU Report Submission",
  auditor_name: "Name of Auditor ",
  auditor_sign: "Signature",
  name: "Name",
  sign: "Sign",
  design: "Designation",
  disclaimer: "DISCLAIMER STATEMENT",
  any_unresolve_issues: "ANY UNRESOLVE ISSUES IF IDENTIFIED",
};

const OpenCloseMeetCols = {
  attendee: "Attendees",
  designa: "Designation",
  open_meet: "Opening Meeting",
  clos_meet: "Closing Meeting",
};

const NonConfirmitiesCols = {
  correct_acns: "Corrective actions requested",
  category: "Category",
  clause_refer: "Clause reference",
  mode_closure: "Mode of closure",
  time_frame: "Agreed time frame",
};

const initialValues = {
  Non_Confirmity: "",

  AuditReport_2: {
    org_name: "",
    address: "",
    site_addrs: "",
    num_emp: "",
    email: "",
    contact_person: "",
    scope: "",
    temp_site_verif: "",
    ea_code: "",
    adt_durn_mnday: "",
    standard: "",
    accredited_non: "",
    exclusion: "",
    lead_auditor: "",
    autor_tech_expt: "",
    observer: "",
    interpreter: "",
    date_audt: "",
    type_audt: "",
    product_standard: "",
  },

  AuditConclu: {
    devatn_audt_pln: "",
    signi_iss_imptng: "",
    signi_chngs_afct_manage_sys: "",
    type_of_audit: "",
    certifi_scope_appr: "",
    change_num_emp: "",
    open_clos_meet: "",
    effive_audt_mrm: "",
    productt_staory: "",
    comments: "",
  },

  OpenCloseMeet: [
    {
      s_id: "",
      attendee: "",
      designa: "",
      open_meet: "",
      clos_meet: "",
    },

    {
      s_id: "",
      attendee: "",
      designa: "",
      open_meet: "",
      clos_meet: "",
    },
  ],

  NonConfirm: [
    {
      s_no: "",
      correct_acns: "",
      category: "",
      clause_refer: "",
      mode_closure: "",
      time_frame: "",
    },

    {
      s_no: "",
      correct_acns: "",
      category: "",
      clause_refer: "",
      mode_closure: "",
      time_frame: "",
    },
  ],

  RecordsVerifi_C_NC_O_1: {
    previous_issues_addressed: "",
    significant_changes: "",
    clause_4_1: "",
    clause_4_2: "",
    clause_4_3: "",
    clause_4_4: "",
    clause_5_0: "",
    clause_5_1: "",
    clause_5_2: "",
    clause_5_3: "",
    clause_6_1: "",
    clause_6_2: "",
    clause_6_3: "",
    clause_7_1_1: "",
    clause_7_1_2: "",
    clause_7_1_3: "",
    clause_7_1_4: "",
    clause_7_1_5: "",
    clause_7_1_6: "",
    clause_7_2: "",
    clause_7_3: "",
    clause_7_4: "",
    clause_7_5: "",
  },

  RecordsVerifi_C_NC_O_2: {
    clause_8_1: "",
    clause_8_2_1: "",
    clause_8_2_2: "",
    clause_8_2_3: "",
    clause_8_3_2: "",
    clause_8_3_3: "",
    clause_8_3_4: "",
    clause_8_3_5: "",
    clause_8_3_6: "",
    clause_8_4_1: "",
    clause_8_4_2: "",
    clause_8_4_3: "",
    clause_8_5_1: "",
    clause_8_5_2: "",
    clause_8_5_3: "",
    clause_8_5_4: "",
    clause_8_5_5: "",
    clause_8_5_6: "",
    clause_8_6: "",
    clause_8_7: "",
    clause_9_1_1: "",
    clause_9_1_2: "",
    clause_9_1_3: "",
    clause_9_2: "",
    clause_9_3: "",
    clause_10: "",
    clause_10_2: "",
    clause_10_3: "",
  },

  RecordsVerifi_DocuVerifi_1: {
    previous_issues_addressed: "",
    significant_changes: "",
    clause_4_1: "",
    clause_4_2: "",
    clause_4_3: "",
    clause_4_4: "",
    clause_5_0: "",
    clause_5_1: "",
    clause_5_2: "",
    clause_5_3: "",
    clause_6_1: "",
    clause_6_2: "",
    clause_6_3: "",
    clause_7_1_1: "",
    clause_7_1_2: "",
    clause_7_1_3: "",
    clause_7_1_4: "",
    clause_7_1_5: "",
    clause_7_1_6: "",
    clause_7_2: "",
    clause_7_3: "",
    clause_7_4: "",
    clause_7_5: "",
  },

  RecordsVerifi_DocuVerifi_2: {
    clause_8_1: "",
    clause_8_2_1: "",
    clause_8_2_2: "",
    clause_8_2_3: "",
    clause_8_3_2: "",
    clause_8_3_3: "",
    clause_8_3_4: "",
    clause_8_3_5: "",
    clause_8_3_6: "",
    clause_8_4_1: "",
    clause_8_4_2: "",
    clause_8_4_3: "",
    clause_8_5_1: "",
    clause_8_5_2: "",
    clause_8_5_3: "",
    clause_8_5_4: "",
    clause_8_5_5: "",
    clause_8_5_6: "",
    clause_8_6: "",
    clause_8_7: "",
    clause_9_1_1: "",
    clause_9_1_2: "",
    clause_9_1_3: "",
    clause_9_2: "",
    clause_9_3: "",
    clause_10: "",
    clause_10_2: "",
    clause_10_3: "",
  },

  Summary_Audit: {
    stage_of_audit: "",
    recommendation: "",
    reason: "",
    sign_off: "",
    otabu_rept_sub: "",
    auditor_name: "",
    auditor_sign: "",
    name: "",
    sign: "",
    design: "",
    disclaimer: "",
    any_unresolve_issues: "",
  },
};

const AuditReportStage2Form = () => {
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
  const id = pathname.slice(13).slice(0, -21);

  const getFormDetails = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${state.token}` },
      };
      const res = await axios.get(
        BASE_URL + `/api/audit_report_2/get/${id}`,
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
    // getFormDetails();
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
    validationSchema: auditReportStage2FormSchema,
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
            `/api/audit_report_2/${
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
              <h2 className="form-sub-title">Audit Report Stage 2 Form</h2>

              <fieldset disabled={state.role !== "Auditor"}>
                {Object.keys(CommonInputs).map((key, index) => (
                  <div className="input__container" key={key}>
                    <label htmlFor={key}>{`${CommonInputs[key]} :`}</label>
                    <input
                      type={index === 17 || index === 18 ? "date" : "text"}
                      name={`AuditReport_2.${key}`}
                      id={key}
                      value={values.AuditReport_2[key]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={`Enter ${CommonInputs[key]}`}
                    />
                    <div className="input__error-container">
                      {errors.AuditReport_2?.[key] ||
                      touched.AuditReport_2?.[key] ? (
                        <p className="input__error">
                          {errors.AuditReport_2?.[key]}
                        </p>
                      ) : null}
                    </div>
                  </div>
                ))}

                <h3 className="form-sub-title">Audit Conclusions</h3>
                {Object.keys(ComplianceInputs).map((key) => (
                  <div
                    key={key}
                    className="input__container checkbox-container"
                  >
                    <label>{ComplianceInputs[key]} :</label>
                    <label className="checkbox-label">
                      <input
                        type="radio"
                        name={`AuditConclu.[${key}]`}
                        value="Yes"
                        checked={values.AuditConclu[key] === "Yes"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <p>Yes</p>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="radio"
                        name={`AuditConclu.[${key}]`}
                        value="No"
                        checked={values.AuditConclu[key] === "No"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <p>No</p>
                    </label>
                    <div className="input__error-container">
                      {errors.AuditConclu?.[key] ||
                      touched.AuditConclu?.[key] ? (
                        <p className="input__error">
                          {errors.AuditConclu?.[key]}
                        </p>
                      ) : null}
                    </div>
                  </div>
                ))}

                <div className="input__container">
                  <label htmlFor="">Observation / Non Conformities :</label>
                  <table className="table-form">
                    <thead>
                      <tr>
                        <th>S.No.</th>
                        {Object.keys(NonConfirmitiesCols).map((columnKey) => (
                          <th key={columnKey}>
                            {NonConfirmitiesCols[columnKey]}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2].map((rowKey) => (
                        <tr key={rowKey} className="table-row">
                          <th
                            className={`row-head${
                              rowKey === "tot_emp" ? "--bold" : ""
                            }`}
                          >
                            {rowKey}
                          </th>
                          {Object.keys(NonConfirmitiesCols).map((columnKey) => (
                            <td key={`${rowKey + columnKey}`}>
                              <input
                                type="text"
                                name={`NonConfirm.[${rowKey - 1}].${columnKey}`}
                                value={
                                  values?.NonConfirm?.[rowKey - 1]?.[columnKey]
                                }
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              {touched?.NonConfirm?.[rowKey - 1]?.[columnKey] &&
                                errors?.NonConfirm?.[rowKey - 1]?.[
                                  columnKey
                                ] && (
                                  <div>
                                    {
                                      errors?.NonConfirm?.[rowKey - 1]?.[
                                        columnKey
                                      ]
                                    }
                                  </div>
                                )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="input__container">
                  <label htmlFor="">OPENING & CLOSING MEETING :</label>
                  <table className="table-form">
                    <thead>
                      <tr>
                        <th>S.No.</th>
                        {Object.keys(OpenCloseMeetCols).map((columnKey) => (
                          <th key={columnKey}>
                            {OpenCloseMeetCols[columnKey]}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2].map((rowKey) => (
                        <tr key={rowKey} className="table-row">
                          <th
                            className={`row-head${
                              rowKey === "tot_emp" ? "--bold" : ""
                            }`}
                          >
                            {rowKey}
                          </th>
                          {Object.keys(OpenCloseMeetCols).map((columnKey) => (
                            <td key={`${rowKey + columnKey}`}>
                              <input
                                type="text"
                                name={`OpenCloseMeet.[${
                                  rowKey - 1
                                }].${columnKey}`}
                                value={
                                  values?.OpenCloseMeet?.[rowKey - 1]?.[
                                    columnKey
                                  ]
                                }
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              {touched?.OpenCloseMeet?.[rowKey - 1]?.[
                                columnKey
                              ] &&
                                errors?.OpenCloseMeet?.[rowKey - 1]?.[
                                  columnKey
                                ] && (
                                  <div>
                                    {
                                      errors?.OpenCloseMeet?.[rowKey - 1]?.[
                                        columnKey
                                      ]
                                    }
                                  </div>
                                )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <h3 className="form-sub-title">
                  VERIFICATION OF RECORDS AS PER STD REQUIREMENT (C- Conformity,
                  NC-Non Conformity, O-Observation)
                </h3>
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
                              {Rows[rowKey]}
                            </th>
                            {Object.keys(index < 23 ? Columns : Columns2).map(
                              (columnKey, index) => (
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
                              )
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>

                <h3 className="form-sub-title">Summary of the Audit Team</h3>
                {OptionInputs.map((input) => {
                  return (
                    <div
                      key={input.name}
                      className={`input__container checkbox-container checkbox-container-vert ${input.key}`}
                    >
                      <label>{input.name}</label>
                      {input.options.map((option) => {
                        return (
                          <label key={option} className="checkbox-label">
                            <input
                              type="radio"
                              name={`Summary_Audit.${input.key}`}
                              value={option}
                              checked={
                                values.Summary_Audit[input.key] === option
                              }
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            <p>{option}</p>
                          </label>
                        );
                      })}
                      <div className="input__error-container">
                        {errors.Summary_Audit?.[input.key] ||
                        touched.Summary_Audit?.[input.key] ? (
                          <p className="input__error">
                            {errors.Summary_Audit?.[input.key]}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  );
                })}

                {Object.keys(RecomendDisclaimInputsAuditor).map(
                  (key, index) => (
                    <div className="input__container" key={key}>
                      <label
                        htmlFor={key}
                      >{`${RecomendDisclaimInputsAuditor[key]} :`}</label>
                      <input
                        type={
                          index === 0 || index === 3 || index === 5
                            ? "file"
                            : "text"
                        }
                        name={`Summary_Audit.${key}`}
                        id={key}
                        value={values.Summary_Audit[key]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder={`Enter ${RecomendDisclaimInputsAuditor[key]}`}
                      />
                      <div className="input__error-container">
                        {errors.Summary_Audit?.[key] ||
                        touched.Summary_Audit?.[key] ? (
                          <p className="input__error">
                            {errors.Summary_Audit?.[key]}
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

export default AuditReportStage2Form;
