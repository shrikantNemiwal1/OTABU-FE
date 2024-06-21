import { useContext, useMemo, useState } from "react";
import Table from "./Table";
import { AuthContext } from "../context/AuthContext";
import { Snackbar, Alert } from "@mui/material";
import { GetAllAppliedCertifications } from "../api/api";
import { useNavigate } from "react-router-dom";

const DashboardAdmin = () => {
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
        header: "Acceptance Status",
        enableColumnOrdering: false,
        enableEditing: false,
        enableSorting: false,
        size: 30,
      },
      {
        accessorFn: (row) => {
          const date = new Date(row.created_at);
          return date.toLocaleDateString();
        },
        header: "Create Date",
        enableColumnOrdering: false,
        enableEditing: false,
        enableSorting: false,
        size: 30,
      },
    ],
    []
  );

  const { data, refetch, isFetching } = GetAllAppliedCertifications(
    state.token
  );

  const handleAction = async ({ type, row }) => {
    navigate(`/application/${row.basic_app_id}/new-application`);
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
        title={"Applied Certifications"}
        height={"100vh - 215px"}
        isLoading={isFetching}
        refetchData={refetch}
        rowActions={rowActions}
        showActions={true}
      />
    </>
  );
};

export default DashboardAdmin;
