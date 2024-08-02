import { useContext, useEffect, useState } from "react";
import { auditProgramFormSchema } from "../validation/formSchema";
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

const colKeys = {
  1: "1",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
};

const rowKeys = {
  question_1: "Ease of contacting OTABU Certification Pvt. Ltd.",
  question_2: "Support received from Office Staff",
  question_3: "Professionalism of Office Staff",
  question_4: "Information received prior to audit",
  question_5: "Professionalism of auditor",
  question_6: "Helpfulness of auditor",
  question_7: "Auditor’s ability to understand the issues key to your business",
  question_8: "Usefulness and relevance of audit findings",
  question_9: "Clarity of auditor’s explanation of findings",
  question_10: "Clarity and usefulness of audit report",
  question_11:
    "Added value (did the service you receive exceed your expectations?)",
  question_12:
    "How would you rate our website with regards to useful information?",
  question_13:
    "How would you rate the quotation pack in terms of information and clarity?",
};

const initialValues = {
  question_1: "0",
  question_2: "0",
  question_3: "0",
  question_4: "0",
  question_5: "0",
  question_6: "0",
  question_7: "0",
  question_8: "0",
  question_9: "0",
  question_10: "0",
  question_11: "0",
  question_12: "0",
  question_13: "0",
  total: "0",
  comments: "",
  company: "",
  comlpeted_by: "",
  date_of_audit: "",
  stamp: "",
};

const ClientFeedbackForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMsg, setAlertMsg] = useState("");
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { state } = useContext(AuthContext);
  const id = pathname.split("/")[2];
  const [initialForm, setInitialForm] = useState(initialValues);

  const getFormDetails = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${state.token}` },
      };
      const res = await axios.get(
        BASE_URL + `/api/client_feedback/get/${id}`,
        config
      );
      const resData = {
        question_1: String(res?.data.question_1),
        question_2: String(res?.data.question_2),
        question_3: String(res?.data.question_3),
        question_4: String(res?.data.question_4),
        question_5: String(res?.data.question_4),
        question_6: String(res?.data.question_6),
        question_7: String(res?.data.question_7),
        question_8: String(res?.data.question_8),
        question_9: String(res?.data.question_9),
        question_10: String(res?.data.question_10),
        question_11: String(res?.data.question_11),
        question_12: String(res?.data.question_12),
        question_13: String(res?.data.question_13),
        total: String(res?.data.total),
        comments: res?.data.comments,
        company: res?.data.company,
        comlpeted_by: res?.data.comlpeted_by,
        date_of_audit: res?.data.date_of_audit,
        // stamp: res?.data.stamp,
      };
      setInitialForm(resData);
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
    validationSchema: auditProgramFormSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setIsLoading(true);

      const formValues = {
        question_1: Number(values.question_1),
        question_2: Number(values.question_2),
        question_3: Number(values.question_3),
        question_4: Number(values.question_4),
        question_5: Number(values.question_4),
        question_6: Number(values.question_6),
        question_7: Number(values.question_7),
        question_8: Number(values.question_8),
        question_9: Number(values.question_9),
        question_10: Number(values.question_10),
        question_11: Number(values.question_11),
        question_12: Number(values.question_12),
        question_13: Number(values.question_13),
        total: Number(values.total),
        comments: values.comments,
        company: values.company,
        comlpeted_by: values.comlpeted_by,
        date_of_audit: values.date_of_audit,
        stamp: values.stamp,
      };

      console.log(formValues);

      try {
        const response = await axios({
          method: "post",
          url: BASE_URL + `/api/client_feedback/create/${id}`,
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
        }, 2000);
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
              <h2 className="form-sub-title">Feedback Form</h2>
              <>
                <h3 className="form-sub-title client-feedback__sub-title">
                  To help us in our efforts to continually meet and,exceed
                  customer expectations, we would appreciate your feedback and
                  comments on the service you have received. The form should
                  take no more than a couple of minutes to complete.
                </h3>
                <div className="input__container feedback-instructions">
                  <p>
                    Please rate each of the criteria set out below using the
                    following scale:
                  </p>
                  <ul>
                    <li>5 : Excellent</li>
                    <li>4 : Good</li>
                    <li>3 : Satisfactory</li>
                    <li>2 : Poor</li>
                    <li>1 : Very poor</li>
                  </ul>
                </div>

                <div className="input__container">
                  <table className="table-form checkbox-table">
                    <thead>
                      <tr>
                        <th className="row-head-large">
                          Aspect of Service(max 65 Marks)
                        </th>
                        {Object.keys(colKeys).map((colKey) => (
                          <th className="column-head" key={colKey}>
                            {colKeys[colKey]}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(rowKeys).map((rowKey, index) => (
                        <tr key={rowKey} className="table-row">
                          <th className="row-head m-med">
                            {index + 1}. {rowKeys[rowKey]}
                          </th>
                          {Object.keys(colKeys).map((colKey) => (
                            <td key={`${rowKey}-${colKey}`}>
                              <label className="checkbox-label input-small">
                                <input
                                  type="radio"
                                  name={rowKey}
                                  value={colKeys[colKey]}
                                  checked={values[rowKey] === colKeys[colKey]}
                                  onChange={(e) => {
                                    handleChange(e);
                                    setFieldValue(
                                      "total",
                                      String(
                                        Number(values?.total) +
                                          Number(e.target.value) -
                                          Number(values?.[rowKey])
                                      )
                                    );
                                  }}
                                />
                              </label>
                            </td>
                          ))}
                        </tr>
                      ))}
                      <tr className="feedback-table__total">
                        <th>Total</th>
                        <td>{values?.total}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="input__container mt-3">
                  <label htmlFor={`comments`}>
                    Comments / Suggestions for improvement within any area of
                    OTABU Certification Pvt. Ltd. :
                  </label>
                  <input
                    type="text"
                    name={`comments`}
                    id={`comments`}
                    value={values.comments}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={`Enter Comments `}
                  />
                  <div className="input__error-container">
                    {errors.comments || touched.comments ? (
                      <p className="input__error">{errors.comments}</p>
                    ) : null}
                  </div>
                </div>

                <div className="input__container">
                  <label htmlFor={`company`}>Company :</label>
                  <input
                    type="text"
                    name={`company`}
                    id={`company`}
                    value={values.company}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={`Enter Company `}
                  />
                  <div className="input__error-container">
                    {errors.company || touched.company ? (
                      <p className="input__error">{errors.company}</p>
                    ) : null}
                  </div>
                </div>

                <div className="input__container">
                  <label htmlFor="comlpeted_by">Completed by :</label>
                  <input
                    type="text"
                    name="comlpeted_by"
                    id="comlpeted_by"
                    placeholder="Enter Completed by"
                    value={values.comlpeted_by}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <div className="input__error-container">
                    {errors.comlpeted_by && touched.comlpeted_by ? (
                      <p className="input__error">{errors.comlpeted_by}</p>
                    ) : null}
                  </div>
                </div>

                <div className="input__container">
                  <label htmlFor="date_of_audit">Date of application :</label>
                  <input
                    type="date"
                    name="date_of_audit"
                    id="date_of_audit"
                    value={values.date_of_audit}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <div className="input__error-container">
                    {errors.date_of_audit && touched.date_of_audit ? (
                      <p className="input__error">{errors.date_of_audit}</p>
                    ) : null}
                  </div>
                </div>

                <div className="input__container">
                  <label htmlFor="stamp">OTABU Stamp :</label>
                  <input
                    type="file"
                    name="stamp"
                    id="stamp"
                    value={values.stamp}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <div className="input__error-container">
                    {errors.stamp && touched.stamp ? (
                      <p className="input__error">{errors.stamp}</p>
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
          </form>
        </div>
      )}
    </>
  );
};

export default ClientFeedbackForm;
