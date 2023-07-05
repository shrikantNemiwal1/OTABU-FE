import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Restricted = ({ to, children }) => {
  const { state } = useContext(AuthContext);
  if (to === state.role) return <>{children}</>;
  else return null;
};

export default Restricted;
