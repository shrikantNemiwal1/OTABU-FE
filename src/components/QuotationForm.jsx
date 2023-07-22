import React, { useContext, useEffect, useState } from "react";
import {
  applicationFormSchema,
  quotationFormSchema,
} from "../validation/formSchema";
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
  date: "",
  ref: "",
  name: "",
  org_name: "",
  address: "",
  cetification: "",
  application_fees: "",
  stage_1_audit_fees: "",
  stage_2_audit_fees: "",
  total_first_year: "",
  surveillance_audit_fees: "",
  grand_total_fees_3_year: "",
  IMS_audit: "",
  eff_no_personnel: "",
  consdr_eff_no_personnel: "",
  audit_time_dtrmn_fact_applied: "",
  on_site_manday: "",
  off_site_manday: "",
  total_no_sites: "",
  consdrtn_initial_certifi: "",
  consdrtn_1st_surveil: "",
  consdrtn_2nd_surveil: "",
  otabu_sign: "",
  client_sign: "",
  client_name: "",
  client_seal: "",
};

const ClientInfoInputs = {
  ref: "Ref",
  name: "Client name",
  org_name: "Client organisation",
  address: "Client address",
  cetification: "Client certification",
};

const FeesInputs = {
  application_fees: "Application Fees (Non Refundable)",
  stage_1_audit_fees: "Stage 1 Audit Fees",
  stage_2_audit_fees: "Stage 2 Audit Fees (Certification Audit)",
  total_first_year: "Total  Fees for First year",
  surveillance_audit_fees: "Surveillance Audit Fees (Per Year)",
  grand_total_fees_3_year: "Grand Total  Fees for Three year",
};

const ApplicationForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(true);
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
        BASE_URL + `/api/quotation/get_quotation/${id}`,
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
    validationSchema: quotationFormSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      console.log(values);
      if (!dirty) {
        console.log("form unchanged");
        return;
      }
      setIsLoading(true);

      try {
        const response = await axios({
          method: "post",
          url: BASE_URL + `/api/quotation/create_quotation/${id}`,
          data: values,
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        });
        setAlertType("success");
        setAlertMsg("Form Submitted Successfully");
        setOpen(true);
        console.log(response);
        setTimeout(() => {
          navigate("/dashboard");
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
            <fieldset disabled={formDisabled}>
              <div className="registration__form">
                <h2 className="form-sub-title">Quotation Form</h2>

                <div className="input__container">
                  <label htmlFor="date">Date of application :</label>
                  <input
                    type="date"
                    name="date"
                    id="date"
                    value={values.date}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <div className="input__error-container">
                    {errors.date && touched.date ? (
                      <p className="input__error">{errors.date}</p>
                    ) : null}
                  </div>
                </div>

                {Object.keys(ClientInfoInputs).map((key) => (
                  <div className="input__container" key={key}>
                    <label htmlFor={key}>{`${ClientInfoInputs[key]} :`}</label>
                    <input
                      type="text"
                      name={key}
                      id={key}
                      value={values[key]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={`Enter ${ClientInfoInputs[key]}`}
                    />
                    <div className="input__error-container">
                      {errors[key] || touched[key] ? (
                        <p className="input__error">{errors[key]}</p>
                      ) : null}
                    </div>
                  </div>
                ))}

                {Object.keys(FeesInputs).map((key) => (
                  <div className="input__container" key={key}>
                    <label htmlFor={key}>{`${FeesInputs[key]} (in Rs):`}</label>
                    <input
                      type="tel"
                      name={key}
                      id={key}
                      value={values[key]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={`Enter ${FeesInputs[key]}`}
                      onKeyDown={(e) => {
                        const key = e.key;
                        if (
                          !/^\d$/.test(key) &&
                          key !== "Backspace" &&
                          key !== "Delete"
                        ) {
                          e.preventDefault();
                        }
                      }}
                    />
                    <div className="input__error-container">
                      {errors[key] || touched[key] ? (
                        <p className="input__error">{errors[key]}</p>
                      ) : null}
                    </div>
                  </div>
                ))}

                <div className="input__container checkbox-container">
                  <label>Integrated Management system & Audit</label>
                  <label className="checkbox-label">
                    <input
                      type="radio"
                      name="IMS_audit"
                      value="Yes"
                      checked={values.IMS_audit === "Yes"}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <p>Yes</p>
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="radio"
                      name="IMS_audit"
                      value="No"
                      checked={values.IMS_audit === "No"}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <p>No</p>
                  </label>
                  <div className="input__error-container">
                    {errors.OtabuOffUse?.proceed_4_review ||
                    touched.OtabuOffUse?.proceed_4_review ? (
                      <p className="input__error">
                        {errors.OtabuOffUse?.proceed_4_review}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="input__container">
                  <label htmlFor="eff_no_personnel">
                    Effective Number of Personnel :
                  </label>
                  <input
                    type="tel"
                    name="eff_no_personnel"
                    id="eff_no_personnel"
                    value={values.eff_no_personnel}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={(e) => {
                      const key = e.key;
                      if (
                        !/^\d$/.test(key) &&
                        key !== "Backspace" &&
                        key !== "Delete"
                      ) {
                        e.preventDefault();
                      }
                    }}
                    placeholder="Enter Effective Number of Personnel"
                  />
                  <div className="input__error-container">
                    {errors.eff_no_personnel && touched.eff_no_personnel ? (
                      <p className="input__error">{errors.eff_no_personnel}</p>
                    ) : null}
                  </div>
                </div>

                <div className="input__container">
                  <label htmlFor="consdr_eff_no_personnel">
                    Considerations for Determination of effective number of
                    Personnel :
                  </label>
                  <input
                    type="text"
                    name="consdr_eff_no_personnel"
                    id="consdr_eff_no_personnel"
                    value={values.consdr_eff_no_personnel}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Considerations for Determination of effective number of Personnel"
                  />
                  <div className="input__error-container">
                    {errors.consdr_eff_no_personnel &&
                    touched.consdr_eff_no_personnel ? (
                      <p className="input__error">
                        {errors.consdr_eff_no_personnel}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="input__container">
                  <label htmlFor="audit_time_dtrmn_fact_applied">
                    Audit time determination factors applied :
                  </label>
                  <input
                    type="text"
                    name="audit_time_dtrmn_fact_applied"
                    id="audit_time_dtrmn_fact_applied"
                    value={values.audit_time_dtrmn_fact_applied}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter Audit time determination factors applied"
                  />
                  <div className="input__error-container">
                    {errors.audit_time_dtrmn_fact_applied &&
                    touched.audit_time_dtrmn_fact_applied ? (
                      <p className="input__error">
                        {errors.audit_time_dtrmn_fact_applied}
                      </p>
                    ) : null}
                  </div>
                </div>

                <h3 className="form-sub-title">
                  Total Man-days Deliver at Client Site in Certification Cycle
                  (Might be change during the certification processes)
                </h3>

                <div className="input__container">
                  <label htmlFor="on_site_manday">On Site Manday :</label>
                  <input
                    type="tel"
                    name="on_site_manday"
                    id="on_site_manday"
                    value={values.on_site_manday}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={(e) => {
                      const key = e.key;
                      if (
                        !/^\d$/.test(key) &&
                        key !== "Backspace" &&
                        key !== "Delete"
                      ) {
                        e.preventDefault();
                      }
                    }}
                    placeholder="Enter On Site Manday"
                  />
                  <div className="input__error-container">
                    {errors.on_site_manday && touched.on_site_manday ? (
                      <p className="input__error">{errors.on_site_manday}</p>
                    ) : null}
                  </div>
                </div>

                <div className="input__container">
                  <label htmlFor="off_site_manday">
                    Off Site Manday (Report writing) :
                  </label>
                  <input
                    type="tel"
                    name="off_site_manday"
                    id="off_site_manday"
                    value={values.off_site_manday}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={(e) => {
                      const key = e.key;
                      if (
                        !/^\d$/.test(key) &&
                        key !== "Backspace" &&
                        key !== "Delete"
                      ) {
                        e.preventDefault();
                      }
                    }}
                    placeholder="Enter Off Site Manday"
                  />
                  <div className="input__error-container">
                    {errors.off_site_manday && touched.off_site_manday ? (
                      <p className="input__error">{errors.off_site_manday}</p>
                    ) : null}
                  </div>
                </div>

                <h3 className="form-sub-title">
                  Sites applicability and selection in audit (if sites
                  available)
                </h3>

                <div className="input__container">
                  <label htmlFor="otabu_sign">Otabu Sign :</label>
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

                <div className="input__container">
                  <label htmlFor="client_name">Client name :</label>
                  <input
                    type="text"
                    name="client_name"
                    id="client_name"
                    value={values.client_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter Client name"
                  />
                  <div className="input__error-container">
                    {errors.client_name && touched.client_name ? (
                      <p className="input__error">{errors.client_name}</p>
                    ) : null}
                  </div>
                </div>

                <div className="input__container">
                  <label htmlFor="client_sign">Client Sign :</label>
                  <input
                    type="file"
                    name="client_sign"
                    id="client_sign"
                    value={values.sign_otabu}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <div className="input__error-container">
                    {errors.client_sign && touched.client_sign ? (
                      <p className="input__error">{errors.client_sign}</p>
                    ) : null}
                  </div>
                </div>

                <div className="input__container">
                  <label htmlFor="client_seal">Client Seal :</label>
                  <input
                    type="file"
                    name="client_seal"
                    id="client_seal"
                    value={values.sign_otabu}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <div className="input__error-container">
                    {errors.client_seal && touched.client_seal ? (
                      <p className="input__error">{errors.client_seal}</p>
                    ) : null}
                  </div>
                </div>

                {/* Submit */}

                {state.role !== "Client" && (
                  <div className="input__container">
                    <button
                      className="registration__submit"
                      type="submit"
                      onClick={handleSubmit}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Spinner size={25} color="white" />
                      ) : (
                        "Submit"
                      )}
                    </button>
                  </div>
                )}
              </div>
            </fieldset>
          </form>
        </div>
      )}
    </>
  );
};

export default ApplicationForm;
