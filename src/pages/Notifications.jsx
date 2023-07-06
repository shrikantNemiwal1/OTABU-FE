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
      accessorKey: "id",
      header: "ID",
      enableColumnOrdering: false,
      enableEditing: false, //disable editing on this column
      enableSorting: false,
      size: 80,
      margin: 70,
    },
    {
      accessorKey: "message",
      header: "Message",
    },
  ]);

  const fetchTableData = async () => {
    setIsLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${state.token}` },
      };
      //console.log(state.token);
      const res = await axios.get(
        BASE_URL + "/api/notifications/get_received_notifications",
        config
      );
      console.log(res);
      setData(res?.data);
    } catch (error) {
      console.log(error?.response?.data?.msg);
    }
    setIsLoading(false);
  };

  const handleAction = async ({ type, row }) => {
    console.log(type, row);
    if (type === "read") {
      try {
        const config = {
          headers: { Authorization: `Bearer ${state.token}` },
        };
        //console.log(state.token);
        const res = await axios.post(
          BASE_URL +
            `/api/notifications/${
              type === "read" ? "mark_read_notification" : "delete_notification"
            }/${row.id}`,
          config
        );
        console.log(res);
        fetchTableData();
      } catch (error) {
        console.log(error?.response?.data?.msg);
      }
    } else {
      try {
        const config = {
          headers: { Authorization: `Bearer ${state.token}` },
        };
        //console.log(state.token);
        const res = await axios.delete(
          BASE_URL +
            `/api/notifications/${
              type === "read" ? "mark_read_notification" : "delete_notification"
            }/${row.id}`,
          config
        );
        fetchTableData();
        console.log(res);
      } catch (error) {
        console.log(error?.response?.data?.msg);
      }
    }
    // try {
    //   //console.log(state.token);
    //   const res = await axios({
    //     method: type === "read" ? "put" : "delete",
    //     url:
    //       BASE_URL +
    //       `/api/notifications/${
    //         type === "read" ? "mark_read_notification" : "delete_notification"
    //       }/${row.id}`,
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   });
    //   console.log(res);
    //   //   setAlertMsg(res?.data?.message);
    //   //   setAlertType("success");
    //   //   setOpen(true);
    //   fetchTableData();
    // } catch (error) {
    //   console.log(error?.response?.data?.msg);
    //   //   setAlertMsg(error?.response?.data?.msg);
    //   //   setAlertType("error");
    //   //   setOpen(true);
    // }
  };

  const rowActions = ({ row, table }) => (
    <>
      <button
        onClick={() => handleAction({ type: "read", row: row.original })}
        className="application-action application-action--accept"
      >
        Mark as read
      </button>
      <button
        onClick={() => handleAction({ type: "delete", row: row.original })}
        className="application-action application-action--reject"
      >
        Delete
      </button>
    </>
  );

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
          handleAction={handleAction}
          rowActions={rowActions}
        />
      </main>
    </div>
  );
};

export default Clients;
