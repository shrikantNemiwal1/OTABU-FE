import { useContext, useMemo, useState } from "react";
import Table from "./Table";
import { AuthContext } from "../context/AuthContext";
import { Snackbar, Alert } from "@mui/material";
import { GetAllPendingAssignedApplications } from "../api/api";
import { Box, Modal } from "@mui/material";
import axios from "axios";
import Spinner from "./Spinner";
const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;

const AssignedPendingApplications = () => {
  const [open, setOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("success");
  const { state } = useContext(AuthContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState();
  const [currentId, setCurrentId] = useState();
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

  const columns = useMemo(
    () => [
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
    ],
    []
  );

  const { data, refetch, isFetching } = GetAllPendingAssignedApplications(
    state.token
  );

  const rowActions = ({ row }) => (
    <>
      <button
        onClick={() => {
          setCurrentId(row.original.application_id);
          console.log(row);
          setModalOpen(true);
        }}
        className="application-action"
      >
        Accept
      </button>
    </>
  );

  const acceptApplication = async () => {
    setIsLoading(true);
    const config = {
      headers: { Authorization: `Bearer ${state.token}` },
    };
    try {
      const res = await axios.post(
        BASE_URL + `/api/select_auditor/send_acceptance/${currentId}`,
        { signature: file?.name },
        config
      );
      console.log(res);
      setModalOpen(false);
      setAlertType("success");
      setAlertMsg("Accepted Successfully");
      setOpen(true);
      refetch();
    } catch (error) {
      console.log(error);
      setAlertType("error");
      setAlertMsg("Error");
      setOpen(true);
    }
    setIsLoading(false);
  };

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
      <Modal
        open={modalOpen}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="modal">
            <button
              className="modal__close-btn"
              onClick={() => {
                setModalOpen(false);
                setCurrentId(null);
              }}
            >
              &#9587;
            </button>
            <div className="modal__title">Accept</div>
            <label htmlFor="signature">Your Signature :</label>
            <div className="input__container m-2">
              <input
                type="file"
                name="remark"
                id="signature"
                placeholder="Enter Remark"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <div className="input__error-container">
                <p className="input__error">
                  {file ? "" : "Please select a file"}
                </p>
              </div>
            </div>
          </div>
          <div className="input__container">
            <button
              className="registration__submit ml-0"
              type="submit"
              disabled={!file}
              onClick={acceptApplication}
            >
              {isLoading ? <Spinner size={25} color="white" /> : "Send"}
            </button>
          </div>
        </Box>
      </Modal>
      <Table
        data={data?.data}
        columns={columns}
        title={"Assigned Pending Applications"}
        height={"100vh - 215px - 8rem"}
        isLoading={isFetching}
        refetchData={refetch}
        rowActions={rowActions}
        showActions={true}
        selectRow={false}
      />
    </>
  );
};

export default AssignedPendingApplications;
