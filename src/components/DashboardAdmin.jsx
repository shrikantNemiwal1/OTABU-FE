import React, { useMemo } from "react";
import Table from "./Table";

const DashboardAdmin = () => {
  const columns = useMemo(() => [
    {
      accessorKey: "id",
      header: "ID",
      enableColumnOrdering: false,
      enableEditing: false, //disable editing on this column
      enableSorting: false,
      size: 80,
    },
    {
      accessorKey: "firstName",
      header: "First Name",
      size: 50,
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
      accessorKey: "email",
      header: "Email",
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
  return (
    <Table
      columns={columns}
      title={"Pending Client list"}
      height={"100vh - 280px - 8.7rem"}
    />
  );
};

export default DashboardAdmin;
