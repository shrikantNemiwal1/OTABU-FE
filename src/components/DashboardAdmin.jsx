import React, { useContext, useEffect, useMemo, useState } from "react";
import Table from "./Table";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;

const DashboardAdmin = () => {
  const { state } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const columns = useMemo(() => [
    {
      accessorKey: "client",
      header: "ID",
      enableColumnOrdering: false,
      enableEditing: false, //disable editing on this column
      enableSorting: false,
      size: 80,
      margin: 70,
    },
    {
      accessorKey: "client_name",
      header: "Client Name",
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
      accessorKey: "acceptance_status",
      header: "Status",
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

  const fetchTableData = async () => {
    setIsLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${state.token}` },
      };
      //console.log(state.token);
      const res = await axios.get(
        BASE_URL + "/api/approvals/get_pending_approvals",
        config
      );
      console.log(res);
      setData(res?.data);
    } catch (error) {
      console.log(error?.response?.data?.msg);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTableData();
  }, []);

  return (
    <Table
      data={data ? data : []}
      columns={columns}
      title={"Pending Client list"}
      height={"100vh - 280px - 8.7rem"}
      isLoading={isLoading}
      refetchData={fetchTableData}
    />
  );
};

export default DashboardAdmin;
