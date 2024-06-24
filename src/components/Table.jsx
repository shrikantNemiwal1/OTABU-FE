import React, { useState } from "react";
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
import addIcon from "../assets/icons/add-sign.svg";
import AddAuditorForm from "./AddAuditorForm";
import "./styles/table.scss";

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

const Table = ({
  columns,
  height,
  title,
  data,
  isLoading,
  refetchData,
  rowActions,
  showActions,
  toolName,
  selectRow,
  rowSelection,
  setRowSelection,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
      <div className="table__container">
        <MaterialReactTable
          // displayColumnDefOptions={{
          //   "mrt-row-actions": {
          //     muiTableHeadCellProps: {
          //       align: "center",
          //     },
          //     size: 120,
          //   },
          // }}
          columns={columns}
          data={data || []}
          muiTableContainerProps={{
            sx: {
              height: `calc(${height})`,
            },
          }}
          enableMultiRowSelection={false}
          enableRowSelection={selectRow}
          getRowId={(row) => row.id}
          muiTableBodyRowProps={({ row }) => ({
            onClick: row.getToggleSelectedHandler(),
            sx: { cursor: "pointer" },
          })}
          onRowSelectionChange={setRowSelection}
          state={
            selectRow
              ? {
                  rowSelection,
                  isLoading: isLoading,
                }
              : { isLoading }
          }
          initialState={{ density: "compact" }}
          positionToolbarAlertBanner="bottom"
          enableColumnOrdering
          enableStickyHeader
          enableRowActions={showActions}
          positionActionsColumn="last"
          renderRowActions={({ row, table }) => rowActions({ row, table })}
          // renderRowActions={({ row, table }) => (
          //   <>
          //     <Box sx={{ display: "flex", gap: "1rem" }}>
          //       <Tooltip arrow placement="left" title="Edit">
          //         <IconButton onClick={() => table.setEditingRow(row)}>
          //           <Edit />
          //         </IconButton>
          //       </Tooltip>
          //       <Tooltip arrow placement="right" title="Delete">
          //         <IconButton
          //           color="error"
          //           onClick={() => handleDeleteRow(row)}
          //         >
          //           <Delete />
          //         </IconButton>
          //       </Tooltip>
          //     </Box>

          //     <button
          //       onClick={() =>
          //         handleAction({ type: "accept", row: row.original })
          //       }
          //       className="application-action application-action--accept"
          //     >
          //       Accept
          //     </button>
          //     <button
          //       onClick={() =>
          //         handleAction({ type: "reject", row: row.original })
          //       }
          //       className="application-action application-action--reject"
          //     >
          //       Reject
          //     </button>
          //   </>
          //)}
          renderTopToolbarCustomActions={() => (
            <>
              <button
                className="add-btn"
                onClick={() => refetchData(rowSelection)}
              >
                {toolName ? toolName : "Refresh"}
              </button>
              {/* <h2 className="table-title">
                {title}
              </h2> */}
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
