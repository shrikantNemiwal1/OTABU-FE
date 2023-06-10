import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ClientRegistration from "./pages/ClientRegistration.jsx";
import AuditorRegistration from "./pages/AuditorRegistration.jsx";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<SignUp />} />
          <Route exact path="/signup/client" element={<ClientRegistration />} />
          <Route
            exact
            path="/signup/auditor"
            element={<AuditorRegistration />}
          />
          {/* <Route exact path="/forgot-password" element={<ForgotPassword />} /> */}
          <Route exact path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
