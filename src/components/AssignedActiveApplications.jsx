import { useContext, useMemo, useState } from "react";
import Table from "./Table";
import { AuthContext } from "../context/AuthContext";
import { Snackbar, Alert } from "@mui/material";
import { GetAllAssignedApplications } from "../api/api";
import { useNavigate } from "react-router-dom";

const AssignedActiveApplications = () => {
  const [open, setOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("success");
  const { state } = useContext(AuthContext);
  const navigate = useNavigate();

  const columns = useMemo(() => [
    {
      accessorKey: "application_id",
      header: "Application ID",
      enableColumnOrdering: false,
      enableEditing: false,
      enableSorting: false,
      size: 30,
    },
    {
      accessorKey: "status",
      header: "Status",
      size: 10,
    },
  ]);

  const { data, refetch, isFetching } = GetAllAssignedApplications(state.token);

  const handleAction = async ({ type, row }) => {
    navigate(`/application/${row.application_id}`);
  };

  const rowActions = ({ row }) => (
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
        title={"Assigned Active Applications"}
        height={"100vh - 215px"}
        isLoading={isFetching}
        refetchData={refetch}
        rowActions={rowActions}
        showActions={true}
        selectRow={false}
      />
    </>
  );
};

export default AssignedActiveApplications;
