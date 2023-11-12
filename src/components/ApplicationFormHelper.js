export const formatLabel = (key) => {
  const formattedKey = key.replace("_", " ").replace("_", ":");
  return formattedKey;
};

export const formatLegalKey = (key) => {
  if (key === "traders_distributors") return "Traders/Distributors";
  else if (key === "service_industries") return "Service Industries";
  else return key.charAt(0).toUpperCase() + key.slice(1);
};

export const changedDivisions = (initialValues, values) => {
  console.log(initialValues, values);
  const changedDivisions = Object.keys(values).filter((division) => {
    return (
      JSON.stringify(values[division]) !==
      JSON.stringify(initialValues[division])
    );
  });

  const changedValues = changedDivisions.reduce((acc, division) => {
    acc[division] = values[division];
    return acc;
  }, {});

  return changedValues;
};

export const ApplicationFormInputs = {
  name_of_company: "Name of the Company",
  address: "Address",
  Website: "Website",
  email: "Email",
  phone_number: "Phone number",
  no_of_sites: "No. of Sites",
  site1_address: "Site 1 Address",
  site2_address: "Site 2 Address",
  temporary_site_address: "Temporary Site Address",
  contact_person_name: "Contact person name",
  contact_person_design: "Contact person designation",
  statutory_regulatory_req: "Statutory and Regulatory Requirement ",
  legal_obligation: "Legal Obligation (If any?)",
  accreditation_req: "Accreditation Required",
  scope_of_certification: "Scope of Certification",
  exclusion_clause: "Exclusion clause",
  exclusion_justification: "Exclusion justification",
  outsourced_process: "Outsourced Process",
  shits_employbreakdown_worktypes:
    "Do you run shifts? If so please give employee breakdown and types of work carried out for each shift",
  temporary_sites_number:
    "If you operate on temporary sites (Non-permanent), please detail typical number of sites",
  iaf_technical_code: "IAF Code if Known & Technical Code for QMSMD/FSMS",
  doc_language: "Documentation Language",
  expect_stage1_assessment:
    "When do you expect to be ready for stage-1 assessment?",
  expect_stage2_assessment:
    "When do you expect to be ready for Stage-2 Assessment?",
  external_consultant_experience:
    "Have you used an external consultant or have you got any experience with Management Systems?",
  hear_otabu: "How did you hear about OTABU?",
};

export const IntegratedCertiYesNoInputs = {
  ims_integrated_doc:
    "Is your IMS an integrated documentation set, including work instructions to a good level of development",
  management_reviews:
    "Do your Management Reviews consider the overall business strategy and plan across all standards",
  internal_audits: "Do you have an integrated approach to internal audits",
  policy_objectives:
    "Do you have an integrated approach to policy and objectives",
  systems_processes: "Do you have an integrated approach to systems processes",
  improvement_echanisms:
    "Do you have an integrated approach to improvement Mechanisms",
  support_responsibilities:
    "Do you have Integrated management support and responsibilities",
};

export const EMSYesNoInputs = {
  sites_managingsametime:
    "How many Sites the company is Managing at the same time?",
  sig_environ: "Do you have Register of Significant Environment aspect?",
  environ_manage: "Do you have an Environmental Management Manual?",
  inter_environ: "Do you have an Internal Environmental Audit Programme?",
  inter_environ_implement:
    "Has the Internal Environmental Audit Programme been implemented?",
};

export const OHSASInputs = {
  sig_hazard_sum:
    "Please summarise the significant Hazards that you have identified :",
  hazard_material:
    "Please detail any hazardous materials that you typically use or come into contact with (give site specific details where appropriate) :",
  ohs_legal_req:
    "Please detail any OH&S legal requirements related to your company activity :",
  union: "Do you recognise any Union(s), if so please give details :",
};

export const ISO27001Inputs = {
  annex:
    "Please list the ISO 27001 Annex A control objectives and controls that are justified as exclusions :",
  no_system_users: "Number of system users :",
  no_servers: "Number of servers :",
  no_workstations: "Number of workstations :",
  no_appdev_maintenance:
    "Number of application development and maintenance staff :",
  network_encrypt_tech:
    "Provide details of Network and encryption technology in use as part of the ISMS :",
  Info_secu_req: "Please detail any Information security legal requirements :",
  related_company_act: "Related to your company activity :",
};

export const ISO50001Inputs = {
  no_enms: "Total Number of EnMS Effective Personnel in the Company",
  no_sites_50001: "No of Sites",
  ann_energy: "Annual Energy Consumption (TJ-Total Final Energy Consumption)",
  no_energy_res: "Number of Energy Resources in the Organisation",
  no_seu: "Number of Significant Energy Uses (SEUs)",
};

export const ISO22000Inputs = {
  no_haccp: "No of HACCP Studies",
  no_sites_22000: "No of Sites",
  no_pro_line: "No of Process Lines",
  no_crit_pro: "No. of Critical Processes",
};

export const columns = {
  PermanentEmployee: "Permanent  Employee",
  WorkFromHome: "Work from Home",
  ContractEmployee: "Contracted /Subcontr- acted Employee",
  ParttimeEmployee: "Part Time Employee",
  EmployeeTempSite: "Employee At temporary site",
  Shifts: "Shifts (1/2/3)",
  NonPermanentEmployee: "Non Permanent Employee",
  AwayClient: "Personnel who working away from the Client Premises",
};

export const rows = {
  top_manage: "Top Management",
  manu_ser_area: "Manufacturing /Service Area",
  quality_con_tech: "Quality Control/ Technical",
  admini: "Administration",
  storage_warehouse: "Storage/ Warehouse",
  other: "Other",
  tot_emp: "Total Employee",
};

export const tableColumnKeys = {
  PermanentEmployee: "PermanentEmployee",
  WorkFromHome: "WorkFromHome",
  ContractEmployee: "ContractEmployee",
  ParttimeEmployee: "ParttimeEmployee",
  EmployeeTempSite: "EmployeeTempSite",
  Shifts: "Shifts",
  NonPermanentEmployee: "NonPermanentEmployee",
  AwayClient: "AwayClient",
};

export const acciStatColkeys = {
  _current: "Current Year",
  _previous: "Previous Year",
  _2ago: "2 Years ago",
};

export const acciStatRowkeys = {
  majoracc_legal: "Major accidents/legal action",
  over_7_days_abs: "Over seven days absences because of an incident",
  danger_occ: "Dangerous occurrences",
  acc_minor: "Accidents/Incidents - minor not requiring hospital treatment",
};

export const initialValues = {
  ApplicationForm: {
    date_of_app: "",
    name_of_company: "",
    address: "",
    Website: "",
    email: "",
    phone_number: "",
    no_of_sites: "",
    site1_address: "",
    site2_address: "",
    temporary_site_address: "",
    contact_person_name: "",
    contact_person_design: "",

    statutory_regulatory_req: "",
    legal_obligation: "",
    accreditation_req: "",

    scope_of_certification: "",
    exclusion_clause: "",
    exclusion_justification: "",
    outsourced_process: "",

    shits_employbreakdown_worktypes: "",
    temporary_sites_number: "",
    iaf_technical_code: "",
    doc_language: "",
    expect_stage1_assessment: "",
    expect_stage2_assessment: "",
    external_consultant_experience: "",
    hear_otabu: "",
  },
  LegalStatus: {
    private: "No",
    public: "No",
    proprietorship: "No",
    partnership: "No",
    govt: "No",
    psu: "No",
    ngo: "No",
    manufacturing: "No",
    traders_distributors: "No",
    service_industries: "No",
  },
  CertificationScheme: {
    ISO_9001_2015: "No",
    ISO_14001_2015: "No",
    ISO_45001_2018: "No",
    ISO_13485_2016: "No",
    ISO_22000_2018: "No",
    ISO_27001_2013: "No",
    ISO_37001_2016: "No",
    ISO_22301_2019: "No",
    ISO_50001_2018: "No",
    ISO_20001_2018: "No",
    others: "No",
  },
  PermanentEmployee: {
    top_manage: "",
    manu_ser_area: "",
    quality_con_tech: "",
    admini: "",
    storage_warehouse: "",
    other: "",
    tot_emp: "",
  },
  WorkFromHome: {
    top_manage: "",
    manu_ser_area: "",
    quality_con_tech: "",
    admini: "",
    storage_warehouse: "",
    other: "",
    tot_emp: "",
  },
  ContractEmployee: {
    top_manage: "",
    manu_ser_area: "",
    quality_con_tech: "",
    admini: "",
    storage_warehouse: "",
    other: "",
    tot_emp: "",
  },
  ParttimeEmployee: {
    top_manage: "",
    manu_ser_area: "",
    quality_con_tech: "",
    admini: "",
    storage_warehouse: "",
    other: "",
    tot_emp: "",
  },
  EmployeeTempSite: {
    top_manage: "",
    manu_ser_area: "",
    quality_con_tech: "",
    admini: "",
    storage_warehouse: "",
    other: "",
    tot_emp: "",
  },
  Shifts: {
    top_manage: "",
    manu_ser_area: "",
    quality_con_tech: "",
    admini: "",
    storage_warehouse: "",
    other: "",
    tot_emp: "",
  },
  NonPermanentEmployee: {
    top_manage: "",
    manu_ser_area: "",
    quality_con_tech: "",
    admini: "",
    storage_warehouse: "",
    other: "",
    tot_emp: "",
  },
  AwayClient: {
    top_manage: "",
    manu_ser_area: "",
    quality_con_tech: "",
    admini: "",
    storage_warehouse: "",
    other: "",
    tot_emp: "",
  },
  IntegratedCerti: {
    ims_integrated_doc: "",
    management_reviews: "",
    internal_audits: "",
    policy_objectives: "",
    systems_processes: "",
    improvement_echanisms: "",
    support_responsibilities: "",
    conduct_language: "",
    certi_program_req: "",
    combined_audit: "",
    combined_audit_combination: "",
    already_certi_standard: "",
    name_of_standard: "",
    key_process: "",
  },
  EMS: {
    sites_managingsametime: "",
    sig_environ: "",
    environ_manage: "",
    inter_environ: "",
    inter_environ_implement: "",
    sig_environ_sum: "",
    environ_legal_req: "",
  },
  OHSAS: {
    sig_hazard_sum: "",
    hazard_material: "",
    ohs_legal_req: "",
    union: "",
    majoracc_legal_current: "",
    over_7_days_abs_current: "",
    danger_occ_current: "",
    acc_minor_current: "",
    majoracc_legal_previous: "",
    over_7_days_abs_previous: "",
    danger_occ_previous: "",
    acc_minor_previous: "",
    majoracc_legal_2ago: "",
    over_7_days_abs_2ago: "",
    danger_occ_2ago: "",
    acc_minor_2ago: "",
  },
  ISO27001: {
    annex: "",
    no_system_users: "",
    no_servers: "",
    no_workstations: "",
    no_appdev_maintenance: "",
    network_encrypt_tech: "",
    Info_secu_req: "",
    related_company_act: "",
    isms_doc_imp_sys: "",
  },
  ISO50001: {
    no_enms: "",
    no_sites_50001: "",
    ann_energy: "",
    no_energy_res: "",
    no_seu: "",
  },
  ISO22000: {
    haccp_implement: "",
    no_haccp: "",
    no_sites_22000: "",
    no_pro_line: "",
    no_crit_pro: "",
    pro_season: "No",
    pro_contin: "No",
  },
  ISO13485: {
    no_sites_13485: "",
    crit_act: "",
  },
  ISO37001: {
    no_empl: "",
    abms_risk: "",
  },
  OtabuOffUse: {
    name_otabu: "",
    Desgn: "",
    sign_otabu: "",
    proceed_4_review: "",
    name_officer: "",
    name_app_reviewer: "",
    date_otabu_off_use: "",
  },
};
