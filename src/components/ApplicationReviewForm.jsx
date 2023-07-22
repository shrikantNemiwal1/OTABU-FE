import React, { useContext, useEffect, useState } from "react";
import { applicationReviewFormSchema } from "../validation/formSchema";
import { useFormik } from "formik";
import "./styles/registration.scss";
import "./styles/checkbox.scss";
import Spinner from "./Spinner";
import { changedDivisions } from "./ApplicationFormHelper";
import {
  initialValues,
  ApplicationReviewInputs,
  sitesApplicability,
  shifts,
  outSourceInputs,
  totalEmployeesInput,
  mandaysInputs,
  workingTableColumnKeys,
  workingTableRowKeys,
  IMSOfComSysInputs,
  IntegrationFactorsInputs,
  IntegrationRedFactorsInputs,
  QMSEMSOHSIncrFactorsInputs,
  QMSEMSOHSRednFactorsInputs,
} from "./ApplicationReviewFormHelper";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ApplicationForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formDisabled, setFormDisabled] = useState(false);

  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMsg, setAlertMsg] = useState("");

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
    validationSchema: applicationReviewFormSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      console.log(values);
      if (!dirty) {
        console.log("form unchanged");
        return;
      }
      setIsLoading(true);

      const formValues =
        state.role !== "Client"
          ? changedDivisions(values, initialForm)
          : values;

      const config = {
        headers: { Authorization: `Bearer ${state.token}` },
      };
      try {
        const response = await axios({
          method: state.role === "Client" ? "post" : "patch",
          url:
            BASE_URL +
            `/api/application_form/${
              state.role === "Client" ? "create" : "partial_update"
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
                {/* ApplicationForm */}
                <>
                  <h2 className="form-sub-title">Application Review Form</h2>

                  {Object.keys(ApplicationReviewInputs).map((key) => (
                    <div className="input__container" key={key}>
                      <label htmlFor={`ApplicationReview.${key}`}>
                        {`${ApplicationReviewInputs[key]} :`}
                      </label>
                      <input
                        type="text"
                        name={`ApplicationReview.${key}`}
                        id={`ApplicationReview.${key}`}
                        value={values.ApplicationReview[key]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder={`Enter ${ApplicationReviewInputs[key]}`}
                      />
                      <div className="input__error-container">
                        {errors.ApplicationReview?.[key] ||
                        touched.ApplicationReview?.[key] ? (
                          <p className="input__error">
                            {errors.ApplicationReview?.[key]}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  ))}

                  <div className="input__container">
                    <label htmlFor="ApplicationReview.name_con_busi_asso">
                      Name of Consultant/Business Associates :
                    </label>
                    <input
                      type="text"
                      name="ApplicationReview.name_con_busi_asso"
                      id="ApplicationReview.name_con_busi_asso"
                      value={values.ApplicationReview.name_con_busi_asso}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Name of Consultant/Business Associates"
                    />
                    <div className="input__error-container">
                      {errors.ApplicationReview?.name_con_busi_asso &&
                      touched.ApplicationReview?.name_con_busi_asso ? (
                        <p className="input__error">
                          {errors.ApplicationReview.name_con_busi_asso}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="input__container checkbox-container">
                    <label>
                      Is any way Consultant/Business Associates affecting the
                      impartial auditing Process?
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="radio"
                        name="ApplicationReview.con_busi_asso_affect"
                        value="Yes"
                        checked={
                          values.ApplicationReview.con_busi_asso_affect ===
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
                        name="ApplicationReview.con_busi_asso_affect"
                        value="No"
                        checked={
                          values.ApplicationReview.con_busi_asso_affect === "No"
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <p>No</p>
                    </label>
                    <div className="input__error-container">
                      {errors.ApplicationReview?.con_busi_asso_affect ||
                      touched.ApplicationReview?.con_busi_asso_affect ? (
                        <p className="input__error">
                          {errors.ApplicationReview?.con_busi_asso_affect}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="input__container">
                    <label htmlFor="ApplicationReview.how">
                      If yes then how?
                    </label>
                    <input
                      type="text"
                      name="ApplicationReview.how"
                      id="ApplicationReview.how"
                      value={values.ApplicationReview.how}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <div className="input__error-container">
                      {errors.ApplicationReview?.how &&
                      touched.ApplicationReview?.how ? (
                        <p className="input__error">
                          {errors.ApplicationReview.how}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </>
                {/* SiteCapaOutsource */}
                <>
                  <div className="input__container">
                    <h3 className="form-sub-title">No. of Sites</h3>
                    <table className="table-form">
                      <thead>
                        <tr>
                          <th></th>
                          {Object.keys(sitesApplicability).map((columnKey) => (
                            <th key={columnKey}>
                              {sitesApplicability[columnKey]}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="table-row">
                          <th className="row-head">
                            Sites applicability and selection in audit (if sites
                            available)
                          </th>
                          {Object.keys(sitesApplicability).map((columnKey) => (
                            <td key={`${columnKey}`}>
                              <input
                                type="tel"
                                name={`SiteCapaOutsource.${columnKey}`}
                                value={values?.SiteCapaOutsource[columnKey]}
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
                              {touched?.SiteCapaOutsource?.[columnKey] &&
                                errors?.SiteCapaOutsource?.[columnKey] && (
                                  <div>
                                    {errors?.SiteCapaOutsource?.[columnKey]}
                                  </div>
                                )}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {Object.keys(outSourceInputs).map((key) => (
                    <div className="input__container" key={key}>
                      <label htmlFor={`SiteCapaOutsource.${key}`}>
                        {`${outSourceInputs[key]} :`}
                      </label>
                      <input
                        type="text"
                        name={`SiteCapaOutsource.${key}`}
                        id={`SiteCapaOutsource.${key}`}
                        value={values.SiteCapaOutsource[key]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder={`Enter ${outSourceInputs[key]}`}
                      />
                      <div className="input__error-container">
                        {errors.SiteCapaOutsource?.[key] ||
                        touched.SiteCapaOutsource?.[key] ? (
                          <p className="input__error">
                            {errors.SiteCapaOutsource?.[key]}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  ))}

                  <div className="input__container checkbox-container">
                    <label>QMS RISK CATEGORY:</label>
                    <label className="checkbox-label">
                      <input
                        type="radio"
                        name="SiteCapaOutsource.qms_risk_category"
                        value="High"
                        checked={
                          values.SiteCapaOutsource.qms_risk_category === "High"
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <p>High</p>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="radio"
                        name="SiteCapaOutsource.qms_risk_category"
                        value="Medium"
                        checked={
                          values.SiteCapaOutsource.qms_risk_category ===
                          "Medium"
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <p>Medium</p>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="radio"
                        name="SiteCapaOutsource.qms_risk_category"
                        value="Low"
                        checked={
                          values.SiteCapaOutsource.qms_risk_category === "Low"
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <p>Low</p>
                    </label>
                    <div className="input__error-container">
                      {errors.SiteCapaOutsource?.qms_risk_category ||
                      touched.SiteCapaOutsource?.qms_risk_category ? (
                        <p className="input__error">
                          {errors.SiteCapaOutsource?.qms_risk_category}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="input__container checkbox-container">
                    <label>EMS COMLEXITY CATEGORY:</label>
                    <label className="checkbox-label">
                      <input
                        type="radio"
                        name="SiteCapaOutsource.ems_compl_category"
                        value="High"
                        checked={
                          values.SiteCapaOutsource.ems_compl_category === "High"
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <p>High</p>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="radio"
                        name="SiteCapaOutsource.ems_compl_category"
                        value="Medium"
                        checked={
                          values.SiteCapaOutsource.ems_compl_category ===
                          "Medium"
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <p>Medium</p>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="radio"
                        name="SiteCapaOutsource.ems_compl_category"
                        value="Low"
                        checked={
                          values.SiteCapaOutsource.ems_compl_category === "Low"
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <p>Low</p>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="radio"
                        name="SiteCapaOutsource.ems_compl_category"
                        value="Limited"
                        checked={
                          values.SiteCapaOutsource.ems_compl_category ===
                          "Limited"
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <p>Limited</p>
                    </label>
                    <div className="input__error-container">
                      {errors.SiteCapaOutsource?.ems_compl_category ||
                      touched.SiteCapaOutsource?.ems_compl_category ? (
                        <p className="input__error">
                          {errors.SiteCapaOutsource?.ems_compl_category}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="input__container checkbox-container">
                    <label>OH&SMS COMPLEXITY CATEGORY:</label>
                    <label className="checkbox-label">
                      <input
                        type="radio"
                        name="SiteCapaOutsource.oh_sms_compl_category"
                        value="High"
                        checked={
                          values.SiteCapaOutsource.oh_sms_compl_category ===
                          "High"
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <p>High</p>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="radio"
                        name="SiteCapaOutsource.oh_sms_compl_category"
                        value="Medium"
                        checked={
                          values.SiteCapaOutsource.oh_sms_compl_category ===
                          "Medium"
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <p>Medium</p>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="radio"
                        name="SiteCapaOutsource.oh_sms_compl_category"
                        value="Low"
                        checked={
                          values.SiteCapaOutsource.oh_sms_compl_category ===
                          "Low"
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <p>Low</p>
                    </label>
                    <div className="input__error-container">
                      {errors.SiteCapaOutsource?.oh_sms_compl_category ||
                      touched.SiteCapaOutsource?.oh_sms_compl_category ? (
                        <p className="input__error">
                          {errors.SiteCapaOutsource?.oh_sms_compl_category}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="input__container">
                    <h3 className="form-sub-title">Number of Shifts:</h3>
                    <table className="table-form">
                      <thead>
                        <tr>
                          <th></th>
                          {Object.keys(shifts).map((columnKey) => (
                            <th key={columnKey}>{shifts[columnKey]}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="table-row">
                          <th className="row-head">
                            Total Number of Employee in Each Shift
                          </th>
                          {Object.keys(shifts).map((columnKey) => (
                            <td key={`${columnKey}`}>
                              <input
                                type="tel"
                                name={`SiteCapaOutsource.${columnKey}`}
                                value={values?.SiteCapaOutsource[columnKey]}
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
                              {touched?.SiteCapaOutsource?.[columnKey] &&
                                errors?.SiteCapaOutsource?.[columnKey] && (
                                  <div>
                                    {errors?.SiteCapaOutsource?.[columnKey]}
                                  </div>
                                )}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </>
                {/* TotEmplMandaysTeam */}
                <>
                  <div className="input__container">
                    <h3 className="form-sub-title">
                      Total No of Employees per Shifts including Temporary
                      employees, contracting employees, work from home employees
                      & part time employees as per Client’ Scope:
                    </h3>
                    <table className="table-form">
                      <thead>
                        <tr>
                          <th></th>
                          {Object.keys(totalEmployeesInput).map((columnKey) => (
                            <th key={columnKey}>
                              {totalEmployeesInput[columnKey]}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="table-row">
                          <th className="row-head"></th>
                          {Object.keys(totalEmployeesInput).map((columnKey) => (
                            <td key={`${columnKey}`}>
                              <input
                                type="tel"
                                name={`TotEmplMandaysTeam.${columnKey}`}
                                value={values?.TotEmplMandaysTeam[columnKey]}
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
                              {touched?.TotEmplMandaysTeam?.[columnKey] &&
                                errors?.TotEmplMandaysTeam?.[columnKey] && (
                                  <div>
                                    {errors?.TotEmplMandaysTeam?.[columnKey]}
                                  </div>
                                )}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {Object.keys(mandaysInputs).map((key) => (
                    <div className="input__container" key={key}>
                      <label htmlFor={`TotEmplMandaysTeam.${key}`}>
                        {`${mandaysInputs[key]} :`}
                      </label>
                      <input
                        type="text"
                        name={`TotEmplMandaysTeam.${key}`}
                        id={`TotEmplMandaysTeam.${key}`}
                        value={values.TotEmplMandaysTeam[key]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder={`Enter ${mandaysInputs[key]}`}
                      />
                      <div className="input__error-container">
                        {errors.TotEmplMandaysTeam?.[key] ||
                        touched.TotEmplMandaysTeam?.[key] ? (
                          <p className="input__error">
                            {errors.TotEmplMandaysTeam?.[key]}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  ))}

                  <div className="input__container checkbox-container">
                    <label>
                      Surveillance (Frequency: 6 Month/ 9 Month / Annual) :{" "}
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="radio"
                        name="TotEmplMandaysTeam.oh_sms_compl_category"
                        value="6 Months"
                        checked={
                          values.TotEmplMandaysTeam.oh_sms_compl_category ===
                          "6 Months"
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <p>6 Months</p>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="radio"
                        name="TotEmplMandaysTeam.oh_sms_compl_category"
                        value="9 Months"
                        checked={
                          values.TotEmplMandaysTeam.oh_sms_compl_category ===
                          "9 Months"
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <p>9 Months</p>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="radio"
                        name="TotEmplMandaysTeam.oh_sms_compl_category"
                        value="Annual"
                        checked={
                          values.TotEmplMandaysTeam.oh_sms_compl_category ===
                          "Annual"
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <p>Annual</p>
                    </label>
                    <div className="input__error-container">
                      {errors.TotEmplMandaysTeam?.oh_sms_compl_category ||
                      touched.TotEmplMandaysTeam?.oh_sms_compl_category ? (
                        <p className="input__error">
                          {errors.TotEmplMandaysTeam?.oh_sms_compl_category}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </>
                {/* Working Table */}
                <>
                  <h3 className="form-sub-title">WORKING TABLE</h3>

                  <div className="input__container">
                    <table className="table-form">
                      <thead>
                        <tr>
                          <th></th>
                          {Object.keys(workingTableColumnKeys).map(
                            (columnKey) => (
                              <th
                                className="column-head-medium"
                                key={columnKey}
                              >
                                {workingTableColumnKeys[columnKey]}
                              </th>
                            )
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(workingTableRowKeys).map((rowKey) => (
                          <tr key={rowKey} className="table-row">
                            <th className="row-head">
                              {workingTableRowKeys[rowKey]}
                            </th>
                            {Object.keys(workingTableColumnKeys).map(
                              (columnKey) => (
                                <td key={`${columnKey}-${rowKey}`}>
                                  <input
                                    type="tel"
                                    name={`${columnKey}.${rowKey}`}
                                    value={values?.[columnKey][rowKey]}
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
                              )
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
                {/* IntegrationFactors */}
                <>
                  <h3 className="form-sub-title">
                    Level of Integrated Management System of The Company Systems
                    (from Application form)
                  </h3>

                  <div className="input__container">
                    <table className="table-form">
                      <thead>
                        <tr>
                          <th></th>
                          <th className="column-head-xsmall"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(IMSOfComSysInputs).map((rowKey) => (
                          <tr key={rowKey} className="table-row">
                            <th className="row-head-large">
                              {IMSOfComSysInputs[rowKey]}
                            </th>

                            <td key={rowKey}>
                              <label className="checkbox-label checkbox-width-small">
                                <input
                                  type="radio"
                                  className="font-size-med"
                                  name={`IMSOfComSys.${rowKey}`}
                                  value="Yes"
                                  checked={values.IMSOfComSys[rowKey] === "Yes"}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                />
                                <p>Yes</p>
                              </label>
                              <label className="checkbox-label checkbox-width-small">
                                <input
                                  type="radio"
                                  className="font-size-med"
                                  name={`IMSOfComSys.${rowKey}`}
                                  value="No"
                                  checked={values.IMSOfComSys[rowKey] === "No"}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                />
                                <p>No</p>
                              </label>

                              {/* <input
                                type="tel"
                                name={rowKey}
                                value={values?.IMSOfComSys?.rowKey}
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
                              /> */}
                              {touched?.IMSOfComSys?.rowKey &&
                                errors?.IMSOfComSys?.rowKey && (
                                  <div>{errors.IMSOfComSys.rowKey}</div>
                                )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <h3 className="form-sub-title">
                    Total No. of Factors (Integration)
                  </h3>

                  <div className="input__container">
                    <table className="table-form">
                      <thead>
                        <tr>
                          <th className="row-head--bold">
                            Increase Factors (+)
                          </th>
                          <th className="column-head-small row-head--bold">
                            Points
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(IntegrationRedFactorsInputs).map(
                          (rowKey) => (
                            <tr key={rowKey} className="table-row">
                              <th className="row-head-xlarge">
                                {IntegrationRedFactorsInputs[rowKey]}
                              </th>

                              <td key={rowKey}>
                                <input
                                  type="tel"
                                  name={`IntegrationFactors.${rowKey}`}
                                  value={values?.IntegrationFactors?.rowKey}
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
                                {touched?.IntegrationFactors?.rowKey &&
                                  errors?.IntegrationFactors?.rowKey && (
                                    <div>
                                      {errors.IntegrationFactors.rowKey}
                                    </div>
                                  )}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="input__container">
                    <table className="table-form">
                      <thead>
                        <tr>
                          <th className="row-head--bold">
                            Reduction Factors (-)
                          </th>
                          <th className="column-head-small row-head--bold">
                            Points
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(IntegrationFactorsInputs).map((rowKey) => (
                          <tr key={rowKey} className="table-row">
                            <th className="row-head-large">
                              {IntegrationFactorsInputs[rowKey]}
                            </th>
                            <td key={rowKey}>
                              <input
                                type="tel"
                                name={`IntegrationFactors.${rowKey}`}
                                value={values?.IntegrationFactors?.rowKey}
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
                              {touched?.IntegrationFactors?.rowKey &&
                                errors?.IntegrationFactors?.rowKey && (
                                  <div>{errors.IntegrationFactors.rowKey}</div>
                                )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
                {/* QMSEMSOHSFactors */}
                <>
                  <h3 className="form-sub-title">
                    Total No. of Factors (Integration)
                  </h3>

                  <div className="input__container">
                    <table className="table-form">
                      <thead>
                        <tr>
                          <th className="row-head--bold">
                            Increase Factors (+)
                          </th>
                          <th className="column-head-small row-head--bold">
                            Points
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(QMSEMSOHSIncrFactorsInputs).map(
                          (rowKey) => (
                            <tr key={rowKey} className="table-row">
                              <th className="row-head-large">
                                {QMSEMSOHSIncrFactorsInputs[rowKey]}
                              </th>

                              <td key={rowKey}>
                                <input
                                  type="tel"
                                  name={`QMSEMSOHSIncrFactors.${rowKey}`}
                                  value={values?.QMSEMSOHSIncrFactors?.rowKey}
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
                                {touched?.QMSEMSOHSIncrFactors?.rowKey &&
                                  errors?.QMSEMSOHSIncrFactors?.rowKey && (
                                    <div>
                                      {errors.QMSEMSOHSIncrFactors.rowKey}
                                    </div>
                                  )}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="input__container">
                    <table className="table-form">
                      <thead>
                        <tr>
                          <th className="row-head--bold">
                            Reduction Factors (-)
                          </th>
                          <th className="column-head-small row-head--bold">
                            Points
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(QMSEMSOHSRednFactorsInputs).map(
                          (rowKey) => (
                            <tr key={rowKey} className="table-row">
                              <th className="row-head-large">
                                {QMSEMSOHSRednFactorsInputs[rowKey]}
                              </th>

                              <td key={rowKey}>
                                <input
                                  type="tel"
                                  name={`QMSEMSOHSRednFactors.${rowKey}`}
                                  value={values?.QMSEMSOHSRednFactors?.rowKey}
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
                                {touched?.QMSEMSOHSRednFactors?.rowKey &&
                                  errors?.QMSEMSOHSRednFactors?.rowKey && (
                                    <div>
                                      {errors.QMSEMSOHSRednFactors.rowKey}
                                    </div>
                                  )}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
                {/* OtabuOffSignDate */}
                <>
                  <div className="input__container">
                    <label htmlFor="OtabuOffSignDate.review_conducted_AO_TM">
                      Review Conducted by (AO/TM) :
                    </label>
                    <input
                      type="file"
                      name="OtabuOffSignDate.review_conducted_AO_TM"
                      id="OtabuOffSignDate.review_conducted_AO_TM"
                      value={values.OtabuOffSignDate.review_conducted_AO_TM}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <div className="input__error-container">
                      {errors.OtabuOffSignDate?.review_conducted_AO_TM &&
                      touched.OtabuOffSignDate?.review_conducted_AO_TM ? (
                        <p className="input__error">
                          {errors.OtabuOffSignDate.review_conducted_AO_TM}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <div className="input__container">
                    <label htmlFor="OtabuOffSignDate.date_1">Date :</label>
                    <input
                      type="date"
                      name="OtabuOffSignDate.date_1"
                      id="OtabuOffSignDate.date_1"
                      value={values.OtabuOffSignDate.date_1}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <div className="input__error-container">
                      {errors.OtabuOffSignDate?.date_1 &&
                      touched.OtabuOffSignDate?.date_1 ? (
                        <p className="input__error">
                          {errors.OtabuOffSignDate.date_1}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <div className="input__container">
                    <label htmlFor="OtabuOffSignDate.tech_support_code_TE_LA">
                      Technical Support from Code Approved TE or LA :
                    </label>
                    <input
                      type="file"
                      name="OtabuOffSignDate.tech_support_code_TE_LA"
                      id="OtabuOffSignDate.tech_support_code_TE_LA"
                      value={values.OtabuOffSignDate.tech_support_code_TE_LA}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <div className="input__error-container">
                      {errors.OtabuOffSignDate?.tech_support_code_TE_LA &&
                      touched.OtabuOffSignDate?.tech_support_code_TE_LA ? (
                        <p className="input__error">
                          {errors.OtabuOffSignDate.tech_support_code_TE_LA}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <div className="input__container">
                    <label htmlFor="OtabuOffSignDate.date_2">Date :</label>
                    <input
                      type="date"
                      name="OtabuOffSignDate.date_2"
                      id="OtabuOffSignDate.date_2"
                      value={values.OtabuOffSignDate.date_2}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <div className="input__error-container">
                      {errors.OtabuOffSignDate?.date_2 &&
                      touched.OtabuOffSignDate?.date_2 ? (
                        <p className="input__error">
                          {errors.OtabuOffSignDate.date_2}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <div className="input__container">
                    <label htmlFor="OtabuOffSignDate.approved_by_DTO_MD">
                      Approved by DTO/MD :
                    </label>
                    <input
                      type="file"
                      name="OtabuOffSignDate.approved_by_DTO_MD"
                      id="OtabuOffSignDate.approved_by_DTO_MD"
                      value={values.OtabuOffSignDate.approved_by_DTO_MD}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <div className="input__error-container">
                      {errors.OtabuOffSignDate?.approved_by_DTO_MD &&
                      touched.OtabuOffSignDate?.approved_by_DTO_MD ? (
                        <p className="input__error">
                          {errors.OtabuOffSignDate.approved_by_DTO_MD}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <div className="input__container">
                    <label htmlFor="OtabuOffSignDate.date_3">Date :</label>
                    <input
                      type="date"
                      name="OtabuOffSignDate.date_3"
                      id="OtabuOffSignDate.date_3"
                      value={values.OtabuOffSignDate.date_3}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <div className="input__error-container">
                      {errors.OtabuOffSignDate?.date_3 &&
                      touched.OtabuOffSignDate?.date_3 ? (
                        <p className="input__error">
                          {errors.OtabuOffSignDate.date_3}
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
                    {isLoading ? <Spinner size={25} color="white" /> : "Submit"}
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
