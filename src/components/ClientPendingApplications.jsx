import React, { useContext, useEffect, useMemo, useState } from "react";
import Table from "./Table";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { Snackbar, Alert } from "@mui/material";
import { GetAllClientPendingApplications } from "../api/api";
import { useNavigate } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;

const ClientPendingApplications = () => {
  const [open, setOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("success");
  const { state } = useContext(AuthContext);
  const navigate = useNavigate();

  const columns = useMemo(
    () => [
      {
        accessorKey: "basic_app_id",
        header: "Application ID",
        enableColumnOrdering: false,
        enableEditing: false,
        enableSorting: false,
        size: 30,
      },
      {
        accessorKey: "acceptance_status",
        header: "Status",
        size: 10,
      },
    ],
    []
  );

  const { data, refetch, isFetching } = GetAllClientPendingApplications(
    state.token
  );

  const handleAction = async ({ type, row }) => {
    if (type == "fill-form")
      navigate(`/application/${row.id}/application-form`);
    else navigate(`/application/${row.id}`);
  };

  const rowActions = ({ row, table }) => (
    <>
      {row?.original?.status == "Application Form Incomplete" ? (
        <button
          onClick={() => handleAction({ type: "fill-form", row: row.original })}
          className="application-action"
        >
          Fill Application Form
        </button>
      ) : (
        <button
          onClick={() => handleAction({ type: "accept", row: row.original })}
          className="application-action"
        >
          View
        </button>
      )}
    </>
  );

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("refresh")) setTimeout(() => refetch(), 0);

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
        title={""}
        height={"100vh - 215px"}
        isLoading={isFetching}
        refetchData={refetch}
      />
    </>
  );
};

export default ClientPendingApplications;
