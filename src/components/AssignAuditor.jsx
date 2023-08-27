import React, { useContext, useEffect, useMemo, useState } from "react";
import Table from "./Table";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { Snackbar, Alert } from "@mui/material";
import { GetAllAuditors } from "../api/api";
import { useLocation } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;

const AssignAuditor = () => {
  const [open, setOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [rowSelection, setRowSelection] = useState({});
  const [isAuditorAssigned, setIsAuditorAssigned] = useState(false);
  const { state } = useContext(AuthContext);
  const { pathname } = useLocation();
  const id = pathname.slice(13).slice(0, -15);
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
      accessorKey: "auditor_name",
      header: "Auditor Name",
      size: 30,
    },
  ]);

  const getAssignedAuditor = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${state.token}` },
      };
      const res = await axios.get(
        BASE_URL + `/api/select_auditor/get_assigned_auditor/${id}`,
        config
      );
      console.log(res?.data);
      setRowSelection(res?.data ? { [res?.data?.id]: true } : {});
      setIsAuditorAssigned(true);
    } catch (error) {
      console.log(error?.response?.data?.msg);
    }
  };

  useEffect(() => {
    getAssignedAuditor();
  }, []);

  const { data, refetch, isFetching } = GetAllAuditors(state.token);

  const handleAssignAuditor = async (row) => {
    const rowId = Object.keys(row)[0];
    if (rowId === undefined) {
      setAlertMsg("Select an auditor");
      setAlertType("warning");
      setOpen(true);
    } else {
      try {
        const config = {
          headers: { Authorization: `Bearer ${state.token}` },
        };
        const res = isAuditorAssigned
          ? await axios.put(
              BASE_URL +
                `/api/select_auditor/update_assigned_auditor/${rowId}/${id}`,
              {},
              config
            )
          : await axios.post(
              BASE_URL + `/api/select_auditor/select_auditor/${rowId}/${id}`,
              {},
              config
            );
        setIsAuditorAssigned(true);
        setAlertMsg(res?.data?.msg);
        setAlertType("success");
        setOpen(true);
        refetch();
      } catch (error) {
        console.log(error);
        console.log(error?.response?.data?.msg);
        setAlertMsg(error?.response?.data?.msg);
        setAlertType("error");
        setOpen(true);
      }
    }
  };

  const handleAction = async ({ type, row }) => {
    console.log(type, row);
    try {
      const config = {
        headers: { Authorization: `Bearer ${state.token}` },
      };
      //console.log(state.token);
      const res = await axios.put(
        BASE_URL + `/api/approvals/update_approval_applicationform/${row.id}`,
        { acceptance_status: type === "accept" ? "1" : "0" },
        config
      );
      console.log(res);
      setAlertMsg(res?.data?.message);
      setAlertType("success");
      setOpen(true);
      refetch();
      const noti = await axios.post(
        BASE_URL + "/api/notifications/send_notification",
        {
          message: `Application ${type === "accept" ? "accepted" : "rejected"}`,
          receiver_email: row.client_details.email,
        },
        config
      );
    } catch (error) {
      console.log(error?.response?.data?.msg);
      setAlertMsg(error?.response?.data?.msg);
      setAlertType("error");
      setOpen(true);
    }
  };

  const rowActions = ({ row, table }) => (
    <>
      <button
        onClick={() => handleAction({ type: "accept", row: row.original })}
        className="application-action application-action--accept"
      >
        Accept
      </button>
      <button
        onClick={() => handleAction({ type: "reject", row: row.original })}
        className="application-action application-action--reject"
      >
        Reject
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
      <div>
        <h2 className="form-sub-title">Assign Auditor</h2>
      </div>
      <Table
        data={data?.data}
        columns={columns}
        title={"Auditors"}
        height={"100vh - 205px"}
        isLoading={isFetching}
        refetchData={handleAssignAuditor}
        toolName={"Assign"}
        rowActions={rowActions}
        selectRow={true}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
      />
    </>
  );
};

export default AssignAuditor;
