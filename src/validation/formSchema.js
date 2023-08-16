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

export const auditProgramFormSchema = Yup.object({
  AuditProgram: Yup.object().shape({
    org_name: Yup.string(),
    address: Yup.string(),
    scope: Yup.string(),
    standard: Yup.string(),
    sites_2b_audited: Yup.string(),
    certi_audit: Yup.string(),
    surveillance_audit: Yup.string(),
  }),

  ProcessStage1: Yup.object().shape({
    man_days: Yup.string(),
    date_of_planning: Yup.string(),
    lead_auditor: Yup.string(),
    auditor: Yup.string(),
    technical_expert: Yup.string(),
  }),

  ProcessStage2: Yup.object().shape({
    man_days: Yup.string(),
    date_of_planning: Yup.string(),
    lead_auditor: Yup.string(),
    auditor: Yup.string(),
    technical_expert: Yup.string(),
  }),

  ProcessSurveillance1: Yup.object().shape({
    man_days: Yup.string(),
    date_of_planning: Yup.string(),
    lead_auditor: Yup.string(),
    auditor: Yup.string(),
    technical_expert: Yup.string(),
  }),

  ProcessSurveillance2: Yup.object().shape({
    man_days: Yup.string(),
    date_of_planning: Yup.string(),
    lead_auditor: Yup.string(),
    auditor: Yup.string(),
    technical_expert: Yup.string(),
  }),

  ProcessRenewal: Yup.object().shape({
    man_days: Yup.string(),
    date_of_planning: Yup.string(),
    lead_auditor: Yup.string(),
    auditor: Yup.string(),
    technical_expert: Yup.string(),
  }),

  TopManagePolicyImprove: Yup.object().shape({
    stage1: Yup.string(),
    stage2: Yup.string(),
    sa1: Yup.string(),
    sa2: Yup.string(),
    renewal: Yup.string(),
  }),

  QMSDocConOrgRiskIntMRM: Yup.object().shape({
    stage1: Yup.string(),
    stage2: Yup.string(),
    sa1: Yup.string(),
    sa2: Yup.string(),
    renewal: Yup.string(),
  }),

  HRTrainWork: Yup.object().shape({
    stage1: Yup.string(),
    stage2: Yup.string(),
    sa1: Yup.string(),
    sa2: Yup.string(),
    renewal: Yup.string(),
  }),

  MarketCustReqFeedback: Yup.object().shape({
    stage1: Yup.string(),
    stage2: Yup.string(),
    sa1: Yup.string(),
    sa2: Yup.string(),
    renewal: Yup.string(),
  }),

  ProductionQAMaintAnalyCA: Yup.object().shape({
    stage1: Yup.string(),
    stage2: Yup.string(),
    sa1: Yup.string(),
    sa2: Yup.string(),
    renewal: Yup.string(),
  }),

  PurchaseStoresDispatch: Yup.object().shape({
    stage1: Yup.string(),
    stage2: Yup.string(),
    sa1: Yup.string(),
    sa2: Yup.string(),
    renewal: Yup.string(),
  }),

  UseOfLogo: Yup.object().shape({
    stage1: Yup.string(),
    stage2: Yup.string(),
    sa1: Yup.string(),
    sa2: Yup.string(),
    renewal: Yup.string(),
  }),
});

export const agreementFormSchema = Yup.object({
  client: Yup.string(),
  other_site: Yup.string(),
  scope: Yup.string(),
  other_certification: Yup.string(),
  client_approval_date: Yup.string(),
  client_sign: Yup.string(),
  client_stamp: Yup.string(),
  client_name_desig: Yup.string(),
  company_name: Yup.string(),
  otabu_approval_date: Yup.string(),
  otabu_sign: Yup.string(),
  otabu_stamp: Yup.string(),
  otabu_name_desig: Yup.string(),
});

export const remarkFormSchema = Yup.object({
  remark: Yup.string().required("This field is required"),
  acceptance_choice: Yup.string().required("Please choose an option"),
});

export const quotationFormSchema = Yup.object().shape({
  QuotationPart1: Yup.object().shape({
    date: Yup.string(),
    ref: Yup.string(),
    name: Yup.string(),
    org_name: Yup.string(),
    address: Yup.string(),
    cetification: Yup.string(),
    application_fees: Yup.string(),
    stage_1_audit_fees: Yup.string(),
    stage_2_audit_fees: Yup.string(),
    otabu_sign: Yup.string(),
    client_sign: Yup.string(),
    client_name: Yup.string(),
    client_seal: Yup.string(),
  }),

  QuotationPart2: Yup.object().shape({
    total_first_year: Yup.string(),
    surveillance_audit_fees: Yup.string(),
    grand_total_fees_3_year: Yup.string(),
    IMS_audit: Yup.string(),
    eff_no_personnel: Yup.string(),
    consdr_eff_no_personnel: Yup.string(),
    audit_time_dtrmn_fact_applied: Yup.string(),
    on_site_manday: Yup.string(),
    off_site_manday: Yup.string(),
    total_no_sites: Yup.string(),
    consdrtn_initial_certifi: Yup.string(),
    consdrtn_1st_surveil: Yup.string(),
    consdrtn_2nd_surveil: Yup.string(),
  }),
});

export const applicationReviewFormSchema = Yup.object().shape({
  ApplicationReview: Yup.object().shape({
    name_of_org: Yup.string(),
    address: Yup.string(),
    name_con_busi_asso: Yup.string(),
    con_busi_asso_affect: Yup.string(),
    how: Yup.string(),
    approval: Yup.string(),
    type_of_industry: Yup.string(),
    standard: Yup.string(),
    scope: Yup.string(),
  }),

  SiteCapaOutsource: Yup.object().shape({
    tot_no_sites: Yup.string(),
    consdan_init_certi: Yup.string(),
    consdan_1st_surveil: Yup.string(),
    consdan_2nd_surveil: Yup.string(),
    outsource_process: Yup.string(),
    exclusions: Yup.string(),
    iaf_code: Yup.string(),
    qms_risk_category: Yup.string(),
    ems_compl_category: Yup.string(),
    oh_sms_compl_category: Yup.string(),
    code_match_scope: Yup.string(),
    audor_train_verifi: Yup.string(),
    tot_no_empl_shift_1: Yup.string(),
    tot_no_empl_shift_2: Yup.string(),
    tot_no_empl_shift_3: Yup.string(),
  }),

  TotEmplMandaysTeam: Yup.object().shape({
    full_time: Yup.string(),
    part_time: Yup.string(),
    work_from_home: Yup.string(),
    temporary: Yup.string(),
    contracting: Yup.string(),
    total_no_employee: Yup.string(),
    mandays_req: Yup.string(),
    mandays_planned: Yup.string(),
    stage_1: Yup.string(),
    stage_2: Yup.string(),
    surveil_freq: Yup.string(),
    recerti_mandays: Yup.string(),
    lead_auditor: Yup.string(),
    auditor_1: Yup.string(),
    auditor_2: Yup.string(),
  }),

  QMSWorkingTable: Yup.object().shape({
    tot_no_empl: Yup.string(),
    addition: Yup.string(),
    redn_justifi: Yup.string(),
    redn_integra: Yup.string(),
    redn_off_site: Yup.string(),
    addn_redn: Yup.string(),
    tot_mandays_deli_cal: Yup.string(),
    stage_1_audit: Yup.string(),
    stage_2_audit: Yup.string(),
    surveil_1: Yup.string(),
    surveil_2: Yup.string(),
    recertifi: Yup.string(),
  }),

  EMSWorkingTable: Yup.object().shape({
    tot_no_empl: Yup.string(),
    addition: Yup.string(),
    redn_justifi: Yup.string(),
    redn_integra: Yup.string(),
    redn_off_site: Yup.string(),
    addn_redn: Yup.string(),
    tot_mandays_deli_cal: Yup.string(),
    stage_1_audit: Yup.string(),
    stage_2_audit: Yup.string(),
    surveil_1: Yup.string(),
    surveil_2: Yup.string(),
    recertifi: Yup.string(),
  }),

  OHSSWorkingTable: Yup.object().shape({
    tot_no_empl: Yup.string(),
    addition: Yup.string(),
    redn_justifi: Yup.string(),
    redn_integra: Yup.string(),
    redn_off_site: Yup.string(),
    addn_redn: Yup.string(),
    tot_mandays_deli_cal: Yup.string(),
    stage_1_audit: Yup.string(),
    stage_2_audit: Yup.string(),
    surveil_1: Yup.string(),
    surveil_2: Yup.string(),
    recertifi: Yup.string(),
  }),

  TotWorkingTable: Yup.object().shape({
    tot_no_empl: Yup.string(),
    addition: Yup.string(),
    redn_justifi: Yup.string(),
    redn_integra: Yup.string(),
    redn_off_site: Yup.string(),
    addn_redn: Yup.string(),
    tot_mandays_deli_cal: Yup.string(),
    stage_1_audit: Yup.string(),
    stage_2_audit: Yup.string(),
    surveil_1: Yup.string(),
    surveil_2: Yup.string(),
    recertifi: Yup.string(),
  }),

  IMSOfComSys: Yup.object().shape({
    ims_integra_doc: Yup.string(),
    consi_overall: Yup.string(),
    integr_appro_inte_audit: Yup.string(),
    integr_appro_policy: Yup.string(),
    integr_appro_sys: Yup.string(),
    integr_appro_impro_mech: Yup.string(),
    ims_respon: Yup.string(),
    prefer_lang: Yup.string(),
  }),

  IntegrationFactors: Yup.object().shape({
    ims_complex: Yup.string(),
    tot_points_incr: Yup.string(),
    extent_of_integra: Yup.string(),
    org_perso_more_1_manage: Yup.string(),
    auditor_compe_more_1_sys: Yup.string(),
    time_1_open_1_close: Yup.string(),
    time_1_integra_audit: Yup.string(),
    time_opti_logi: Yup.string(),
    time_auditor_tm_meet: Yup.string(),
    time_common_ele: Yup.string(),
    tot_points_redn: Yup.string(),
  }),

  QMSEMSOHSIncrFactors: Yup.object().shape({
    compx_logis_more_1_build: Yup.string(),
    staff_more_1_lang: Yup.string(),
    large_site_4_perso: Yup.string(),
    high_regulations: Yup.string(),
    sys_high_compx: Yup.string(),
    acti_temp_con4_perma: Yup.string(),
    outsourced_fun: Yup.string(),
    high_risk_acti: Yup.string(),
    high_sensi_envi_ems: Yup.string(),
    view_intrest_ems_ohs: Yup.string(),
    indirect_incre_audit_ems: Yup.string(),
    addi_envi_ems: Yup.string(),
    risk_envi_ems: Yup.string(),
    rate_acci_ohs: Yup.string(),
    member_public_on_org_site_ohs: Yup.string(),
    legal_proceed_ohs: Yup.string(),
    temp_large_subcontra_incre_ohs_risks: Yup.string(),
    danger_subs_risk: Yup.string(),
    org_sites_in_other_coun: Yup.string(),
    tot_points_incr: Yup.string(),
  }),

  QMSEMSOHSRednFactors: Yup.object().shape({
    not_design_respon_qms: Yup.string(),
    small_site_4_perso: Yup.string(),
    maturity_of_manage_sys: Yup.string(),
    prior_kwldge_client_manag_sys: Yup.string(),
    client_prepa_certi: Yup.string(),
    high_automation: Yup.string(),
    staff_include_off_locn: Yup.string(),
    low_risk_product_q_e_ohs: Yup.string(),
    tot_points_redn: Yup.string(),
  }),

  OtabuOffSignDate: Yup.object().shape({
    review_conducted_AO_TM: Yup.string(),
    date_1: Yup.string(),
    tech_support_code_TE_LA: Yup.string(),
    date_2: Yup.string(),
    approved_by_DTO_MD: Yup.string(),
    date_3: Yup.string(),
  }),
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
