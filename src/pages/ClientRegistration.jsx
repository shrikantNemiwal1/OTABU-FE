import React, { useContext, useState } from "react";
import { auditorRegistrationSchema } from "../validation/formSchema";
import { useFormik } from "formik";
import logoColoured from "../assets/images/logo-coloured.png";
import "./styles/registration.scss";

const initialValues = {
  organisationName: "",
  scope: "",
  address: "",
  additionalSites: "",
  tempSites: "",
  ownerName: "",
  signature: "",
  position: "",
  standard: "",
  phoneNumber: "",
  email: "",
  website: "",
  state: "",
  country: "",
  industryType: "",
  exclusion: "",
  noOfSites: "",
  noOfEmployee: "",
  topManagement: "",
  manufacturingServiceAreaEmployee: "",
};

const ClientRegistration = () => {
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
      setIsLoading(true);
      //POST REQUEST
      try {
        const res = await submitEventData(values);
        resetForm();
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="registration">
      <div className="registration__head">
        <img src={logoColoured} alt="" />
      </div>
      <form onSubmit={handleSubmit}>
        <div className="registration__form">
          <div className="input__container">
            <label htmlFor="organisationName">Organisation Name :</label>
            <input
              type="text"
              name="organisationName"
              id="organisationName"
              value={values.organisationName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter Organisation Name"
            />
            <div className="input__error-container">
              {errors.organisationName && touched.organisationName ? (
                <p className="input__error">{errors.organisationName}</p>
              ) : null}
            </div>
          </div>
          <div className="input__container">
            <label htmlFor="scope">Scope :</label>
            <input
              type="text"
              name="scope"
              id="scope"
              value={values.scope}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter Scope"
            />
            <div className="input__error-container">
              {errors.scope && touched.scope ? (
                <p className="input__error">{errors.scope}</p>
              ) : null}
            </div>
          </div>
          <div className="input__container">
            <label htmlFor="address">Address :</label>
            <input
              type="text"
              name="address"
              id="address"
              value={values.address}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter Address"
            />
            <div className="input__error-container">
              {errors.address && touched.address ? (
                <p className="input__error">{errors.address}</p>
              ) : null}
            </div>
          </div>
          <div className="input__container">
            <label htmlFor="additionalSites">Additional Sites :</label>
            <input
              type="text"
              name="additionalSites"
              id="additionalSites"
              value={values.additionalSites}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter Additional Sites"
            />
            <div className="input__error-container">
              {errors.additionalSites && touched.additionalSites ? (
                <p className="input__error">{errors.additionalSites}</p>
              ) : null}
            </div>
          </div>
          <div className="input__container">
            <label htmlFor="tempSites">Temp Sites :</label>
            <input
              type="text"
              name="tempSites"
              id="tempSites"
              value={values.tempSites}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter Temp Sites"
            />
            <div className="input__error-container">
              {errors.tempSites && touched.tempSites ? (
                <p className="input__error">{errors.tempSites}</p>
              ) : null}
            </div>
          </div>
          <div className="input__container">
            <label htmlFor="ownerName">Owner Name :</label>
            <input
              type="text"
              name="ownerName"
              id="ownerName"
              value={values.ownerName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter Owner Name"
            />
            <div className="input__error-container">
              {errors.ownerName && touched.ownerName ? (
                <p className="input__error">{errors.ownerName}</p>
              ) : null}
            </div>
          </div>
          <div className="input__container">
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
          </div>
          <div className="input__container">
            <label htmlFor="position">Position :</label>
            <input
              type="text"
              name="position"
              id="position"
              value={values.position}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter Position"
            />
            <div className="input__error-container">
              {errors.position && touched.position ? (
                <p className="input__error">{errors.position}</p>
              ) : null}
            </div>
          </div>
          <div className="input__container">
            <label htmlFor="standard">Position :</label>
            <div
              className="custom-select"
              id="standard"
              style={{ width: "200px" }}
            >
              <select>
                <option value="0">Select car:</option>
                <option value="1">Audi</option>
                <option value="2">BMW</option>
                <option value="3">Citroen</option>
                <option value="4">Ford</option>
                <option value="5">Honda</option>
                <option value="6">Jaguar</option>
                <option value="7">Land Rover</option>
                <option value="8">Mercedes</option>
                <option value="9">Mini</option>
                <option value="10">Nissan</option>
                <option value="11">Toyota</option>
                <option value="12">Volvo</option>
              </select>
            </div>
            <div className="input__error-container">
              {errors.position && touched.position ? (
                <p className="input__error">{errors.position}</p>
              ) : null}
            </div>
          </div>

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
                <p className="input__error">{errors.phoneNumber}</p>
              ) : null}
            </div>
          </div>
          <div className="input__container">
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
          </div>
          <div className="input__container">
            <label htmlFor="website">Website URL :</label>
            <input
              type="text"
              name="website"
              id="website"
              value={values.website}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter Website URL"
            />
            <div className="input__error-container">
              {errors.website && touched.website ? (
                <p className="input__error">{errors.website}</p>
              ) : null}
            </div>
          </div>

          <div className="input__container">
            <label htmlFor="state">State :</label>
            <input
              type="text"
              name="state"
              id="state"
              value={values.state}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter State"
            />
            <div className="input__error-container">
              {errors.state && touched.state ? (
                <p className="input__error">{errors.state}</p>
              ) : null}
            </div>
          </div>
          <div className="input__container">
            <label htmlFor="country">Country :</label>
            <input
              type="text"
              name="country"
              id="country"
              value={values.country}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter Country"
            />
            <div className="input__error-container">
              {errors.country && touched.country ? (
                <p className="input__error">{errors.country}</p>
              ) : null}
            </div>
          </div>
          <div className="input__container">
            <label htmlFor="industryType">Type of Industry :</label>
            <input
              type="text"
              name="industryType"
              id="industryType"
              value={values.industryType}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter Type of Industry"
            />
            <div className="input__error-container">
              {errors.industryType && touched.industryType ? (
                <p className="input__error">{errors.industryType}</p>
              ) : null}
            </div>
          </div>
          <div className="input__container">
            <label htmlFor="education">Education :</label>
            <input
              type="text"
              name="education"
              id="education"
              value={values.education}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter Education"
            />
            <div className="input__error-container">
              {errors.education && touched.education ? (
                <p className="input__error">{errors.education}</p>
              ) : null}
            </div>
          </div>
          <div className="input__container">
            <label htmlFor="noOfSites">No. of Sites :</label>
            <input
              type="text"
              name="noOfSites"
              id="noOfSites"
              value={values.noOfSites}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter No. of Sites"
            />
            <div className="input__error-container">
              {errors.noOfSites && touched.noOfSites ? (
                <p className="input__error">{errors.noOfSites}</p>
              ) : null}
            </div>
          </div>
          <div className="input__container">
            <label htmlFor="noOfEmployee">No. of Employee :</label>
            <input
              type="text"
              name="noOfEmployee"
              id="noOfEmployee"
              value={values.noOfEmployee}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter No. of Employee"
            />
            <div className="input__error-container">
              {errors.noOfEmployee && touched.noOfEmployee ? (
                <p className="input__error">{errors.noOfEmployee}</p>
              ) : null}
            </div>
          </div>
          <div className="input__container">
            <label htmlFor="topManagement">Top Management :</label>
            <input
              type="text"
              name="topManagement"
              id="topManagement"
              value={values.topManagement}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter Top Management"
            />
            <div className="input__error-container">
              {errors.topManagement && touched.topManagement ? (
                <p className="input__error">{errors.topManagement}</p>
              ) : null}
            </div>
          </div>
          <div className="input__container">
            <label htmlFor="manufacturingServiceAreaEmployee">
              Manufacturing Service Area Employee :
            </label>
            <input
              type="text"
              name="manufacturingServiceAreaEmployee"
              id="manufacturingServiceAreaEmployee"
              value={values.manufacturingServiceAreaEmployee}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter Manufacturing Service Area Employee"
            />
            <div className="input__error-container">
              {errors.manufacturingServiceAreaEmployee &&
              touched.manufacturingServiceAreaEmployee ? (
                <p className="input__error">
                  {errors.manufacturingServiceAreaEmployee}
                </p>
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

export default ClientRegistration;
