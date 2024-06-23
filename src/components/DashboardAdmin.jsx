import { useContext, useMemo, useState } from "react";
import Table from "./Table";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { Snackbar, Alert } from "@mui/material";
import { GetAllPendingClient } from "../api/api";
import { useNavigate } from "react-router-dom";
import { Box, Modal } from "@mui/material";
import Spinner from "./Spinner";
const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "calc(50vw + 4rem)",
  minWidth: "400px",
  bgcolor: "background.paper",
  border: "none",
  borderRadius: "1rem",
  boxShadow: 24,
  outline: "none",
  p: 4,
};

const DashboardAdmin = () => {
  const [open, setOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("success");
  const { state } = useContext(AuthContext);
  const [remark, setRemark] = useState("");
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currRow, setCurrRow] = useState(null);

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

  const handleAction = async ({ type, row }) => {
    console.log(type, row);
    if (type == "view")
      navigate(`/application/${row.basic_app_id}/new-application`);
    else {
      try {
        const config = {
          headers: { Authorization: `Bearer ${state.token}` },
        };
        const res = await axios.put(
          BASE_URL +
            `/api/app_form_approval/update_basic_appform_approval/${row.basic_app_id}`,
          { acceptance_status: type === "accept" ? "1" : "0" },
          config
        );
        console.log(res);
        setAlertMsg(res?.data?.message);
        setAlertType("success");
        refetch();
      } catch (error) {
        console.log(error?.response?.data?.msg);
        setAlertMsg(error?.response?.data?.msg);
        setAlertType("error");
      }
    }
  };

  const handleReject = (row) => {
    setCurrRow(row);
    setModalOpen(true);
  };

  const handleSendRemark = async () => {
    setIsLoading(true);
    console.log(currRow);
    try {
      const response = await axios({
        method: "put",
        url:
          BASE_URL +
          `/api/app_form_approval/update_basic_appform_approval/${currRow?.basic_app_id}`,
        data: {
          acceptance_status: "0",
          remarks: remark,
        },
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      });
      setAlertType("success");
      setAlertMsg(response?.data?.message);
      setRemark("");
      refetch();
    } catch (error) {
      setAlertType("error");
      setAlertMsg(error?.response?.data?.msg);
    }
    setOpen(true);
    setModalOpen(false);
    setIsLoading(false);
  };

  const rowActions = ({ row }) => (
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
        onClick={() => handleReject(row.original)}
        className="application-action application-action--reject"
      >
        Reject
      </button>
    </>
  );

  return (
    <>
      <Modal
        open={modalOpen}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="modal">
            <button
              className="modal__close-btn"
              onClick={() => setModalOpen(false)}
            >
              &#9587;
            </button>
            <div className="modal__title">Reject and Send Remark</div>
            <div className="input__container">
              <label htmlFor="remark">Remark :</label>
              <input
                type="text-box"
                name="remark"
                id="remark"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="Enter Remark"
              />
            </div>
          </div>
          <div className="input__container">
            <button
              className="registration__submit ml-0"
              onClick={handleSendRemark}
              disabled={isLoading}
            >
              {isLoading ? <Spinner size={25} color="white" /> : "Send"}
            </button>
          </div>
        </Box>
      </Modal>
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
