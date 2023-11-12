import { useContext, useEffect, useState } from "react";
import { technicalCommitteeReportFormSchema } from "../validation/formSchema";
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

const initialValues = {
  TechCommitteeReport_1: {
    org_name: "",
    app_ref: "",
    audit_site: "",
    audit_standard: "",
    contact_person: "",
    mobile: "",
    position: "",
    audit_certi_scope: "",
    industry_code: "",
    exclusion: "",
    last_int_audit_date: "",
    last_mrm_date: "",
    comments_on_app_review: "",
    comments_on_app_reviewer: "",
    date_stage_1_audit: "",
    stage_1_team_lead: "",
    stage_1_auditor: "",
    stage_1_tech_expert: "",
    comments_stage_1_mandays: "",
    com_stage_1_audit_report: "",
    audit_rept_remarks: "",
    audit_rept_non_confirm: "",
  },

  TechCommitteeReport_2: {
    date_stage_2_audit: "",
    comments_stage_2_mandays: "",
    stage_2_team_lead: "",
    stage_2_auditor: "",
    stage_2_tech_expert: "",
    com_stage_2_audit_report: "",
    audit_rept_non_confirm: "",
    payment_status_full: "",
    payment_status_remark: "",
    decision_about_certi: "",
    decision_date: "",
    certi_name1: "",
    certi_position1: "",
    certi_sign1: "",
    certi_name2: "",
    certi_position2: "",
    certi_sign2: "",
    certi_name3: "",
    certi_position3: "",
    certi_sign3: "",
    certi_issue_date: "",
    certi_expiry_date: "",
    certi_no: "",
    surveil_1_due_date: "",
    surveil_2_due_date: "",
  },

  Surveillance_1: {
    audit_date: "",
    audit_mandays: "",
    audit_team_lead: "",
    last_int_audit_date: "",
    last_mrm_date: "",
    comments_team_lead: "",
    comments_team_member: "",
    comments_tech_expert: "",
    comments_surveil_1_audit: "",
    com_payment_status_full: "",
    com_payment_status_remark: "",
    decision: "",
    decision_date: "",
    decided_tech_com: "",
    name1: "",
    position1: "",
    sign1: "",
    name2: "",
    position2: "",
    sign2: "",
    tech_expert_name3: "",
    position3: "",
    sign3: "",
  },

  Surveillance_2: {
    audit_date: "",
    audit_mandays: "",
    audit_team_lead: "",
    last_int_audit_date: "",
    last_mrm_date: "",
    comments_team_lead: "",
    comments_team_member: "",
    comments_tech_expert: "",
    comments_surveil_1_audit: "",
    com_payment_status_full: "",
    com_payment_status_remark: "",
    decision: "",
    decision_date: "",
    decided_tech_com: "",
    name1: "",
    position1: "",
    sign1: "",
    name2: "",
    position2: "",
    sign2: "",
    tech_expert_name3: "",
    position3: "",
    sign3: "",
  },
};

const Inputs = {
  TechCommitteeReport_1: {
    org_name: "Organization’s name",
    app_ref: "Application Ref",
    audit_site: "Audit Site",
    audit_standard: "Audit Standard",
    contact_person: "Contact Person",
    mobile: "Mobile No",
    position: "Position",
    audit_certi_scope: "Audit / Certification Scope",
    industry_code: "Industry Code",
    exclusion: "Exclusion (If Any)",
    last_int_audit_date: "Last Internal Audit Date",
    last_mrm_date: "Last MRM Date",
    comments_on_app_review: "Comments on Application / Contract Review Process",
    comments_on_app_reviewer: "Comments on Application Reviewer",
    date_stage_1_audit: "Date of Stage 1 Audit",
    stage_1_team_lead: "Stage 1 Audit Team Leader",
    stage_1_auditor: "Stage 1 Auditor",
    stage_1_tech_expert: "Stage 1 Tech Expert/ Trainee Auditor",
    comments_stage_1_mandays: "Comments on Stage 1 Audit Man Days",
    com_stage_1_audit_report: "Comments on Stage 1 Audit Report",
    audit_rept_remarks: "Remarks in Stage 1 Audit Report",
    audit_rept_non_confirm:
      "Major/Minor Non Conformities and Remarks in Stage 1 Audit Report",
  },
  TechCommitteeReport_2: {
    date_stage_2_audit: "Date of Stage 2 Audit",
    comments_stage_2_mandays: "Comments on Stage 2 Audit Man Days",
    stage_2_team_lead: "Stage 2 Audit Team Leader",
    stage_2_auditor: "Stage 2 Auditor",
    stage_2_tech_expert: "Stage 2 Tech Expert/ Trainee Auditor",
    com_stage_2_audit_report: "Comments on Stage 2 Audit Report",
    audit_rept_non_confirm:
      "Major/Minor Non Conformities and Remarks in Stage 2 Audit Report",
    payment_status_full: "Payment Received Status (Full Payment)",
    payment_status_remark: "Remarks on Payment Status",
    decision_about_certi: "Decision About Certificate of Conformity",
    decision_date: "Decision Date",
    certi_name1: "Certification Committee Member 1 (Name)",
    certi_position1: "Certification Committee Member 1 (Position)",
    certi_sign1: "Certification Committee Member 1 (Signature)",
    certi_name2: "Certification Committee Member 2 (Name)",
    certi_position2: "Certification Committee Member 2 (Position)",
    certi_sign2: "Certification Committee Member 2 (Signature)",
    certi_name3: "Certification Committee Member 3 (Name)",
    certi_position3: "Certification Committee Member 3 (Position)",
    certi_sign3: "Certification Committee Member 3 (Signature)",
    certi_issue_date: "Certificate Issue Date",
    certi_expiry_date: "Certificate Expiry Date",
    certi_no: "Certificate Number",
    surveil_1_due_date: "1st Surveillance Due Date",
    surveil_2_due_date: "2nd Surveillance Due Date",
  },
  Surveillance_1: {
    audit_date: "1st Surveillance Audit Date",
    audit_mandays: "1st Surveillance Audit Man Days",
    audit_team_lead: "1st Surveillance Audit Team Leader",
    last_int_audit_date: "Last Internal Audit Date",
    last_mrm_date: "Last MRM Date",
    comments_team_lead: "Comments by 1st Surveillance Audit Team Leader",
    comments_team_member: "Comments by 1st Surveillance Audit Team Member",
    comments_tech_expert:
      "Comments by 1st Surveillance Audit Tech Expert/Trainee Auditor",
    comments_surveil_1_audit:
      "Comments about 1st Surveillance Audit (Man days, Audit report)",
    com_payment_status_full: "Payment Received Status (Full Payment)",
    com_payment_status_remark: "Remarks on Payment Status",
    decision: "Decision",
    decision_date: "Decision Date",
    decided_tech_com: "Decided by Technical Committee",
    name1: "Technical Committee Member 1 (Name)",
    position1: "Technical Committee Member 1 (Position)",
    sign1: "Technical Committee Member 1 (Signature)",
    name2: "Technical Committee Member 2 (Name)",
    position2: "Technical Committee Member 2 (Position)",
    sign2: "Technical Committee Member 2 (Signature)",
    tech_expert_name3: "Technical Expert 3 (Name)",
    position3: "Technical Expert 3 (Position)",
    sign3: "Technical Expert 3 (Signature)",
  },
  Surveillance_2: {
    audit_date: "2nd Surveillance Audit Date",
    audit_mandays: "2nd Surveillance Audit Man Days",
    audit_team_lead: "2nd Surveillance Audit Team Leader",
    last_int_audit_date: "Last Internal Audit Date",
    last_mrm_date: "Last MRM Date",
    comments_team_lead: "Comments by 2nd Surveillance Audit Team Leader",
    comments_team_member: "Comments by 2nd Surveillance Audit Team Member",
    comments_tech_expert:
      "Comments by 2nd Surveillance Audit Tech Expert/Trainee Auditor",
    comments_surveil_1_audit:
      "Comments about 2nd Surveillance Audit (Man days, Audit report)",
    com_payment_status_full: "Payment Received Status (Full Payment)",
    com_payment_status_remark: "Remarks on Payment Status",
    decision: "Decision",
    decision_date: "Decision Date",
    decided_tech_com: "Decided by Certification Committee",
    name1: "Certification Committee Member 1 (Name)",
    position1: "Certification Committee Member 1 (Position)",
    sign1: "Certification Committee Member 1 (Signature)",
    name2: "Certification Committee Member 2 (Name)",
    position2: "Certification Committee Member 2 (Position)",
    sign2: "Certification Committee Member 2 (Signature)",
    tech_expert_name3: "Technical Expert 3 (Name)",
    position3: "Technical Expert 3 (Position)",
    sign3: "Technical Expert 3 (Signature)",
  },
};

const TechnicalCommitteeReportForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formDisabled, setFormDisabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMsg, setAlertMsg] = useState("");
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { state } = useContext(AuthContext);
  const id = pathname.slice(13).slice(0, -15);

  const [initialForm, setInitialForm] = useState(initialValues);

  const getFormDetails = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${state.token}` },
      };
      const res = await axios.get(
        BASE_URL + `/api/tech_committee_report/get/${id}`,
        config
      );
      console.log(res?.data);
      setInitialForm(res?.data);
      setFormDisabled(true);
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
    validationSchema: technicalCommitteeReportFormSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      console.log(values);
      if (!dirty) {
        console.log("form unchanged");
        return;
      }
      setIsLoading(true);

      const formValues = formDisabled
        ? changedDivisions(initialForm, values)
        : values;

      try {
        const response = await axios({
          method: formDisabled ? "patch" : "post",
          url:
            BASE_URL +
            `/api/tech_committee_report/${
              formDisabled ? "partial_update" : "create"
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
              <h2 className="form-sub-title">
                Technical Committee Report Form
              </h2>

              <fieldset disabled={state.role === "Client"}>
                {Object.keys(Inputs).map((InputBlockKey) =>
                  Object.keys(Inputs[InputBlockKey]).map((key) => (
                    <div className="input__container" key={key}>
                      <label
                        htmlFor={key}
                      >{`${Inputs[InputBlockKey][key]} :`}</label>
                      <input
                        type={
                          (InputBlockKey === "TechCommitteeReport_1" &&
                            (key === "last_int_audit_date" ||
                              key === "last_mrm_date" ||
                              key === "date_stage_1_audit")) ||
                          (InputBlockKey === "TechCommitteeReport_2" &&
                            (key === "date_stage_2_audit" ||
                              key === "decision_date" ||
                              key === "certi_issue_date" ||
                              key === "certi_expiry_date" ||
                              key === "surveil_1_due_date" ||
                              key === "surveil_2_due_date")) ||
                          ((InputBlockKey === "Surveillance_1" ||
                            InputBlockKey === "Surveillance_2") &&
                            (key === "audit_date" ||
                              key === "last_int_audit_date" ||
                              key === "last_mrm_date" ||
                              key === "decision_date"))
                            ? "date"
                            : (InputBlockKey === "TechCommitteeReport_2" &&
                                (key === "certi_sign1" ||
                                  key === "certi_sign2" ||
                                  key === "certi_sign3")) ||
                              ((InputBlockKey === "Surveillance_1" ||
                                InputBlockKey === "Surveillance_2") &&
                                (key === "sign1" ||
                                  key === "sign2" ||
                                  key === "sign3"))
                            ? "file"
                            : "text"
                        }
                        name={`${InputBlockKey}.${key}`}
                        id={key}
                        value={values?.[InputBlockKey]?.[key]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder={`Enter ${Inputs[InputBlockKey][key]}`}
                      />
                      <div className="input__error-container">
                        {errors?.[InputBlockKey]?.[key] ||
                        touched?.[InputBlockKey]?.[key] ? (
                          <p className="input__error">
                            {errors?.[InputBlockKey]?.[key]}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  ))
                )}
              </fieldset>

              {/* Submit */}

              <div className="input__container">
                <button
                  className="registration__submit"
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Spinner size={25} color="white" />
                  ) : formDisabled && state.role !== "Client" ? (
                    "Update"
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default TechnicalCommitteeReportForm;
