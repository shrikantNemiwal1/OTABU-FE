import React, { useContext, useEffect, useMemo, useState } from "react";
import Table from "./Table";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { Snackbar, Alert } from "@mui/material";
import { GetAllActiveClients } from "../api/api";
import { useNavigate } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;

const DashboardAdmin = () => {
  const [open, setOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("success");
  const { state } = useContext(AuthContext);
  const navigate = useNavigate();

  const columns = useMemo(() => [
    {
      accessorKey: "id",
      header: "ID",
      enableColumnOrdering: false,
      enableEditing: false, //disable editing on this column
      enableSorting: false,
      size: 30,
    },
    {
      accessorFn: (row) => `${row.client_name}`,
      header: "Client Name",
      size: 30,
    },
    {
      accessorKey: "status",
      header: "Status",
      size: 30,
    },
    // {
    //   accessorFn: (row) => `${row.client_details.email}`,
    //   header: "Client Email",
    //   size: 30,
    // },
    // {
    //   accessorKey: "lastName",
    //   header: "Last Name",
    //   size: 50,
    //   muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
    //     ...getCommonEditTextFieldProps(cell),
    //   }),
    // },
    // {
    //   accessorKey: "acceptance_status",
    //   header: "Status",
    //   size: 10,
    // },
    // {
    //   accessorKey: "age",
    //   header: "Age",
    //   size: 80,
    //   muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
    //     ...getCommonEditTextFieldProps(cell),
    //     type: "number",
    //   }),
    // },
    // {
    //   accessorKey: "state",
    //   header: "State",
    //   muiTableBodyCellEditTextFieldProps: {
    //     select: true, //change to select for a dropdown
    //     children: states.map((state) => (
    //       <MenuItem key={state} value={state}>
    //         {state}
    //       </MenuItem>
    //     )),
    //   },
    // },
  ]);

  const { data, refetch, isFetching } = GetAllActiveClients(state.token);

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
        title={"Active clients"}
        height={"100vh - 215px - 8rem"}
        isLoading={isFetching}
        refetchData={refetch}
        rowActions={rowActions}
        showActions={true}
      />
    </>
  );
};

export default DashboardAdmin;
