import * as Yup from "yup";

export const loginSchema = Yup.object({
  password: Yup.string()
    .min(9, "Password must be atleast 9 characters")
    .required("Please enter your Password"),
  email: Yup.string().email().required("Please enter your Email"),
  rememberMe: Yup.bool(),
});

export const auditorRegistrationSchema = Yup.object({
  email: Yup.string().email().required("Please enter your email"),
  name: Yup.string().required("Please enter your name"),
  password: Yup.string()
    .min(9, "Password must be atleast 9 characters")
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
  confirm_password: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Please enter confirm password"),
});

export const clientRegistrationSchema = Yup.object({
  email: Yup.string().email().required("Please enter your email"),
  mobile: Yup.string()
    .matches(/^[0-9]\d{9}$/, {
      message: "Please enter a valid 10 digit number.",
      excludeEmptyString: false,
    })
    .required("Please enter your mobile number"),
  organization_name: Yup.string().required(
    "Please enter your organization name"
  ),
  director_name: Yup.string().required("Please enter director name"),
  password: Yup.string()
    .min(9, "Password must be atleast 9 characters")
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
  confirm_password: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Please enter confirm password"),
});

export const forgotPasswordSchema = Yup.object({
  password: Yup.string()
    .min(9, "Password must be atleast 9 characters")
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
  confirm_password: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Please enter confirm password"),
});

export const applicationFormSchema = Yup.object().shape({
  ApplicationForm: Yup.object().shape({
    date_of_app: Yup.string(),
    name_of_company: Yup.string().required("This field is required"),
    address: Yup.string(),
    website: Yup.string(),
    email: Yup.string(),
    phone_number: Yup.string(),
    no_of_sites: Yup.string(),
    site1_address: Yup.string(),
    site2_address: Yup.string(),
    temporary_site_address: Yup.string(),
    contact_person_name: Yup.string(),
    contact_person_design: Yup.string(),
    statutory_regulatory_req: Yup.string(),
    legal_obligation: Yup.string(),
    accreditation_req: Yup.string(),
    scope_of_certification: Yup.string(),
    exclusion_clause: Yup.string(),
    exclusion_justification: Yup.string(),
    outsourced_process: Yup.string(),
    shits_employbreakdown_worktypes: Yup.string(),
    temporary_sites_number: Yup.string(),
    iaf_technical_code: Yup.string(),
    doc_language: Yup.string(),
    expect_stage1_assessment: Yup.string(),
    expect_stage2_assessment: Yup.string(),
    external_consultant_experience: Yup.string(),
    hear_otabu: Yup.string(),
  }),
  LegalStatus: Yup.object().test(
    "atLeastOneCheckbox",
    "Please select at least one legal status",
    (obj) => {
      return Object.values(obj).some((value) => value === "Yes");
    }
  ),
  CertificationScheme: Yup.object().test(
    "atLeastOneCheckbox",
    "Please select at least one certification",
    (obj) => {
      return Object.values(obj).some((value) => value === "Yes");
    }
  ),
  PermanentEmployee: Yup.object().shape({
    top_manage: Yup.string(),
    manu_ser_area: Yup.string(),
    quality_con_tech: Yup.string(),
    admini: Yup.string(),
    storage_warehouse: Yup.string(),
    other: Yup.string(),
    tot_emp: Yup.string(),
  }),
  WorkFromHome: Yup.object().shape({
    top_manage: Yup.string(),
    manu_ser_area: Yup.string(),
    quality_con_tech: Yup.string(),
    admini: Yup.string(),
    storage_warehouse: Yup.string(),
    other: Yup.string(),
    tot_emp: Yup.string(),
  }),
  ContractEmployee: Yup.object().shape({
    top_manage: Yup.string(),
    manu_ser_area: Yup.string(),
    quality_con_tech: Yup.string(),
    admini: Yup.string(),
    storage_warehouse: Yup.string(),
    other: Yup.string(),
    tot_emp: Yup.string(),
  }),
  ParttimeEmployee: Yup.object().shape({
    top_manage: Yup.string(),
    manu_ser_area: Yup.string(),
    quality_con_tech: Yup.string(),
    admini: Yup.string(),
    storage_warehouse: Yup.string(),
    other: Yup.string(),
    tot_emp: Yup.string(),
  }),
  EmployeeTempSite: Yup.object().shape({
    top_manage: Yup.string(),
    manu_ser_area: Yup.string(),
    quality_con_tech: Yup.string(),
    admini: Yup.string(),
    storage_warehouse: Yup.string(),
    other: Yup.string(),
    tot_emp: Yup.string(),
  }),
  Shifts: Yup.object().shape({
    top_manage: Yup.string(),
    manu_ser_area: Yup.string(),
    quality_con_tech: Yup.string(),
    admini: Yup.string(),
    storage_warehouse: Yup.string(),
    other: Yup.string(),
    tot_emp: Yup.string(),
  }),
  NonPermanentEmployee: Yup.object().shape({
    top_manage: Yup.string(),
    manu_ser_area: Yup.string(),
    quality_con_tech: Yup.string(),
    admini: Yup.string(),
    storage_warehouse: Yup.string(),
    other: Yup.string(),
    tot_emp: Yup.string(),
  }),
  AwayClient: Yup.object().shape({
    top_manage: Yup.string(),
    manu_ser_area: Yup.string(),
    quality_con_tech: Yup.string(),
    admini: Yup.string(),
    storage_warehouse: Yup.string(),
    other: Yup.string(),
    tot_emp: Yup.string(),
  }),
  IntegratedCerti: Yup.object().shape({
    ims_integrated_doc: Yup.string().required("Please select an option"),
    management_reviews: Yup.string(),
    internal_audits: Yup.string(),
    policy_objectives: Yup.string(),
    systems_processes: Yup.string(),
    improvement_echanisms: Yup.string(),
    support_responsibilities: Yup.string(),

    conduct_language: Yup.string(),
    certi_program_req: Yup.string(),

    combined_audit: Yup.string(),
    combined_audit_combination: Yup.string(),

    already_certi_standard: Yup.string(),
    name_of_standard: Yup.string(),

    key_process: Yup.string(),
  }),
  EMS: Yup.object().shape({
    sites_managingsametime: Yup.string(),
    sig_environ: Yup.string(),
    environ_manage: Yup.string(),
    inter_environ: Yup.string(),
    inter_environ_implement: Yup.string(),
    sig_environ_sum: Yup.string(),
    environ_legal_req: Yup.string(),
  }),
  OHSAS: Yup.object().shape({
    sig_hazard_sum: Yup.string(),
    hazard_material: Yup.string(),
    ohs_legal_req: Yup.string(),
    union: Yup.string(),
    majoracc_legal_current: Yup.string(),
    over_7_days_abs_current: Yup.string(),
    danger_occ_current: Yup.string(),
    acc_minor_current: Yup.string(),
    majoracc_legal_previous: Yup.string(),
    over_7_days_abs_previous: Yup.string(),
    danger_occ_previous: Yup.string(),
    acc_minor_previous: Yup.string(),
    majoracc_legal_2ago: Yup.string(),
    over_7_days_abs_2ago: Yup.string(),
    danger_occ_2ago: Yup.string(),
    acc_minor_2ago: Yup.string(),
  }),
  ISO27001: Yup.object().shape({
    annex: Yup.string(),
    no_system_users: Yup.string(),
    no_servers: Yup.string(),
    no_workstations: Yup.string(),
    no_appdev_maintenance: Yup.string(),
    network_encrypt_tech: Yup.string(),
    Info_secu_req: Yup.string(),
    related_company_act: Yup.string(),
    isms_doc_imp_sys: Yup.string(),
  }),
  ISO50001: Yup.object().shape({
    no_enms: Yup.string(),
    no_sites_50001: Yup.string(),
    ann_energy: Yup.string(),
    no_energy_res: Yup.string(),
    no_seu: Yup.string(),
  }),
  ISO22000: Yup.object().shape({
    haccp_implement: Yup.string(),
    no_haccp: Yup.string(),
    no_sites_22000: Yup.string(),
    no_pro_line: Yup.string(),
    no_crit_pro: Yup.string(),
    pro_season: Yup.string(),
    pro_contin: Yup.string(),
  }),
  ISO13485: Yup.object().shape({
    no_sites_13485: Yup.string(),
    crit_act: Yup.string(),
  }),
  ISO37001: Yup.object().shape({
    no_empl: Yup.string(),
    abms_risk: Yup.string(),
  }),
  OtabuOffUse: Yup.object().shape({
    name_otabu: Yup.string(),
    Desgn: Yup.string(),
    sign_otabu: Yup.string(),
    proceed_4_review: Yup.string(),
    name_officer: Yup.string(),
    name_app_reviewer: Yup.string(),
    date_otabu_off_use: Yup.string(),
  }),
});
