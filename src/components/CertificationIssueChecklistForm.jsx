import { useContext, useEffect, useState } from "react";
import { certificationIssueChecklistFormSchema } from "../validation/formSchema";
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
  application_review: "",
  lead_auditor: "",
  auditor: "",
  technical_expert: "",
  iaf_code: "",
  standard_4_certification: "",
  num_of_employees: "",
  mandays_planned: "",
  mandays_delivered: "",
  audit_stage_1_date: "",
  audit_stage_2_date: "",
  st_1_nc: "",
  st_2_nc: "",
  payment_received: "",
  tech_review_comnts_raised: "",
  tech_review_comnts_closed: "",
  statutory_requirements: "",
  date_of_certi_decision: "",
  report_checked_by_ao: "",
  report_checked_by_tm: "",
  tech_review_conduced_by: "",
  certificate_signed_by: "",
  date_of_completion: "",
};

const Inputs = {
  application_review: "Application Review",
  lead_auditor: "Lead Auditor",
  auditor: "Auditor",
  technical_expert: "Technical Expert",
  iaf_code: "IAF Code",
  standard_4_certification: "Standard for Certification",
  num_of_employees: "Number of Employees",
  mandays_planned: "Man-days Planned",
  mandays_delivered: "Man-days Delivered",
  audit_stage_1_date: "Audit Date - Stage 1",
  audit_stage_2_date: "Audit Date - Stage 2",
  st_1_nc: "CAR Received - St 1 NC",
  st_2_nc: "CAR Received - St 2 NC",
  payment_received: "Payment Received",
  tech_review_comnts_raised: "Technical Review on Dated (Comments Raised)",
  tech_review_comnts_closed: "Technical Review on Dated (Comments Closed)",
  statutory_requirements: "Statutory Requirements Verified in the Audit Report",
  date_of_certi_decision: "Date of Certification Decision",
  report_checked_by_ao: "Report Checked by AO",
  report_checked_by_tm: "Report Reviewed by TM",
  tech_review_conduced_by: "Technical Review Conducted by",
  certificate_signed_by: "Certificate Signed by MD",
  date_of_completion: "Date of Completion",
};

const CertificationIssueChecklistForm = () => {
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
        BASE_URL + `/api/certificate_issue_checklist/get/${id}`,
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
    validationSchema: certificationIssueChecklistFormSchema,
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
            `/api/certificate_issue_checklist/${
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
                Certification Issue Checklist Form
              </h2>

              <fieldset disabled={state.role === "Client"}>
                {Object.keys(Inputs).map((key, index) => (
                  <div className="input__container" key={key}>
                    <label htmlFor={key}>{`${Inputs[key]} :`}</label>
                    <input
                      type={
                        [9, 10, 14, 15, 22].includes(index) ? "date" : "text"
                      }
                      name={key}
                      id={key}
                      value={values?.[key]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={`Enter ${Inputs[key]}`}
                    />
                    <div className="input__error-container">
                      {errors?.[key] || touched?.[key] ? (
                        <p className="input__error">{errors?.[key]}</p>
                      ) : null}
                    </div>
                  </div>
                ))}
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

export default CertificationIssueChecklistForm;
