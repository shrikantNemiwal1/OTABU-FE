import React, { useContext, useEffect, useMemo, useState } from "react";
import Table from "./Table";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { Snackbar, Alert } from "@mui/material";
import { GetAllActiveAuditors } from "../api/api";
import { useNavigate } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;

const ActiveAuditors = () => {
  const [open, setOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("success");
  const { state } = useContext(AuthContext);
  const navigate = useNavigate();

  const columns = useMemo(() => [
    {
      accessorKey: "id",
      header: "Auditor ID",
      enableColumnOrdering: false,
      enableEditing: false, //disable editing on this column
      enableSorting: false,
      size: 30,
    },
    {
      accessorKey: "auditor_name",
      header: "Auditor name",
      size: 30,
    },
  ],[]);

  const { data, refetch, isFetching } = GetAllActiveAuditors(state.token);

  const handleAction = async ({ type, row }) => {
    navigate(`/application/${row.id}`);
  };

  const rowActions = ({ row, table }) => (
    <>
      <button
        onClick={() => handleAction({ type: "accept", row: row.original })}
        className="application-action"
      >
        View
      </button>
    </>
  );

  return (
    <>
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
      <Table
        data={data?.data}
        columns={columns}
        title={"Active Auditors"}
        height={"100vh - 215px"}
        isLoading={isFetching}
        refetchData={refetch}
        rowActions={rowActions}
        showActions={false}
      />
    </>
  );
};

export default ActiveAuditors;
