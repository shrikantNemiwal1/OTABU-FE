import React, { useCallback, useMemo, useState, useContext } from "react";
import { MaterialReactTable } from "material-react-table";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Modal,
  Snackbar,
  Alert,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { data, states } from "./makeData";
import addIcon from "../assets/icons/add-sign.svg";
import AddAuditorForm from "./AddAuditorForm";
import "./styles/table.scss";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
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

const Table = ({ columns, height, title, data, isLoading, refetchData }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [tableData, setTableData] = useState(() => data);
  const [validationErrors, setValidationErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("success");
  const { state } = useContext(AuthContext);

  const handleCreateNewRow = (values) => {
    tableData.push(values);
    setTableData([...tableData]);
  };

  const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
    if (!Object.keys(validationErrors).length) {
      tableData[row.index] = values;
      //send/receive api updates here, then refetch or update local table data for re-render
      setTableData([...tableData]);
      exitEditingMode(); //required to exit editing mode and close modal
    }
  };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

  const handleDeleteRow = useCallback(
    (row) => {
      if (
        !confirm(`Are you sure you want to delete ${row.getValue("firstName")}`)
      ) {
        return;
      }
      //send api delete request here, then refetch or update local table data for re-render
      tableData.splice(row.index, 1);
      setTableData([...tableData]);
    },
    [tableData]
  );

  const getCommonEditTextFieldProps = useCallback(
    (cell) => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
        onBlur: (event) => {
          const isValid =
            cell.column.id === "email"
              ? validateEmail(event.target.value)
              : cell.column.id === "age"
              ? validateAge(+event.target.value)
              : validateRequired(event.target.value);
          if (!isValid) {
            //set validation error for cell if invalid
            setValidationErrors({
              ...validationErrors,
              [cell.id]: `${cell.column.columnDef.header} is required`,
            });
          } else {
            //remove validation error for cell if valid
            delete validationErrors[cell.id];
            setValidationErrors({
              ...validationErrors,
            });
          }
        },
      };
    },
    [validationErrors]
  );

  const handleAction = async ({ type, row }) => {
    console.log(type, row);
    try {
      const config = {
        headers: { Authorization: `Bearer ${state.token}` },
      };
      //console.log(state.token);
      const res = await axios.put(
        BASE_URL +
          `/api/approvals/update_approval_applicationform/${row.client}`,
        { acceptance_status: type === "accept" ? "1" : "0" },
        config
      );
      console.log(res);
      setAlertMsg(res?.data?.message);
      setAlertType("success");
      setOpen(true);
      refetchData();
    } catch (error) {
      console.log(error?.response?.data?.msg);
      setAlertMsg(error?.response?.data?.msg);
      setAlertType("error");
      setOpen(true);
    }
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
      <div className="table__container">
        <MaterialReactTable
          displayColumnDefOptions={{
            "mrt-row-actions": {
              muiTableHeadCellProps: {
                align: "center",
              },
              size: 120,
            },
          }}
          state={{ isLoading: isLoading }}
          columns={columns}
          data={data}
          muiTableContainerProps={{
            sx: {
              height: `calc(${height})`,
            },
          }}
          //editingMode="modal" //default
          enableColumnOrdering
          //enableEditing
          enableStickyHeader
          // onEditingRowSave={handleSaveRowEdits}
          // onEditingRowCancel={handleCancelRowEdits}
          enableRowActions
          positionActionsColumn="last"
          renderRowActions={({ row, table }) => (
            // <Box sx={{ display: "flex", gap: "1rem" }}>
            //   <Tooltip arrow placement="left" title="Edit">
            //     <IconButton onClick={() => table.setEditingRow(row)}>
            //       <Edit />
            //     </IconButton>
            //   </Tooltip>
            //   <Tooltip arrow placement="right" title="Delete">
            //     <IconButton color="error" onClick={() => handleDeleteRow(row)}>
            //       <Delete />
            //     </IconButton>
            //   </Tooltip>
            // </Box>
            <>
              <button
                onClick={() =>
                  handleAction({ type: "accept", row: row.original })
                }
                className="application-action application-action--accept"
              >
                Accept
              </button>
              <button
                onClick={() =>
                  handleAction({ type: "reject", row: row.original })
                }
                className="application-action application-action--reject"
              >
                Reject
              </button>
            </>
          )}
          renderTopToolbarCustomActions={() => (
            <>
              <h2 className="table-title">
                {title}
                {/* <button className="add-btn" onClick={() => setModalOpen(true)}>
                  <img src={addIcon} alt="plus" />
                  Add Auditor
                </button> */}
              </h2>
            </>
          )}
        />
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
              <div className="modal__title">Title</div>
              <AddAuditorForm />
            </div>
          </Box>
        </Modal>
      </div>
    </>
  );
};

export default Table;
