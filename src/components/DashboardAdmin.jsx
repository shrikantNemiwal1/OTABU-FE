import { useContext, useMemo, useState } from "react";
import Table from "./Table";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { Snackbar, Alert } from "@mui/material";
import { GetAllPendingClient } from "../api/api";
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
      accessorKey: "basic_app_id",
      header: "Application ID",
      enableColumnOrdering: false,
      enableEditing: false, //disable editing on this column
      enableSorting: false,
      size: 30,
    },
    {
      accessorFn: (row) => `${row.client_details.name}`,
      header: "Client Name",
      size: 30,
    },
    {
      accessorFn: (row) => `${row.client_details.email}`,
      header: "Client Email",
      size: 30,
    },
    // {
    //   accessorKey: "lastName",
    //   header: "Last Name",
    //   size: 50,
    //   muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
    //     ...getCommonEditTextFieldProps(cell),
    //   }),
    // },
    {
      accessorKey: "acceptance_status",
      header: "Status",
      size: 10,
    },
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

  const { data, refetch, isFetching } = GetAllPendingClient(state.token);

  // const fetchTableData = async () => {
  //   setIsLoading(true);
  //   try {
  //     const config = {
  //       headers: { Authorization: `Bearer ${state.token}` },
  //     };
  //     //console.log(state.token);
  //     const res = await axios.get(
  //       BASE_URL + "/api/approvals/get_pending_approvals",
  //       config
  //     );
  //     console.log(res);
  //     setData(res?.data);
  //   } catch (error) {
  //     console.log(error?.response?.data?.msg);
  //   }
  //   setIsLoading(false);
  // };

  const handleAction = async ({ type, row }) => {
    console.log(type, row);
    if (type == "view")
      navigate(`/application/${row.basic_app_id}/new-application`);
    else {
      try {
        const config = {
          headers: { Authorization: `Bearer ${state.token}` },
        };
        //console.log(state.token);
        const res = await axios.put(
          BASE_URL +
            `/api/app_form_approval/update_basic_appform_approval/${row.basic_app_id}`,
          { acceptance_status: type === "accept" ? "1" : "0" },
          config
        );
        console.log(res);
        setAlertMsg(res?.data?.message);
        setAlertType("success");
        setOpen(true);
        refetch();
        // const noti = await axios.post(
        //   BASE_URL + "/api/notifications/send_notification",
        //   {
        //     message: `Application ${type === "accept" ? "accepted" : "rejected"}`,
        //     receiver_email: row.client_details.email,
        //   },
        //   config
        // );
      } catch (error) {
        console.log(error?.response?.data?.msg);
        setAlertMsg(error?.response?.data?.msg);
        setAlertType("error");
        setOpen(true);
      }
    }
  };

  const rowActions = ({ row, table }) => (
    <>
      <button
        onClick={() => handleAction({ type: "view", row: row.original })}
        className="application-action application-action--accept"
      >
        View
      </button>
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
      <Table
        data={data?.data}
        columns={columns}
        title={"Pending Client list"}
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

export default DashboardAdmin;
