import React, { useContext, useEffect, useState } from "react";
import { intimationLetter1FormSchema } from "../validation/formSchema";
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

const inputs = {
  date: "Date",
  ref: "Ref No.",
  name: "Client name",
  org_name: "Org Name",
  address: "Address",
  subject: "Subject",
  scheduled_date: "Scheduled Date",
  team_leader: "Team Leader",
};

const initialValues = {
  date: "",
  ref: "",
  name: "",
  org_name: "",
  address: "",
  subject: "",
  scheduled_date: "",
  team_leader: "",
  otabu_sign: "",
};

const IntimationLetter = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMsg, setAlertMsg] = useState("");
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { state } = useContext(AuthContext);
  const id = pathname.slice(13).slice(0, -20);
  const [initialForm, setInitialForm] = useState(initialValues);
  const stage = pathname.slice(-1);

  const getFormDetails = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${state.token}` },
      };
      const res = await axios.get(
        BASE_URL +
          `/api/intimation_letter_${stage}/get_intimation_${stage}/${id}`,
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
    validationSchema: intimationLetter1FormSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      console.log(values);
      if (!dirty) {
        console.log("form unchanged");
        return;
      }
      setIsLoading(true);

      const formValues = values;

      try {
        const response = await axios({
          method: formSubmitted ? "put" : "post",
          url:
            BASE_URL +
            `/api/intimation_letter_${stage}/${
              formSubmitted
                ? `update_intimation_${stage}`
                : `create_intimation_${stage}`
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
              <h2 className="form-sub-title">Intimation Letter {stage} Form</h2>

              <fieldset disabled={state.role !== "Admin Auditor"}>
                {Object.keys(inputs).map((key, index) => (
                  <div className="input__container" key={key}>
                    <label htmlFor={key}>{`${inputs[key]} :`}</label>
                    <input
                      type={index === 0 || index === 6 ? "date" : "text"}
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
                  <label htmlFor="otabu_sign">Signature :</label>
                  <input
                    type="file"
                    name="otabu_sign"
                    id="otabu_sign"
                    value={values.sign_otabu}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <div className="input__error-container">
                    {errors.otabu_sign && touched.otabu_sign ? (
                      <p className="input__error">{errors.otabu_sign}</p>
                    ) : null}
                  </div>
                </div>
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
                    ) : formSubmitted ? (
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

export default IntimationLetter;
