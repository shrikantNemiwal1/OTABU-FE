import * as Yup from "yup";

export const signupSchemaStep1 = Yup.object({
  firstName: Yup.string().required("Please enter your Full Name"),
  lastName: Yup.string().required("Please enter your Full Name"),
  email: Yup.string().email().required("Please enter your Email"),
  phoneNumber: Yup.string()
    .matches(/^[0-9]\d{9}$/, {
      message: "Please enter valid number.",
      excludeEmptyString: false,
    })
    .required("Please enter your Phone number"),
  password: Yup.string()
    .min(8, "Password must be atleast 8 characters")
    .matches(
      /^(?=.*[a-z])/,
      "Password must contain at least 1 lower case letter"
    )
    .matches(
      /^(?=.*[A-Z])/,
      "Password must contain at least 1 upper case letter"
    )
    .matches(/^(?=.*[0-9])/, "Password must contain at least 1 number")
    .matches(
      /^(?=.*[!@#\$%\^&\*])/,
      "Password must contain at least 1 special case character"
    )
    .required("Please enter a password"),
});

export const signupSchemaStep2 = Yup.object({
  startup_name: Yup.string().required("Please enter your Startup Name"),
  applying_to: Yup.string(),
  profession: Yup.string(),
  website_link: Yup.string(),
});

export const loginSchema = Yup.object({
  password: Yup.string()
    .min(8, "Password must be atleast 8 characters")
    .required("Please enter your Password"),
  email: Yup.string().email().required("Please enter your Email"),
  rememberMe: Yup.bool(),
});

export const forgotPasswordSchemaStep1 = Yup.object({
  email: Yup.string().email().required("Please enter your Email"),
});

export const forgotPasswordSchemaStep3 = Yup.object({
  new_password: Yup.string()
    .min(8, "Password must be atleast 8 characters")
    .matches(
      /^(?=.*[a-z])/,
      "Password must contain at least 1 lower case letter"
    )
    .matches(
      /^(?=.*[A-Z])/,
      "Password must contain at least 1 upper case letter"
    )
    .matches(/^(?=.*[0-9])/, "Password must contain at least 1 number")
    .matches(
      /^(?=.*[!@#\$%\^&\*])/,
      "Password must contain at least 1 special case character"
    )
    .required("Please enter a password"),
  confirm_password: Yup.string().oneOf(
    [Yup.ref("new_password"), null],
    "Passwords must match"
  ),
});

export const auditorRegistrationSchema = Yup.object({
  name: Yup.string().required("Please enter your name"),
  email: Yup.string().email().required("Please enter your email"),
  phoneNumber: Yup.string()
    .matches(/^[0-9]\d{9}$/, {
      message: "Please enter a valid 10 digit number.",
      excludeEmptyString: false,
    })
    .required("Please enter your Phone number"),
  signature: Yup.string().required("Please upload your signature"),
  experience: Yup.string().required("Please enter your experience"),
  auditCertifications: Yup.string().required(
    "Please enter audit certifications"
  ),
});
