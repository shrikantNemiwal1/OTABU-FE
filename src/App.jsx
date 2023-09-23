import { useContext, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ClientRegistration from "./pages/ClientRegistration.jsx";
import AuditorRegistration from "./pages/AuditorRegistration.jsx";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import NotFound from "./pages/NotFound";
import Notifications from "./pages/Notifications";
import Application from "./pages/Application";
import DashboardClient from "./components/DashboardClient";
import DashboardAdmin from "./components/DashboardAdmin";
import DashboardAuditor from "./components/DashboardAuditor";
import ActiveClients from "./components/ActiveClients";
import AppliedCertifications from "./components/AppliedCertifications";
import ActiveCertifications from "./components/ActiveCertifications";
import ApplicationInfo from "./components/ApplicationInfo";
import ApplicationForm from "./components/ApplicationForm";
import ApplicationReviewForm from "./components/ApplicationReviewForm";
import QuotationForm from "./components/QuotationForm";
import TokenExpirationTime from "./context/TokenExpirationTime";
import AgreementAndRules from "./components/AgreementAndRules";
import AuditProgramForm from "./components/AuditProgramForm";
import AuditPlanStage1Form from "./components/AuditPlanStage1Form";
import AssignAuditor from "./components/AssignAuditor";
import AuditReportStage1Form from "./components/AuditReportStage1Form";
import IntimationLetter from "./components/IntimationLetter";
import CorrectiveActionReport from "./components/CorrectiveActionReport";

function App() {
  const { state, dispatch } = useContext(AuthContext);

  useEffect(() => {
    TokenExpirationTime({ state, dispatch });
  }, [state]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Navigate to="login/client" replace={true} />}
          />
          <Route
            path="/login"
            element={<Navigate to="/login/client" replace={true} />}
          />
          <Route exact path="login/client" element={<Login />} />
          <Route exact path="login/auditor" element={<Login />} />
          <Route
            path="/signup"
            element={<Navigate to="/signup/client" replace={true} />}
          />
          <Route exact path="signup/client" element={<ClientRegistration />} />
          <Route
            exact
            path="signup/auditor"
            element={<AuditorRegistration />}
          />
          <Route exact path="notifications" element={<Notifications />} />
          <Route exact path="application/:id" element={<Application />}>
            <Route path="" element={<ApplicationInfo />} />
            <Route path="application-form" element={<ApplicationForm />} />
            <Route
              path="application-review-form"
              element={<ApplicationReviewForm />}
            />
            <Route path="quotation-form" element={<QuotationForm />} />
            <Route path="agreement-and-rules" element={<AgreementAndRules />} />
            <Route path="audit-program" element={<AuditProgramForm />} />
            <Route path="intimation-letter-1" element={<IntimationLetter />} />
            <Route path="intimation-letter-2" element={<IntimationLetter />} />
            <Route path="assign-auditor" element={<AssignAuditor />} />
            <Route
              path="audit-plan-stage-1"
              element={<AuditPlanStage1Form />}
            />
            <Route
              path="audit-report-stage-1"
              element={<AuditReportStage1Form />}
            />
            <Route
              path="corrective-action-report"
              element={<CorrectiveActionReport />}
            />
          </Route>

          <Route exact path="forgot-password" element={<ForgotPassword />} />
          <Route exact path="dashboard" element={<Dashboard />}>
            <Route
              path=""
              element={
                state.role === "Admin Auditor" ? (
                  <DashboardAdmin />
                ) : state.role === "Auditor" ? (
                  <DashboardAuditor />
                ) : (
                  <DashboardClient />
                )
              }
            />
            <Route path="active-admins" element={<p>active admins</p>} />
            <Route path="active-auditors" element={<p>active auditors</p>} />
            <Route path="active-clients" element={<ActiveClients />} />
            <Route
              path="completed-clients"
              element={<p>completed clients</p>}
            />
            <Route
              path="applied-certifications"
              element={<AppliedCertifications />}
            />
            <Route
              path="active-certifications"
              element={<ActiveCertifications />}
            />
            <Route
              path="completed-certifications"
              element={<p>completed certifications</p>}
            />
          </Route>
          <Route exact path="clients/:id" element={<Clients />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
