import React, { useContext, useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import SubNavbar from "../components/SubNavbar";
import Table from "../components/Table";
import "./styles/clients.scss";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;

const Clients = () => {
  const { state } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
        BASE_URL + "/api/notifications/get_sent_notifications",
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
    <div className="clients-container">
      <Sidebar />
      <main>
        <Navbar title={"Notifications"} />
        <SubNavbar />
        <Table
          data={data}
          columns={columns}
          isLoading={isLoading}
          title={"Notifications"}
          height={"100vh - 280px - 1rem"}
          refetchData={fetchTableData}
        />
      </main>
    </div>
  );
};

export default Clients;
