import React, { useContext, useEffect, useState } from "react";
import { applicationFormSchema } from "../validation/formSchema";
import { useFormik } from "formik";
import "./styles/registration.scss";
import "./styles/checkbox.scss";
import Spinner from "./Spinner";
import {
  formatLabel,
  formatLegalKey,
  ApplicationFormInputs,
  IntegratedCertiYesNoInputs,
  EMSYesNoInputs,
  OHSASInputs,
  ISO27001Inputs,
  ISO50001Inputs,
  ISO22000Inputs,
  columns,
  rows,
  tableColumnKeys,
  initialValues,
  acciStatColkeys,
  acciStatRowkeys,
  changedDivisions,
} from "./ApplicationFormHelper";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ApplicationForm = () => {
  const checkboxKeys = Object.keys(initialValues.CertificationScheme);
  const legalStatusKeys = Object.keys(initialValues.LegalStatus);
  const [isLoading, setIsLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(true);
  const [formDisabled, setFormDisabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMsg, setAlertMsg] = useState("");
  const columnKeys = Object.keys(tableColumnKeys);
  const rowKeys = Object.keys(initialValues.PermanentEmployee);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { state } = useContext(AuthContext);
  const id = pathname.slice(13).slice(0, -17);

  const [initialForm, setInitialForm] = useState(initialValues);

  const getFormDetails = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${state.token}` },
      };
      const res = await axios.get(
        BASE_URL + `/api/application_form/get_single_application/${id}`,
        config
      );
      console.log(res?.data);
      setInitialForm(res?.data);
      state.role === "Client" ? setFormDisabled(true) : null;
      initialForm.Status === "Application Rejected"
        ? setFormDisabled(false)
        : null;
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
    validationSchema: applicationFormSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      console.log(values);
      if (!dirty) {
        console.log("form unchanged");
        return;
      }
      setIsLoading(true);

      const formValues =
        state.role !== "Client" ||
        initialForm?.Status === "Application Rejected"
          ? changedDivisions(initialForm, values)
          : values;

      const config = {
        headers: { Authorization: `Bearer ${state.token}` },
      };
      try {
        const response = await axios({
          method:
            initialForm?.Status === "Application Rejected"
              ? "patch"
              : state.role === "Client"
              ? "post"
              : "patch",
          url:
            BASE_URL +
            `/api/application_form/${
              initialForm?.Status === "Application Rejected"
                ? "partial_update"
                : state.role === "Client"
                ? "create"
                : "partial_update"
            }/${id}`,
          data: formValues,
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        });
        setAlertType("success");
        setAlertMsg("Form Submitted Successfully");
        setOpen(true);
        console.log(response);
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
            <fieldset
              disabled={
                initialForm?.Status === "Application Rejected"
                  ? false
                  : formDisabled
              }
            >
              <div className="registration__form">
                {/* ApplicationForm */}
                <>
                  <h2 className="form-sub-title">Application Form</h2>

                  <div className="input__container">
                    <label htmlFor="ApplicationForm.date_of_app">
                      Date of application :
                    </label>
                    <input
                      type="date"
                      name="ApplicationForm.date_of_app"
                      id="ApplicationForm.date_of_app"
                      value={values.ApplicationForm.date_of_app}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <div className="input__error-container">
                      {errors.ApplicationForm?.date_of_app &&
                      touched.ApplicationForm?.date_of_app ? (
                        <p className="input__error">
                          {errors.ApplicationForm.date_of_app}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  {Object.keys(ApplicationFormInputs).map((key) => (
                    <div className="input__container" key={key}>
                      <label htmlFor={`ApplicationForm.${key}`}>
                        {`${ApplicationFormInputs[key]} :`}
                      </label>
                      <input
                        type="text"
                        name={`ApplicationForm.${key}`}
                        id={`ApplicationForm.${key}`}
                        value={values.ApplicationForm[key]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder={`Enter ${ApplicationFormInputs[key]}`}
                      />
                      <div className="input__error-container">
                        {errors.ApplicationForm?.[key] ||
                        touched.ApplicationForm?.[key] ? (
                          <p className="input__error">
                            {errors.ApplicationForm?.[key]}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  ))}

                  <h2 className="form-sub-title">Details of employees</h2>

                  <div className="input__container">
                    <table className="table-form">
                      <thead>
                        <tr>
                          <th></th>
                          {columnKeys.map((columnKey) => (
                            <th className="column-head-small" key={columnKey}>
                              {columns[columnKey]}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {rowKeys.map((rowKey) => (
                          <tr key={rowKey} className="table-row">
                            <th
                              className={`row-head${
                                rowKey === "tot_emp" ? "--bold" : ""
                              }`}
                            >
                              {rows[rowKey]}
                            </th>
                            {columnKeys.map((columnKey) => (
                              <td key={`${columnKey}-${rowKey}`}>
                                <input
                                  type="tel"
                                  name={`${columnKey}.${rowKey}`}
                                  value={values?.[columnKey]?.[rowKey]}
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
                                />
                                {touched[columnKey]?.[rowKey] &&
                                  errors[columnKey]?.[rowKey] && (
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
                {/* Legal Status */}
                <>
                  <div className="input__container checkbox-container">
                    <label htmlFor="">Legal status :</label>
                    {legalStatusKeys.map((key) => (
                      <label key={key} className="checkbox-label">
                        <input
                          type="checkbox"
                          name={`LegalStatus.${key}`}
                          checked={values.LegalStatus[key] === "Yes"}
                          onChange={(e) =>
                            setFieldValue(
                              `LegalStatus.${key}`,
                              e.target.checked ? "Yes" : "No"
                            )
                          }
                          onBlur={handleBlur}
                        />
                        <p>{formatLegalKey(key)}</p>
                      </label>
                    ))}
                  </div>
                  <div className="input__container">
                    <div className="input__error-container">
                      {(errors.LegalStatus || touched.LegalStatus) && (
                        <p className="input__error">{errors.LegalStatus}</p>
                      )}
                    </div>
                  </div>
                </>
                {/* Certification Scheme */}
                <>
                  <div className="input__container checkbox-container">
                    <label htmlFor="">Certification scheme :</label>
                    {checkboxKeys.map((key) => (
                      <label key={key} className="checkbox-label">
                        <input
                          type="checkbox"
                          name={`CertificationScheme.${key}`}
                          checked={values.CertificationScheme[key] === "Yes"}
                          onChange={(e) =>
                            setFieldValue(
                              `CertificationScheme.${key}`,
                              e.target.checked ? "Yes" : "No"
                            )
                          }
                          onBlur={handleBlur}
                        />
                        <p>{formatLabel(key)}</p>
                      </label>
                    ))}
                  </div>
                  <div className="input__container">
                    <div className="input__error-container">
                      {(errors.CertificationScheme ||
                        touched.CertificationScheme) && (
                        <p className="input__error">
                          {errors.CertificationScheme}
                        </p>
                      )}
                    </div>
                  </div>
                </>
                {/* Integrated Certification */}
                <>
                  <h2 className="form-sub-title">
                    If Integrated Certification need than please answer below
                    questions?
                  </h2>

                  {Object.keys(IntegratedCertiYesNoInputs).map((key) => (
                    <div
                      className="input__container checkbox-container"
                      key={key}
                    >
                      <label>{`${IntegratedCertiYesNoInputs[key]} :`}</label>
                      <label className="checkbox-label">
                        <input
                          type="radio"
                          name={`IntegratedCerti.${key}`}
                          value="Yes"
                          checked={values.IntegratedCerti[key] === "Yes"}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <p>Yes</p>
                      </label>
                      <label className="checkbox-label">
                        <input
                          type="radio"
                          name={`IntegratedCerti.${key}`}
                          value="No"
                          checked={values.IntegratedCerti[key] === "No"}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <p>No</p>
                      </label>
                      <div className="input__error-container">
                        {errors.IntegratedCerti?.[key] ||
                        touched.IntegratedCerti?.[key] ? (
                          <p className="input__error">
                            {errors.IntegratedCerti?.[key]}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  ))}

                  <div className="input__container checkbox-container">
                    <label>
                      Please confirm the preferred language for the conduct of
                      the audit :
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="radio"
                        name="IntegratedCerti.conduct_language"
                        value="English"
                        checked={
                          values.IntegratedCerti.conduct_language === "English"
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <p>English</p>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="radio"
                        name="IntegratedCerti.conduct_language"
                        value="Hindi"
                        checked={
                          values.IntegratedCerti.conduct_language === "Hindi"
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <p>Hindi</p>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="radio"
                        name="IntegratedCerti.conduct_language"
                        value="Both"
                        checked={
                          values.IntegratedCerti.conduct_language === "Both"
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <p>Both</p>
                    </label>
                    <div className="input__error-container">
                      {errors.IntegratedCerti?.conduct_language ||
                      touched.IntegratedCerti?.conduct_language ? (
                        <p className="input__error">
                          {errors.IntegratedCerti?.conduct_language}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="input__container checkbox-container">
                    <label>Certification Program Required :</label>
                    <label className="checkbox-label">
                      <input
                        type="radio"
                        name="IntegratedCerti.certi_program_req"
                        value="Initial"
                        checked={
                          values.IntegratedCerti.certi_program_req === "Initial"
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <p>Initial</p>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="radio"
                        name="IntegratedCerti.certi_program_req"
                        value="Surveillance"
                        checked={
                          values.IntegratedCerti.certi_program_req ===
                          "Surveillance"
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <p>Surveillance</p>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="radio"
                        name="IntegratedCerti.certi_program_req"
                        value="Recertification"
                        checked={
                          values.IntegratedCerti.certi_program_req ===
                          "Recertification"
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <p>Recertification</p>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="radio"
                        name="IntegratedCerti.certi_program_req"
                        value="Transfer"
                        checked={
                          values.IntegratedCerti.certi_program_req ===
                          "Transfer"
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <p>Transfer</p>
                    </label>
                    <div className="input__error-container">
                      {errors.IntegratedCerti?.certi_program_req ||
                      touched.IntegratedCerti?.certi_program_req ? (
                        <p className="input__error">
                          {errors.IntegratedCerti?.certi_program_req}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="input__container checkbox-container">
                    <label>
                      In the case of several certification programmes, would you
                      like the audits to be Combined or carried out separately?
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="radio"
                        name="IntegratedCerti.combined_audit"
                        value="Yes"
                        checked={
                          values.IntegratedCerti.combined_audit === "Yes"
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <p>Yes</p>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="radio"
                        name="IntegratedCerti.combined_audit"
                        value="No"
                        checked={values.IntegratedCerti.combined_audit === "No"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <p>No</p>
                    </label>
                    <div className="input__error-container">
                      {errors.IntegratedCerti?.combined_audit ||
                      touched.IntegratedCerti?.combined_audit ? (
                        <p className="input__error">
                          {errors.IntegratedCerti?.combined_audit}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="input__container">
                    <label htmlFor="IntegratedCerti.combined_audit_combination">
                      If the answer is Yes, please specify which combination :
                    </label>
                    <input
                      type="text"
                      name="IntegratedCerti.combined_audit_combination"
                      id="IntegratedCerti.combined_audit_combination"
                      value={values.IntegratedCerti.combined_audit_combination}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter combination"
                    />
                    <div className="input__error-container">
                      {errors.IntegratedCerti?.combined_audit_combination &&
                      touched.IntegratedCerti?.combined_audit_combination ? (
                        <p className="input__error">
                          {errors.IntegratedCerti.combined_audit_combination}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="input__container checkbox-container">
                    <label>Is Already Certified for any Standard?</label>
                    <label className="checkbox-label">
                      <input
                        type="radio"
                        name="IntegratedCerti.already_certi_standard"
                        value="Yes"
                        checked={
                          values.IntegratedCerti.already_certi_standard ===
                          "Yes"
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <p>Yes</p>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="radio"
                        name="IntegratedCerti.already_certi_standard"
                        value="No"
                        checked={
                          values.IntegratedCerti.already_certi_standard === "No"
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <p>No</p>
                    </label>
                    <div className="input__error-container">
                      {errors.IntegratedCerti?.already_certi_standard ||
                      touched.IntegratedCerti?.already_certi_standard ? (
                        <p className="input__error">
                          {errors.IntegratedCerti?.already_certi_standard}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="input__container">
                    <label htmlFor="IntegratedCerti.name_of_standard">
                      If Answer is Yes Mention Name of the Standard :
                    </label>
                    <input
                      type="text"
                      name="IntegratedCerti.name_of_standard"
                      id="IntegratedCerti.name_of_standard"
                      value={values.IntegratedCerti.name_of_standard}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter name of standard"
                    />
                    <div className="input__error-container">
                      {errors.IntegratedCerti?.name_of_standard &&
                      touched.IntegratedCerti?.name_of_standard ? (
                        <p className="input__error">
                          {errors.IntegratedCerti.name_of_standard}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="input__container">
                    <label htmlFor="IntegratedCerti.key_process">
                      Key Process Involved :
                    </label>
                    <input
                      type="text"
                      name="IntegratedCerti.key_process"
                      id="IntegratedCerti.key_process"
                      value={values.IntegratedCerti.key_process}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter key process involved"
                    />
                    <div className="input__error-container">
                      {errors.IntegratedCerti?.key_process &&
                      touched.IntegratedCerti?.key_process ? (
                        <p className="input__error">
                          {errors.IntegratedCerti.key_process}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </>
                {/* EMS */}
                <>
                  <h2 className="form-sub-title">
                    Additional Information Required (EMS):
                  </h2>

                  {Object.keys(EMSYesNoInputs).map((key) => (
                    <div
                      className="input__container checkbox-container"
                      key={key}
                    >
                      <label>{`${EMSYesNoInputs[key]}`}</label>
                      <label className="checkbox-label">
                        <input
                          type="radio"
                          name={`EMS.${key}`}
                          value="Yes"
                          checked={values.EMS[key] === "Yes"}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <p>Yes</p>
                      </label>
                      <label className="checkbox-label">
                        <input
                          type="radio"
                          name={`EMS.${key}`}
                          value="No"
                          checked={values.EMS[key] === "No"}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <p>No</p>
                      </label>
                      <div className="input__error-container">
                        {errors.EMS?.[key] || touched.EMS?.[key] ? (
                          <p className="input__error">{errors.EMS?.[key]}</p>
                        ) : null}
                      </div>
                    </div>
                  ))}

                  <div className="input__container">
                    <label htmlFor="EMS.sig_environ_sum">
                      Please summarise the significant Environmental Aspects
                      that you have identified :
                    </label>
                    <input
                      type="text"
                      name="EMS.sig_environ_sum"
                      id="EMS.sig_environ_sum"
                      value={values.EMS.sig_environ_sum}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter summary"
                    />
                    <div className="input__error-container">
                      {errors.EMS?.sig_environ_sum &&
                      touched.EMS?.sig_environ_sum ? (
                        <p className="input__error">
                          {errors.EMS.sig_environ_sum}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="input__container">
                    <label htmlFor="EMS.environ_legal_req">
                      Please detail any Environmental legal requirements related
                      to your company activity :
                    </label>
                    <input
                      type="text"
                      name="EMS.environ_legal_req"
                      id="EMS.environ_legal_req"
                      value={values.EMS.environ_legal_req}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter details"
                    />
                    <div className="input__error-container">
                      {errors.EMS?.environ_legal_req &&
                      touched.EMS?.environ_legal_req ? (
                        <p className="input__error">
                          {errors.EMS.environ_legal_req}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </>
                {/* OHSAS */}
                <>
                  <h2 className="form-sub-title">
                    Additional Information Required (OHSAS 18001/ISO
                    45001:2018):
                  </h2>

                  {Object.keys(OHSASInputs).map((key) => (
                    <div className="input__container" key={key}>
                      <label
                        htmlFor={`OHSAS.${key}`}
                      >{`${OHSASInputs[key]}`}</label>
                      <input
                        type="text"
                        name={`OHSAS.${key}`}
                        id={`OHSAS.${key}`}
                        value={values.OHSAS[key]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder={`Enter details`}
                      />
                      <div className="input__error-container">
                        {errors.OHSAS?.[key] || touched.OHSAS?.[key] ? (
                          <p className="input__error">{errors.OHSAS?.[key]}</p>
                        ) : null}
                      </div>
                    </div>
                  ))}

                  <div className="input__container">
                    <label htmlFor="">
                      Please provide accident statistics for last two years and
                      current year to date:
                    </label>
                    <table className="table-form">
                      <thead>
                        <tr>
                          <th></th>
                          {Object.keys(acciStatColkeys).map((columnKey) => (
                            <th key={columnKey}>
                              {acciStatColkeys[columnKey]}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(acciStatRowkeys).map((rowKey) => (
                          <tr key={rowKey} className="table-row">
                            <th
                              className={`row-head${
                                rowKey === "tot_emp" ? "--bold" : ""
                              }`}
                            >
                              {acciStatRowkeys[rowKey]}
                            </th>
                            {Object.keys(acciStatColkeys).map((columnKey) => (
                              <td key={`${rowKey + columnKey}`}>
                                <input
                                  type="tel"
                                  name={`OHSAS.${rowKey + columnKey}`}
                                  value={values?.OHSAS[rowKey + columnKey]}
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
                                />
                                {touched?.OHSAS?.[rowKey + columnKey] &&
                                  errors?.OHSAS?.[rowKey + columnKey] && (
                                    <div>
                                      {errors?.OHSAS?.[rowKey + columnKey]}
                                    </div>
                                  )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
                {/* ISO27001 */}
                <>
                  <h2 className="form-sub-title">
                    Additional Information Required (ISO 27001:2013):
                  </h2>

                  {Object.keys(ISO27001Inputs).map((key) => (
                    <div className="input__container" key={key}>
                      <label
                        htmlFor={`ISO27001.${key}`}
                      >{`${ISO27001Inputs[key]}`}</label>
                      <input
                        type="text"
                        name={`ISO27001.${key}`}
                        id={`ISO27001.${key}`}
                        value={values.ISO27001[key]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder={`Enter details`}
                      />
                      <div className="input__error-container">
                        {errors.ISO27001?.[key] || touched.ISO27001?.[key] ? (
                          <p className="input__error">
                            {errors.ISO27001?.[key]}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  ))}

                  <div className="input__container checkbox-container">
                    <label>
                      ISMS Documented and Implemented System available?
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="radio"
                        name="ISO27001.isms_doc_imp_sys"
                        value="Yes"
                        checked={values.ISO27001.isms_doc_imp_sys === "Yes"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <p>Yes</p>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="radio"
                        name="ISO27001.isms_doc_imp_sys"
                        value="No"
                        checked={values.ISO27001.isms_doc_imp_sys === "No"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <p>No</p>
                    </label>
                    <div className="input__error-container">
                      {errors.ISO27001?.isms_doc_imp_sys ||
                      touched.ISO27001?.isms_doc_imp_sys ? (
                        <p className="input__error">
                          {errors.ISO27001?.isms_doc_imp_sys}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </>
                {/* ISO50001 */}
                <>
                  <h2 className="form-sub-title">
                    Additional Information Required (ISO 50001:2018):
                  </h2>

                  {Object.keys(ISO50001Inputs).map((key) => (
                    <div className="input__container" key={key}>
                      <label
                        htmlFor={`ISO50001.${key}`}
                      >{`${ISO50001Inputs[key]} :`}</label>
                      <input
                        type="text"
                        name={`ISO50001.${key}`}
                        id={`ISO50001.${key}`}
                        value={values.ISO50001[key]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder={`Enter ${ISO50001Inputs[key]}`}
                      />
                      <div className="input__error-container">
                        {errors.ISO50001?.[key] || touched.ISO50001?.[key] ? (
                          <p className="input__error">
                            {errors.ISO50001?.[key]}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </>
                {/* ISO22000 */}
                <>
                  <h2 className="form-sub-title">
                    Additional Information Required (ISO 22000:2018):
                  </h2>

                  <div className="input__container checkbox-container">
                    <label>HACCP Implementation or Study Conducted?</label>
                    <label className="checkbox-label">
                      <input
                        type="radio"
                        name="ISO22000.haccp_implement"
                        value="Yes"
                        checked={values.ISO22000.haccp_implement === "Yes"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <p>Yes</p>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="radio"
                        name="ISO22000.haccp_implement"
                        value="No"
                        checked={values.ISO22000.haccp_implement === "No"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <p>No</p>
                    </label>
                    <div className="input__error-container">
                      {errors.ISO22000?.haccp_implement ||
                      touched.ISO22000?.haccp_implement ? (
                        <p className="input__error">
                          {errors.ISO22000?.haccp_implement}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  {Object.keys(ISO22000Inputs).map((key) => (
                    <div className="input__container" key={key}>
                      <label
                        htmlFor={`ISO22000.${key}`}
                      >{`${ISO22000Inputs[key]} :`}</label>
                      <input
                        type="text"
                        name={`ISO22000.${key}`}
                        id={`ISO22000.${key}`}
                        value={values.ISO22000[key]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder={`Enter ${ISO22000Inputs[key]}`}
                      />
                      <div className="input__error-container">
                        {errors.ISO22000?.[key] || touched.ISO22000?.[key] ? (
                          <p className="input__error">
                            {errors.ISO22000?.[key]}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  ))}

                  <div className="input__container checkbox-container">
                    <label htmlFor="">Processing is :</label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name={`ISO22000.pro_season`}
                        checked={values.ISO22000.pro_season === "Yes"}
                        onChange={(e) =>
                          setFieldValue(
                            `ISO22000.pro_season`,
                            e.target.checked ? "Yes" : "No"
                          )
                        }
                        onBlur={handleBlur}
                      />
                      <p>Seasonal</p>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name={`ISO22000.pro_contin`}
                        checked={values.ISO22000.pro_contin === "Yes"}
                        onChange={(e) =>
                          setFieldValue(
                            `ISO22000.pro_contin`,
                            e.target.checked ? "Yes" : "No"
                          )
                        }
                        onBlur={handleBlur}
                      />
                      <p>Continuous</p>
                    </label>
                  </div>
                  <div className="input__container">
                    <div className="input__error-container">
                      {(errors.ISO22000 || touched.ISO22000) && (
                        <p className="input__error">{errors.ISO22000}</p>
                      )}
                    </div>
                  </div>
                </>
                {/* ISO13485 */}
                <>
                  <h2 className="form-sub-title">
                    Additional Information Required (ISO 13485:2016)
                  </h2>

                  <div className="input__container checkbox-container">
                    <label>HACCP Implementation or Study Conducted?</label>
                    <label className="checkbox-label">
                      <input
                        type="radio"
                        name="ISO13485.no_sites_13485"
                        value="Single"
                        checked={values.ISO13485.no_sites_13485 === "Single"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <p>Single</p>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="radio"
                        name="ISO13485.no_sites_13485"
                        value="Multiple"
                        checked={values.ISO13485.no_sites_13485 === "Multiple"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <p>Multiple</p>
                    </label>
                    <div className="input__error-container">
                      {errors.ISO13485?.no_sites_13485 ||
                      touched.ISO13485?.no_sites_13485 ? (
                        <p className="input__error">
                          {errors.ISO13485?.no_sites_13485}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="input__container">
                    <label htmlFor="ISO13485.crit_act">
                      Critical activity :
                    </label>
                    <input
                      type="text"
                      name="ISO13485.crit_act"
                      id="ISO13485.crit_act"
                      value={values.ISO13485.crit_act}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter critical activity"
                    />
                    <div className="input__error-container">
                      {errors.ISO13485?.crit_act &&
                      touched.ISO13485?.crit_act ? (
                        <p className="input__error">
                          {errors.ISO13485.crit_act}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </>
                {/* ISO37001 */}
                <>
                  <h2 className="form-sub-title">
                    Additional Information Required (ISO 37001:2016)
                  </h2>

                  <div className="input__container">
                    <label htmlFor="ISO37001.no_empl">
                      Effective Number of Employees under ABMS :
                    </label>
                    <input
                      type="text"
                      name="ISO37001.no_empl"
                      id="ISO37001.no_empl"
                      value={values.ISO37001.no_empl}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter Effective Number of Employees under ABMS"
                    />
                    <div className="input__error-container">
                      {errors.ISO37001?.no_empl && touched.ISO37001?.no_empl ? (
                        <p className="input__error">
                          {errors.ISO37001.no_empl}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="input__container checkbox-container">
                    <label>Anti-Bribery Management System - Risk</label>
                    <label className="checkbox-label">
                      <input
                        type="radio"
                        name="ISO37001.abms_risk"
                        value="Low"
                        checked={values.ISO37001.abms_risk === "Low"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <p>Low</p>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="radio"
                        name="ISO37001.abms_risk"
                        value="Medium"
                        checked={values.ISO37001.abms_risk === "Medium"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <p>Medium</p>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="radio"
                        name="ISO37001.abms_risk"
                        value="High"
                        checked={values.ISO37001.abms_risk === "High"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <p>High</p>
                    </label>
                    <div className="input__error-container">
                      {errors.ISO37001?.abms_risk ||
                      touched.ISO37001?.abms_risk ? (
                        <p className="input__error">
                          {errors.ISO37001?.abms_risk}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </>
                {/* Otabu Official Use */}
                <>
                  <h3 className="form-sub-title">
                    DECLARATION: The above information is true to the best of my
                    knowledge and belief and I am authorized to provide such
                    information on behalf of the company
                  </h3>

                  <div className="input__container">
                    <label htmlFor="OtabuOffUse.name_otabu">Name :</label>
                    <input
                      type="text"
                      name="OtabuOffUse.name_otabu"
                      id="OtabuOffUse.name_otabu"
                      value={values.OtabuOffUse.name_otabu}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter name"
                    />
                    <div className="input__error-container">
                      {errors.OtabuOffUse?.name_otabu &&
                      touched.OtabuOffUse?.name_otabu ? (
                        <p className="input__error">
                          {errors.OtabuOffUse.name_otabu}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="input__container">
                    <label htmlFor="OtabuOffUse.Desgn">Designation :</label>
                    <input
                      type="text"
                      name="OtabuOffUse.Desgn"
                      id="OtabuOffUse.Desgn"
                      value={values.OtabuOffUse.Desgn}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter Designation"
                    />
                    <div className="input__error-container">
                      {errors.OtabuOffUse?.Desgn &&
                      touched.OtabuOffUse?.Desgn ? (
                        <p className="input__error">
                          {errors.OtabuOffUse.Desgn}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="input__container">
                    <label htmlFor="OtabuOffUse.sign_otabu">Signature :</label>
                    <input
                      type="file"
                      name="OtabuOffUse.sign_otabu"
                      id="OtabuOffUse.sign_otabu"
                      value={values.sign_otabu}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <div className="input__error-container">
                      {errors.OtabuOffUse?.sign_otabu &&
                      touched.OtabuOffUse?.sign_otabu ? (
                        <p className="input__error">
                          {errors.OtabuOffUse.sign_otabu}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <h2 className="form-sub-title">OTABU Official Use</h2>

                  <div className="input__container checkbox-container">
                    <label>
                      Can the Application Proceed for Application Review?
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="radio"
                        name="OtabuOffUse.proceed_4_review"
                        value="Yes"
                        checked={values.OtabuOffUse.proceed_4_review === "Yes"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <p>Yes</p>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="radio"
                        name="OtabuOffUse.proceed_4_review"
                        value="No"
                        checked={values.OtabuOffUse.proceed_4_review === "No"}
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
                    <label htmlFor="OtabuOffUse.name_officer">
                      Name of Officer :
                    </label>
                    <input
                      type="text"
                      name="OtabuOffUse.name_officer"
                      id="OtabuOffUse.name_officer"
                      value={values.OtabuOffUse.name_officer}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter Name of Officer"
                    />
                    <div className="input__error-container">
                      {errors.OtabuOffUse?.name_officer &&
                      touched.OtabuOffUse?.name_officer ? (
                        <p className="input__error">
                          {errors.OtabuOffUse.name_officer}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="input__container">
                    <label htmlFor="OtabuOffUse.name_app_reviewer">
                      Name of Application reviewer :
                    </label>
                    <input
                      type="text"
                      name="OtabuOffUse.name_app_reviewer"
                      id="OtabuOffUse.name_app_reviewer"
                      value={values.OtabuOffUse.name_app_reviewer}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter Name of Application reviewer"
                    />
                    <div className="input__error-container">
                      {errors.OtabuOffUse?.name_app_reviewer &&
                      touched.OtabuOffUse?.name_app_reviewer ? (
                        <p className="input__error">
                          {errors.OtabuOffUse.name_app_reviewer}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="input__container">
                    <label htmlFor="OtabuOffUse.date_otabu_off_use">
                      Date :
                    </label>
                    <input
                      type="date"
                      name="OtabuOffUse.date_otabu_off_use"
                      id="OtabuOffUse.date_otabu_off_use"
                      value={values.OtabuOffUse.date_otabu_off_use}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <div className="input__error-container">
                      {errors.OtabuOffUse?.date_otabu_off_use &&
                      touched.OtabuOffUse?.date_otabu_off_use ? (
                        <p className="input__error">
                          {errors.OtabuOffUse.date_otabu_off_use}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </>
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
                    ) : state.role === "Client" &&
                      !(initialForm?.Status === "Application Rejected") ? (
                      "Submit"
                    ) : (
                      "Update"
                    )}
                  </button>
                </div>
              </div>
            </fieldset>
          </form>
        </div>
      )}
    </>
  );
};

export default ApplicationForm;
