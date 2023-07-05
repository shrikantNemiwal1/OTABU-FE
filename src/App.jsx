import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ClientRegistration from "./pages/ClientRegistration.jsx";
import AuditorRegistration from "./pages/AuditorRegistration.jsx";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import NotFound from "./pages/NotFound";

function App() {
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
          <Route exact path="forgot-password" element={<ForgotPassword />} />
          <Route exact path="dashboard" element={<Dashboard />}>
            <Route path="active-admins" element={<p>active admins</p>} />
            <Route path="active-auditors" element={<p>active auditors</p>} />
            <Route path="active-clients" element={<p>active clients</p>} />
            <Route
              path="completed-clients"
              element={<p>completed clients</p>}
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
