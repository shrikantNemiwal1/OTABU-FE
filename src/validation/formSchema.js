import * as Yup from "yup";

export const loginSchema = Yup.object({
  password: Yup.string()
    .min(8, "Password must be atleast 8 characters")
    .required("Please enter your Password"),
  email: Yup.string().email().required("Please enter your Email"),
  rememberMe: Yup.bool(),
});

export const auditorRegistrationSchema = Yup.object({
  email: Yup.string().email().required("Please enter your email"),
  name: Yup.string().required("Please enter your name"),
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
  confirm_password: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "Passwords must match"
  ).required("Please enter confirm password"),
});

export const clientRegistrationSchema = Yup.object({
  email: Yup.string().email().required("Please enter your email"),
  mobile: Yup.string().matches(/^[0-9]\d{9}$/, {
    message: 'Please enter a valid 10 digit number.',
    excludeEmptyString: false,
  }).required("Please enter your mobile number"),
  organization_name: Yup.string().required("Please enter your organization name"),
  director_name: Yup.string().required("Please enter director name"),
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
  confirm_password: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "Passwords must match"
  ).required("Please enter confirm password"),
});
