import React, { useContext, useEffect, useState } from "react";
import "./styles/agreementAndRules.scss";
import { agreementFormSchema } from "../validation/formSchema";
import Spinner from "./Spinner";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useFormik } from "formik";

const content = [
  {
    title: "1 INTRODUCTION",
    details: [
      "OTABU GLOBAL is a Private Limited, independent certification body for management systems certification. Although not a statement guaranteeing that the product or services actually meet specified requirements, accredited certification of a management system is a measure of compliance with the appropriate international standards.",
    ],
  },
  {
    title: "2 SCOPE OF THE RULES OF REGISTRATION",
    details: [
      "These rules of registration are applicable to all management system audits undertaken by OTABU GLOBAL within the current scope of accreditation as detail on the accreditation board web site. In fulfilling this scope, the client agrees to supply all necessary information to OTABU GLOBAL so that a full and fair assessment can be undertaken.",
    ],
  },
  {
    title: "3 PERSONNEL",
    details: [
      "OTABU GLOBAL undertakes to provide suitably qualified and competent personnel for all audit and surveillance activities using their own staff or suitable qualified and competent associates. All members of OTABU GLOBAL (full-time employees, associates or local representatives) are required to sign confidentiality agreements concerning all confidential information to which they may be exposed.",
    ],
  },
  {
    title: "4 APPLICATION FOR REGISTRATION",
    details: [
      "On receiving a completed Application Form/Request for Quotation OTABU GLOBAL or its local representative will prepare a quotation detailing audit cost which will be forwarded to the client along with a copy of this document. Acceptance of the quotation and Certification Agreement and Rules is shown by signing the Certification Rules and Agreement. On receipt of the signed Certification Rules and Agreement and acceptance of the quote, OTABU GLOBAL or its local representative will issue an invoice to the client who in turn will make payment to OTABU GLOBAL or its local representative. The audit will then be planned and carried out in accordance with OTABU GLOBAL accredited management system processes. The agreement covers all the sites as mentioned above.",
    ],
  },
  {
    title: "5 AUDIT METHOD",
    details: [
      "The first stage of the audit requires the Auditor to conduct an on-site readiness review of the client’s management system to assess the documentation and if the implementation of the management system is at a level sufficient to progress to the Stage two audit.",
      "When satisfied with the compliance of the documentation and system readiness the Auditor will produce a report and will agree a date with the client for the Stage 2 audit. The Stage 2 audit will then be conducted in accordance with OTABU GLOBAL accredited management system processes. If further visits are required, due to non-compliances found, these will be undertaken and the client will be liable for any extra charges incurred. In case of any Major Non Conformity recommendation for certification will be granted based on On-site Follow Up Audit. The audit will be carried out against agreed audit criteria. Once registration has been obtained the client will be under a duty to notify OTABU GLOBAL of any changes that significantly affect the registration. OTABU GLOBAL may re-audit if necessary (short notice) due to the significant changes or as a result of any complaint, or follow up on suspended clients. If any additional charges are incurred OTABU GLOBAL reserves the right to pass these additional charges on to the client.",
    ],
  },
  {
    title: "6 CERTIFICATION",
    details: [
      "On completion of the audit the Auditor will submit the report to the OTABU GLOBAL Quality Manger who will do the administrative review of file and present the file to OTABU GLOBAL’s Certification Committee. The Certification Committee will make the certification decision and authorize the issue of the certificate after the Technical Review of the Client File. The certificate remains the property of OTABU GLOBAL and is valid for three years, providing the client maintains the management system to the required standard. All certification activities and the management of impartiality is overseen by an Independent Certification Board. The Issue certificate status will reflect on our website www.otabuglobal.com",
    ],
  },
  {
    title: "7 ANNUAL REGISTRATION AND SURVEILLANCE",
    details: [
      "After the issue of a certificate, planned surveillance visits will be carried out by an Auditor at the client's premises at least annually in order to maintain registration. If areas of concern are identified, more visits may be carried out at the discretion of the OTABU Global The client agrees to meet the extra costs relating to any additional audits. A triennial re-certification audit is required to maintain registration. The client will notify OTABU GLOBAL without delay of any matters incurred that may affect the capability of the management system to fulfill requirements.",
    ],
  },
  {
    title: "8 EXTENSION OR REVISION TO THE SCOPE OF REGISTRATION",
    details: [
      "This may be applied for in the same way as the initial audit, indicating the increased scope/address change of registration required. The audit will be carried out in the areas not previously audited. If successful, a new certificate indicating the new scope/address change will be issued by OTABU GLOBAL There will be a charge for extensions to scope/address change and the re-issuing of the certificate. Should a certified scope be reduced, the client will need to amend all advertising matter accordingly.",
    ],
  },
  {
    title: "9 PUBLICITY",
    details: [
      "When a certificate has been issued, the client has the right to publish the fact. The relevant logos can be used on stationery relating only to the audited scope of registration and standard. Separate logo rules will be issued by OTABU GLOBAL at the time of registration.",
    ],
  },
  {
    title: "10 CERTIFICATE MISUSE",
    details: [
      "OTABU GLOBAL will take all necessary steps to ensure that there is no misuse of the logo or the certificate by the client. The client undertakes not to misuse or misrepresent the logo or the certificate in any way.",
    ],
  },
  {
    title: "11 FEES",
    details: [
      "All fees for audits and annual registration are reviewed annually and are available on request. All fees paid to OTABU GLOBAL are strictly nonrefundable. Certification & Surveillance fees are payable in advance and are to maintain registration.",
    ],
  },
  {
    title: "12 CERTIFICATE SUSPENSION OR WITHDRAWAL",
    details: [
      "Following a successful audit of a client's management system to the appropriate standards or specifications, the certificate:",
    ],
  },
  {
    title: "May be suspended due to:",
    details: [
      "•	Continued misuse of logos",
      "•	Failure to apply corrective action as a result of discrepancies found at audit or surveillance visits.",
      "•	Any other breach of OTABU GLOBAL's Certification Agreement & Rules.",
      "•	Non Payment of Audit Fee as agreed",
    ],
  },
  {
    title: "Or withdrawn due to:",
    details: [
      "•	Failure to respond to requests made by OTABU GLOBAL after suspension of certificate",
      "•	Failure of a client to settle a financial account",
      "•	the client's request",
      "Following either the suspension or withdrawal of a certificate the client will discontinue its use and return the original to OTABU GLOBAL and discontinue claiming accredited management system registration and No use of logo, certificate and other property of OTABU after withdraw the certificate in advertising matter or any other source. If find that OTABU will bound to take legal action against this use.",
    ],
  },
  {
    title: "13 APPEALS PROCEDURE",
    details: [
      "If for any reason a client disagrees with the Auditor's verdict they are at liberty to lodge an appeal OTABU GLOBAL’s Managing Director. All appeals will be held in the presence of an Independent Certification Board sub-committee. The sub-committee will hear evidence from the client's representative and the relevant Auditor. The decision of the Independent Certification Board is final and binding on both the client and OTABU GLOBAL. No counter claims will be allowed by either party. No costs, for whatever reason, will be allowed for either party as a result of an appeal. Expenses of the appeal will be met in full by the party who has the decision against them.",
    ],
  },
  {
    title: "14. INFORMATION ABOUT CHANGES IN MANAGEMENT SYSTEM",
    details: [
      "The organization shall ensure that the information provided to OTABU GLOBAL relevant to its Management System is kept updated and it shall promptly notify OTABU GLOBAL of any intended change in its Management system which would significantly affect the effective implementation of its Management System. Such changes are contact address, multiple sites/single location, legal status, scope of representation, organizational structural changes.",
      "In the event of any significant change affecting the activity and operation of the organization, OTABU GLOBAL may require to conduct a reassessment for further validity of the certification.",
    ],
  },
  {
    title: "15 CLIENT COMPLAINTS AGAINST OTABU GLOBAL PERSONNEL",
    details: [
      "If a client has a complaint regarding any employee or associate of OTABU GLOBAL, this should be sent in writing to the OTABU GLOBAL Managing Director at the Head Office address. If the complaint involves a Managing Director then the complaint is to be addressed to the Impartiality Committee.",
    ],
  },
  {
    title: "16 COMPLAINTS AGAINST THE REGISTERED COMPANY",
    details: [
      "If the registration/ certification scope requirements are changed in OTABU:",
      "a. OTABU will inform Client about changed requirements, withdraw and suspended accreditation by electronic media/News Letter/Emails or on website within a reasonable period.",
      "b. In case of reducing the certification scope, withdrawal or suspension of the audit scopes by accreditation body (if any) as the result of OTABU fault, OTABU will arrange audit and certification services from other accredited bodies, at its own cost, during the continuation of this contract",
      "c. In case of changes in OTABU registered office or logo, OTABU will change the certificate of client with immediate effect to client with amendment of OTABU Information. Also keep updation on OTABU Website.",
      "d. OTABU has ensures that not make or permit any misleading statement regarding our certification & processes.",
      "e. In case of withdraw of OTABU’s accreditation; OTABU will not use any advertising material that contains about accredited certificates.",
      "f. In case of reduction the scope, will publish on website www.otabuglobal.com",
      "g. OTABU can’t clients to allow use of certification logo & accreditation symbol on their products (Including Service) or process.",
      "h. OTABU can’t do certified sites or activities which are not involve in client’s scope.",
      "i. OTABU does not use its certification in such a manner that would bring the certification body and/or certification system into disrepute and lose public trust.",
      "j. The OTABU will exercise proper control of ownership and will take action to deal with incorrect references to certification status or misleading use of certification documents, marks or audit reports.",
    ],
  },
  {
    title: "18 TERMS OF PAYMENT",
    details: [
      "Cancellation of audit or surveillance dates by the client within twenty working days of the agreed dates will result in OTABU GLOBAL claiming an extra levy equivalent to one man day from the company for each staff day cancelled. Payments are due in accordance with the contract.",
    ],
  },
  {
    title: "19 LIMITATION OF LIABILITY & INDEMNITY",
    details: [
      "OTABU will exercise due care and skill in the performance of its services and accepts responsibility only in cases of proven negligence",
      "OTABU shall have no liability to the Client arising out of or in connection with the Contract and its performance by reason of any representation or the breach of any express or implied condition, warranty or other term of any duty at common law or under any statute for any indirect, special or consequential loss of the Client (including loss of profits), and the total liability of the Company to the Client in respect of any other loss shall be limited in respect of any one event or series of connected events, to an amount equal to the fees paid to the Company under the Contract (excluding General Sales Tax thereon)",
      "The Client shall guarantee, hold harmless and indemnify OTABU and its officers, employees, agents or subcontractors against all claims made by any third party for loss, damage or expense of whatsoever nature including reasonable legal expenses and howsoever arising relating to the performance, purported performance or non-performance of any services to the extent that the aggregate of any such claims relating to any one service exceed the limit mentioned.",
      "OTABU reserves the right to add to, delete or change these conditions to maintain conformance with Accreditation Board requirements, without prior notification",
      "Responsibility & Authority – OTABU is responsible for and retains absolute authority for decisions relating to the granting, Refusing, maintaining of certification, expanding or reducing the scope of certification, renewing, suspending or restoring following suspension, or withdrawing of certification",
      "Neither OTABU GLOBAL nor any of its employees or auditors shall be liable for any loss, expense or damage however so sustained by any company, client or person due to any act whatsoever taken by OTABU GLOBAL or its employees or auditors, save to the extent that any attempted exclusion or liability would be contrary to law.",
      "The client will indemnify OTABU GLOBAL against any claims or losses suffered by OTABU GLOBAL as a result of misuse or misrepresentation by the client of any logo, approval or registration given to the client by OTABU GLOBAL under these Certification Agreement & Rules. The client shall inform OTABU GLOBAL of changes related to legal status, organizational/management, address & sites, scope, major change in management system and processes. Acceptance of this document means the Organization is ready to follow all the terms and conditions as defined in this document and Accredited Management System Process (OTABU GLOBAL-F002), hence this document will be considered as a legally enforceable document to deal with any misconduct.",
    ],
  },
  {
    title:
      "20 ACCREDITATION BOARD WITNESSED AUDITS & REVIEW OF CLIENT’s DOCUMENTS",
    details: [
      "It is a condition of these Certification Agreement & Rules that all OTABU GLOBAL certificated clients should, if requested or not requested, allow Accreditation Board auditors to witness with or without OTABU GLOBAL’ staff members & carrying out their audits as well as verify and review the clients’ documents. Failure to allow this could jeopardize the client's registration.",
    ],
  },
  {
    title: "21. CONFIDENTIALITY",
    details: [
      "Information about Client shall not be disclosed to a third party without written consent of Client except in case where required by accreditation requirements. Even if the law requires information to be disclosed to a third party, the customer shall be informed of the information provided. In the following cases, the information can be disclosed to a third party without written consent of Client :",
      "a.	Information that OTABU already has before Client provides.",
      "b.	Information disclosed or expected to be disclosed publicly and regally.",
      "c.	Information that OTABU legally obtained from source other than the Client.",
    ],
  },
  {
    title: "22. CONDUCT OF CERTIFICATION AUDIT",
    details: [
      "a. Audit of the Client’s managements system shall be performed to verify its conformity to the applied audit standard.",
      "b. Client’s system documents (Manual, Procedure, work instructions and Guidelines, etc.) and relevant records shall be reviewed offsite & onsite during stage-1 adequacy audit, prior to on-site Compliance audit. This primary adequacy audit is done to verify whether the Client’s management system,  prima facie meets the requirements of the applicable standards or not. If inadequacies / non conformities are identified in course of the stage-1 audit, these shall be brought to the notice of the Client’s Management in writing. Action for stage-2 compliance audit shall be initiated only after receiving the Client’s commitment that the identified inadequacies/ non conformities have been eliminated. ",
      "c. On-site Compliance audit also called stage-2 audit, is performed to assess whether the Client’s practice is in accordance with the established management System or not. If nonconformities are found during on-site audit, OTABU audit team shall issue NCR (Non-conformity Report)",
      "d. The Client shall accept the NC Report / Corrective action request, and shall submit in writing its corrective action plan within one week, detailing what action it intends to take, to correct the non conformities and to stop its recurrence. After receiving the corrective action plan from Client the OTABU auditor’s shall inform the Client in writing about acceptance / required revision of the submitted corrective action plan. The client shall be informed by the audit team about mode and timings of verification of the effectiveness of the corrective action taken by the client.  ",
      "e. The Client can make appeal to OTABU, regarding the audit team’s findings and decisions. The OTABU  shall take appropriate decision within 30 working days of receiving such appeal. ",
      "f. The Client shall remove all minor nonconformities within 30 days of receiving the OTABU auditor’s acceptance / approval of the Corrective action plan submitted by the Client. Similarly the Client shall have to eliminate all major non conformities within 90 days. Evidence of taking corrective action shall be submitted to the OTABU. ",
      "g. After receiving the evidences OTABU shall decide whether the submitted evidences inspire confidence about the effectiveness of the corrective action or not. OTABU may chose to revisit the audit site to verify effectiveness of the corrective actions, at Client’s cost. ",
      "h. After confirming, on the basis of objective evidences, that the Client’s Management system’s conforms to the audit standard, the OTABU audit team shall submit its recommendations for award of Certificate of compliance to the OTABU Technical committee. ",
      "i. The Technical committee shall review the whole audit process and the submitted audit report, and shall take appropriate decision. OTABU shall issue Certificate of conformity only in accordance with the established procedures and regulatory guidelines. ",
      "j. The client shall allow OTABU auditors, external experts / observers access to all work site, and documented information related to the applied scope. The client agrees to allow the auditors to interview its staff and review all records except accounts, specially the records of complaints received and the action taken on the same.",
      "k. Competent Audit team selection will do by OTABU GLOBAL SERVICES staff as per the client scope and application codes and send the audit plan as well as audit intimation letter to the client via mail or courier. If client need to be change in audit team or audit plan, will confirm to OTABU Office within due time with proper justification. ",
      "l. If schedule visits will change or delay due to unavoidable reasons or valid reasons, OTABU will inform to client about the delay or change in visits.",
      "m. If client need to cancellation the certification process, will inform to OTABU within due time or before audit team will go for audit with proper reason and justification. ",
      "n. If audits will carried out and client will inform to OTABU for cancellation after stage 2 audits. This will not acceptable by OTABU in any case. Client will bound to give full payment of OTABU or give appeal in OTABU’s Impartiality committee",
    ],
  },
  {
    title: "23. OBLIGATIONS OF THE CLIENT",
    details: [
      "It is a condition of these Certification Agreement & Rules that all OTABU certificated clients should, if requested or not requested, allow Accreditation Board auditors to witness with or without OTABU’ staff members & carrying out their audits as well as verify and review the clients’ documents. Failure to allow this could jeopardize the client's registration.",
      "The legally enforceable arrangements shall also require that the certified client informs the Certification Body, without delay, of the occurrence of a serious incident or breach of regulation necessitating the involvement of the competent regulatory authority as well as provide safe environment to the audit team at the time of any type of audit through CB or AB.",
      "The Client agrees to make available to OTABU, all documents, and other information required by OTABU to complete the audit program. The Client shall ensure that all necessary access, assistance, information and facilities are made available to OTABU when required, including the assistance of competent and authorized personnel of the Client.  The Client shall, in addition, provide OTABU, free of charge, suitable space for meeting.",
      "Before the certification audit, the OGS have to ask the client to report if any ISMS related information (such as ISMS records or information about design and effectiveness of controls) cannot be made available for review by the audit team because it contains confidential or sensitive information. OGS will determine whether the ISMS can be adequately audited in the absence of such information. If the OGS concludes that it is not possible to adequately audit the ISMS without reviewing the identified confidential or sensitive information, it has to advise the client that the certification audit cannot take place until appropriate access arrangements are granted.",
      "The Client shall appoint a designated person who is authorized to maintain contact with OTABU",
      "The Client shall give access to all sites for maintenance audit purposes whenever deemed necessary, and OTABU shall reserve the right to make unannounced visits as required",
      "Multi-Site –Clients applying for ‘Multi-Site’ registration on a sampling basis shall ensure that each work location must be performing substantially the same type of business, and the entire range of products or services supplied by each location must be included in the scope of certification. The range of services or  products to be covered by the certification should be of a non-complex nature and OTABU reserves the right to not accept applications that are not appropriate for certification on a sampling basis.  The organization must have one appointed Management Representative with overall responsibility for maintenance of the quality system. The organization must have a defined and controlled Quality Policy such that it is applicable to all sections of the organization that are included in the proposed scope of certification. The quality system must be centrally managed and uniform across all work locations covered by the proposed scope of certification. As a minimum requirement, the following elements of the quality system must be centrally managed: management review, internal quality audits, corrective and preventive action, changes to the quality system documentation, data and structure. All work locations to be included in the scope of certification must be owned by the organization and be an integral part of the organization’s management structure.",
      "Information on incidents such as a serious accident, or a serious breach of regulation necessitating the involvement of the competent regulatory authority, provided by the certified client (see G 8.5.3) or directly gathered by the audit team during the special audit, (G 9.6.4.2) shall provide grounds for the Certification Body to decide on the actions to be taken, including a suspension or withdrawal of the certification, in cases where it can be demonstrated that the system seriously failed to meet the OH&S certification requirements. Such requirements shall be part of the contractual agreements between the CAB and the organization (As per IAF MD 22:2019)",
      "A Client may advertise that its management system has been registered and may apply the relevant registration mark to stationery and publicity materials relating to the scope of registration as provided. The Client may not apply such mark in relation to its products. The Client shall ensure that no confusion arises between registered and non-registered systems, products or sites in its publications and advertising material. The Client shall not make any claim that could mislead third parties to believe that certain systems, products or sites have been registered when they have not",
      "A Client who has been authorized to use a registration mark must also comply with the Regulations governing the use of the mark of OTBAU/Accreditation Board Improper use of a registration mark shall be a serious non-conformance",
      "The Certificate & Registration Mark will remain the property of OTABU, and may only be copied or reproduced for the benefit of a third party if the word “copy” is marked thereon and when needed need to return back or give declaration to not used such mark and certificate in any use of Company related activities or promotion.",
      "Normative Documents: Client is bound to provide each Normative Documents (Indian Standards, BS/EN Standards, IEC Standards, American Standards, ASTM Standards, Client’s Customer Specification, Gost Standards etc.) to the OTABU’s Auditor Team as where applicable due to auditing requirements.",
      "Note: Detail of Use of Mark in Annex D which will come with Certificate & Registration Mark Sample and Registration Mark only  use on basis of instruction of Annex D by Certified Client.",
    ],
  },
  {
    title: "24. UNAVOIDABLE REASONS / FORCE MAJEURE ",
    details: [
      "Neither party shall be liable to the other party for nonperformance or delay in performance of any of its obligations under this contract, due to war, natural disaster, epidemic, go-slow, lockout or any other causes reasonably beyond its control",
    ],
  },
  {
    title: "25. JURISDICTION",
    details: [
      "This agreement is to be governed in all respects by Indian Law and in the event of a dispute the parties agree to submit to the jurisdiction of New Delhi Court.",
    ],
  },
  {
    title: "26. THE DURATION/ CURRENCY OF THIS CONTRACT",
    details: [
      "This agreement shall become effective upon signing and shall continue in full force and effect for a period of three (3) years from the date of certification. This contract can be changed and renewed by agreement between both parties if desired.",
    ],
  },
  {
    title: "27. REMOTE AUDIT for INITIAL, SURVEILLANCE AND RECERTIFICATION",
    details: [
      "Remote audit will perform as per Annex I of OGS Documents (IAF MD4:2018). Client will accept the remote audit and given mutual understanding and concern on this activities. Client will also accept the method of ICT (Information and Communication technology (ie Go-To-Meeting, WebEx, Microsoft Lync, Zoom, Whatsapp, Google Talk etc.) or advise other method to conduct the audit/assessment which faverable of smooth audit. If the client is not given acceptance on use of ICT for audit/assessment, other methods shall be used to fulfil audit/assessment objectives. ",
      "Encouraging and considering the use of web-cams, cameras, etc. when physical evaluation of an event is desired or necessary. Proper security measures should be taken, when applicable, to protect confidential information. ",
      "The assessment should be facilitated in quiet environments whenever possible to avoid interference and background noise (i.e., speakerphones, Bluetooth, Handfree etc.).",
    ],
  },
  {
    title:
      "28. RELEASING OF CERTIFICATE OR CONTINUATION OF CERTIFICATE AFTER REMOTE AUDIT",
    details: [
      "Initial Certificate, Certification Continuation after Recertification or Continuation of Certification after Surveillance will act as per Annex I of OGS Documents (IAF ID3:2011).",
    ],
  },
  {
    title: "29. OPENNESS (IAF MD 9:2017, 4.5.1)",
    details: [
      "In order to increase the confidence from interested parties and specifically regulators that accept or take into consideration ISO 13485:2016 accredited certification for the purpose of their recognitions, to release audit report information to regulators that recognize ISO 13485:2016. ",
    ],
  },
];

const initialValues = {
  client: "",
  other_site: "",
  scope: "",
  other_certification: "",
  client_approval_date: "",
  client_sign: "",
  client_stamp: "",
  client_name_desig: "",
  company_name: "",
  otabu_approval_date: "",
  otabu_sign: "",
  otabu_stamp: "",
  otabu_name_desig: "",
};

const AgreementAndRules = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(true);
  const [formDisabled, setFormDisabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [alertMsg, setAlertMsg] = useState("");
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { state } = useContext(AuthContext);
  const id = pathname.slice(13).slice(0, -20);
  const [initialForm, setInitialForm] = useState(initialValues);

  const getFormDetails = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${state.token}` },
      };
      const res = await axios.get(
        BASE_URL + `/api/client_agreement/get/${id}`,
        config
      );
      console.log(res?.data);
      setInitialForm(res?.data);
      if (state.role !== "Admin Auditor") setFormDisabled(true);
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
    validationSchema: agreementFormSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      console.log(values);
      if (!dirty) {
        console.log("form unchanged");
        return;
      }
      setIsLoading(true);

      const formValues = values;

      try {
        const response = await axios({
          method: "post",
          url: BASE_URL + `/api/client_agreement/create/${id}`,
          data: formValues,
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        });
        setAlertType("success");
        setAlertMsg("Form Submitted Successfully");
        setOpen(true);
        setTimeout(() => {
          state.role === "Client"
            ? navigate("/dashboard/active-certifications?refresh=true")
            : navigate("/dashboard/active-clients?refresh=true");
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
    <div className="rules__container">
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
      <h2 className="rules__head">CERTIFICATION AGREEMENT AND RULES</h2>
      <p>
        Agreement between OTABU Global Services Pvt. Ltd. (herein referred as
        OTABU Global) Registered Address: FLAT NO. 954, BLK-D, PKT-3, BINDAPUR,
        DWARKA, NEW DELHI-110059, INDIA and Client: ……………… having its Registered
        Office & Factory or Other Site ………………. under Scope: ……………… here in after
        called the Organization is interested in obtaining ISO 9001:2015, ISO
        14001:2015, ISO 45001:2018, ISO 22000:2018, ISO 13485:2016, ISO
        37001:2016, ISO 50001:2018, ISO 22301:2019, ISO 20001:2018 Other
        certification____________ of its documented quality systems at its
        premises at (address including sites if any)_________________.
      </p>
      {content.map((rule) => {
        return (
          <>
            <div key={rule.title}>
              <h3 className="rules__title">{rule.title}</h3>
              {rule.details.map((detail, index) => {
                return (
                  <p
                    className="rules__detail"
                    key={detail.slice(0, 10) + index}
                  >
                    {detail}
                  </p>
                );
              })}
            </div>
          </>
        );
      })}
      <p className="right-to-change">
        OTABU GLOBAL reserves the right to change these Certification Agreement
        & Rules without prior notification.
      </p>
      <form onSubmit={handleSubmit} className="agreement">
        <fieldset disabled={formDisabled}>
          <div className="input__container">
            <label htmlFor="client_approval_date">
              Client Approval on Dated :{" "}
            </label>
            <input
              type="date"
              name="client_approval_date"
              id="client_approval_date"
              value={values.client_approval_date}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <div className="input__error-container">
              {errors.client_approval_date && touched.client_approval_date ? (
                <p className="input__error">{errors.client_approval_date}</p>
              ) : null}
            </div>
          </div>

          <div className="input__container">
            <label htmlFor="client_sign">Signature :</label>
            <input
              type="file"
              name="client_sign"
              id="client_sign"
              value={values.sign_otabu}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <div className="input__error-container">
              {errors.client_sign && touched.client_sign ? (
                <p className="input__error">{errors.client_sign}</p>
              ) : null}
            </div>
          </div>

          <div className="input__container">
            <label htmlFor="client_stamp">Company Stamp :</label>
            <input
              type="file"
              name="client_stamp"
              id="client_stamp"
              value={values.sign_otabu}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <div className="input__error-container">
              {errors.client_stamp && touched.client_stamp ? (
                <p className="input__error">{errors.client_stamp}</p>
              ) : null}
            </div>
          </div>

          <div className="input__container">
            <label htmlFor="client_name_desig">Name & Designation: </label>
            <input
              type="text"
              name="client_name_desig"
              id="client_name_desig"
              value={values.client_name_desig}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter Name & Designation"
            />
            <div className="input__error-container">
              {errors.client_name_desig && touched.client_name_desig ? (
                <p className="input__error">{errors.client_name_desig}</p>
              ) : null}
            </div>
          </div>

          <div className="input__container">
            <label htmlFor="company_name">Company Name: </label>
            <input
              type="text"
              name="company_name"
              id="company_name"
              value={values.company_name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter Company Name"
            />
            <div className="input__error-container">
              {errors.company_name && touched.company_name ? (
                <p className="input__error">{errors.company_name}</p>
              ) : null}
            </div>
          </div>
        </fieldset>
        <div className="input__container">
          <button
            className="registration__submit"
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <Spinner size={25} color="white" />
            ) : formDisabled && state.role !== "Client" ? (
              "Update"
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AgreementAndRules;
