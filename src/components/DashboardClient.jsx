import { useState } from "react";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;
import "./styles/dashboardDefault.scss";
import Spinner from "./Spinner";
import "./styles/radioCards.scss";
import { useFormik } from "formik";
import { basicApplicationFormSchema } from "../validation/formSchema";
import { useNavigate } from "react-router-dom";

const certificationSchemes = [
  "ISO 9001",
  "ISO 14001",
  "ISO 45001",
  "IMS(9,14,45)",
  "IMS(9,14)",
  "IMS(9,45)",
  "IMS(14,45)",
];

const initialValues = {
  certification_scheme: 1,
  name_of_company: "",
  scope_of_certification: "",
  address: "",
  Website: "",
  email: "",
  phone_number: "",
  contact_person_name: "",
  contact_person_design: "",
};

const inputs = {
  name_of_company: "Name Of the Company",
  scope_of_certification: "Scope of Certification",
  address: "Address",
  Website: "Website",
  email: "Email",
  phone_number: "Phone Number",
  contact_person_name: "Contact Person Name",
  contact_person_design: "Contact Person Designation",
};

const DashboardClient = () => {
  const [open, setOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [isLoading, setIsLoading] = useState(false);
  const { state } = useContext(AuthContext);
  const [certification_type, setCertiScheme] = useState(
    "Initial Certification"
  );
  const navigate = useNavigate();

  const handleSubmitSurveillance = async () => {
    setIsLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${state.token}` },
      };
      const res = await axios.post(
        BASE_URL + "/api/application_form/create_basic_application_form",
        { certification_type: certification_type, ...initialValues },
        config
      );
      console.log(res);
      setAlertType("success");
      setAlertMsg("Application form created Successfully");
      setOpen(true);
      navigate("/dashboard/active-certifications?refresh=true");
    } catch (error) {
      setAlertType("error");
      setAlertMsg(error?.response?.data?.msg);
      setOpen(true);
    }
    setIsLoading(false);
  };

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    dirty,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: basicApplicationFormSchema,
    enableReinitialize: true,
    onSubmit: async (values, actions) => {
      console.log(values);
      if (!dirty) {
        console.log("form unchanged");
        return;
      }
      setIsLoading(true);

      const formValues = {
        certification_type: String(certification_type),
        ...values,
      };
      console.log(formValues);

      try {
        const response = await axios({
          method: "post",
          url: BASE_URL + "/api/application_form/create_basic_application_form",
          data: formValues,
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        });
        actions.resetForm();
        console.log(response);
        setAlertType("success");
        setAlertMsg("Form Submitted Successfully");
        navigate("/dashboard/active-certifications?refresh=true");
        setOpen(true);
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
    <div>
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
      <div className="grid">
        <label className="card" htmlFor="radio1">
          <input
            name="plan"
            checked={certification_type == "Initial Certification"}
            onChange={() => setCertiScheme("Initial Certification")}
            className="radio"
            type="radio"
            id="radio1"
          />
          <span className="plan-details">
            <span className="plan-type">Initial Certification</span>
          </span>
        </label>
        <label className="card" htmlFor="radio2">
          <input
            name="plan"
            checked={certification_type == "Surveillance Certification"}
            onChange={() => setCertiScheme("Surveillance Certification")}
            className="radio"
            type="radio"
            id="radio2"
          />
          <span className="plan-details" aria-hidden="true">
            <span className="plan-type">Surveillance Certification</span>
          </span>
        </label>
        <label className="card" htmlFor="radio3">
          <input
            name="plan"
            checked={certification_type == "Recertification"}
            onChange={() => setCertiScheme("Recertification")}
            className="radio"
            type="radio"
            id="radio3"
          />
          <span className="plan-details" aria-hidden="true">
            <span className="plan-type">Recertification</span>
          </span>
        </label>
        <label className="card" htmlFor="radio4">
          <input
            name="plan"
            checked={certification_type == "Transfer Certification"}
            onChange={() => setCertiScheme("Transfer Certification")}
            className="radio"
            type="radio"
            id="radio4"
          />
          <span className="plan-details" aria-hidden="true">
            <span className="plan-type">Transfer Certification</span>
          </span>
        </label>
      </div>
      <div className="registration registration--basic-form">
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
          {certification_type !== "Surveillance Certification" ? (
            <div className="registration__form">
              <fieldset
                disabled={
                  state.role === "Admin Auditor" || state.role === "Auditor"
                }
              >
                {Object.keys(inputs).map((key) => (
                  <div className="input__container" key={key}>
                    <label htmlFor={key}>{`${inputs[key]} :`}</label>
                    <input
                      type={"text"}
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
                <div className="input__container">
                  <label htmlFor="standard">
                    Select Certification Scheme :
                  </label>
                  <div className="custom-select" id="standard">
                    <select
                      name={`certification_scheme`}
                      id={`certification_scheme`}
                      value={values.certification_scheme}
                      onChange={handleChange}
                    >
                      {certificationSchemes.map((scheme, index) => {
                        return (
                          <option value={index + 1} key={scheme}>
                            {scheme}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </fieldset>

              {/* Submit */}
              {state.role === "Client" && (
                <div className="input__container">
                  <button
                    className="registration__submit"
                    type="submit"
                    onClick={handleSubmit}
                    disabled={isLoading}
                  >
                    {isLoading ? <Spinner size={25} color="white" /> : "Submit"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="input__container">
              <button
                className="registration__submit"
                type="submit"
                onClick={handleSubmitSurveillance}
                disabled={isLoading}
              >
                {isLoading ? <Spinner size={25} color="white" /> : "Send"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default DashboardClient;
