import React, { useContext, useState } from "react";
import { auditorRegistrationSchema } from "../validation/formSchema";
import { useFormik } from "formik";
import logoColoured from "../assets/images/logo-coloured.png";
import "../pages/styles/registration.scss";

const initialValues = {
  name: "",
  email: "",
  phoneNumber: "",
  signature: "",
  experience: "",
  auditCertifications: "",
};

const AddAuditorForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [membersData, setMembersData] = useState(null);

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    resetForm,
  } = useFormik({
    initialValues,
    validationSchema: auditorRegistrationSchema,
    onSubmit: async (values) => {
      console.log(values);
      setIsLoading(true);
      //POST REQUEST
      //   try {
      //     const res = await submitEventData(values);
      //     resetForm();
      //     setIsLoading(false);
      //   } catch (error) {
      //     setIsLoading(false);
      //   }
    },
  });

  return (
    <div className="registration">
      <form onSubmit={handleSubmit}>
        <div className="registration__form">
          <div className="input__container">
            <label htmlFor="name">Name :</label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Enter Name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <div className="input__error-container">
              {errors.name && touched.name ? (
                <p className="input__error">{errors.name}</p>
              ) : null}
            </div>
          </div>
          {/* <div className="input__container">
            <label htmlFor="email">Email Address :</label>
            <input
              type="text"
              name="email"
              id="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter Email Address"
            />
            <div className="input__error-container">
              {errors.email && touched.email ? (
                <p className="input__error">{errors.email}</p>
              ) : null}
            </div>
          </div> */}
          <div className="input__container">
            <label htmlFor="phoneNumber">Phone Number :</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={values.phoneNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter Phone Number"
            />
            <div className="input__error-container">
              {errors.phoneNumber && touched.phoneNumber ? (
                <p className="input__error"> {errors.phoneNumber}</p>
              ) : null}
            </div>
          </div>
          {/* <div className="input__container">
            <label htmlFor="signature">Signature :</label>
            <input
              type="file"
              name="signature"
              id="signature"
              value={values.signature}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <div className="input__error-container">
              {errors.signature && touched.signature ? (
                <p className="input__error">{errors.signature}</p>
              ) : null}
            </div>
          </div> */}
          {/* <div className="input__container">
            <label htmlFor="experience">Experience :</label>
            <input
              type="text"
              name="experience"
              id="experience"
              value={values.experience}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter Experience"
            />
            <div className="input__error-container">
              {errors.experience && touched.experience ? (
                <p className="input__error">{errors.experience}</p>
              ) : null}
            </div>
          </div> */}
          <div className="input__container">
            <label htmlFor="auditCertifications">Audit Certifications :</label>
            <input
              type="text"
              name="auditCertifications"
              id="auditCertifications"
              value={values.auditCertifications}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter Audit Certifications"
            />
            <div className="input__error-container">
              {errors.auditCertifications && touched.auditCertifications ? (
                <p className="input__error">{errors.auditCertifications}</p>
              ) : null}
            </div>
            {isLoading ? (
              <button className="registration__submit" type="button" disabled>
                Submitting...
              </button>
            ) : (
              <button
                className="registration__submit"
                type="submit"
                onClick={() => handleSubmit()}
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddAuditorForm;
