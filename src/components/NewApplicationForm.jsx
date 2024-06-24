import { useEffect, useState } from "react";
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
import { useLocation, useNavigate } from "react-router-dom";

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
  certification_scheme: certificationSchemes[0],
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

const NewApplicationForm = () => {
  const [formLoading, setFormLoading] = useState(true);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [open, setOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [isLoading, setIsLoading] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [certification_type, setCertiScheme] = useState(1);
  const [initialForm, setInitialForm] = useState(initialValues);
  const { state } = useContext(AuthContext);
  const id = pathname.slice(13).slice(0, -16);

  const getNewApplicationDetails = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${state.token}` },
      };
      const res = await axios.get(
        BASE_URL + `/api/application_form/get_basic_application_form/${id}`,
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
    getNewApplicationDetails();
  }, []);

  const handleSubmitSurveillance = async () => {
    setIsLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${state.token}` },
      };
      const res = await axios.post(
        BASE_URL + "/api/application_form/create_basic_application_form",
        { certification_type: String(certification_type), ...initialValues },
        config
      );
      console.log(res);
      setAlertType("success");
      setAlertMsg("Application form created Successfully");
      setOpen(true);
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
    initialValues: initialForm,
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
    <>
      {formLoading ? (
        <div className="center">
          <Spinner size={50} />
        </div>
      ) : (
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
          {/* <div className="grid">
        <label className="card" htmlFor="radio1">
          <input
            name="plan"
            checked={certification_type == 1}
            onChange={() => setCertiScheme(1)}
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
            checked={certification_type == 2}
            onChange={() => setCertiScheme(2)}
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
            checked={certification_type == 3}
            onChange={() => setCertiScheme(3)}
            className="radio"
            type="radio"
            id="radio3"
          />
          <span className="plan-details" aria-hidden="true">
            <span className="plan-type">Recertification</span>
          </span>
        </label>
      </div> */}
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
              <h2 className="form-sub-title">New Application Form</h2>
              {certification_type !== 2 ? (
                <div className="registration__form">
                  <fieldset
                    disabled={
                      state.role === "Admin Auditor" ||
                      state.role === "Auditor" ||
                      state.role === "Client"
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
                          {certificationSchemes.map((scheme) => {
                            return (
                              <option value={scheme} key={scheme}>
                                {scheme}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  </fieldset>

                  {/* Submit */}
                  {/* {state.role === "Client" && (
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
              )} */}
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
      )}
    </>
  );
};

export default NewApplicationForm;
