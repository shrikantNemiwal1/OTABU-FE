import React, { useContext, useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Table from "../components/Table";
import "./styles/clients.scss";
import { AuthContext } from "../context/AuthContext";
import { GetAllNotifications } from "../api/api";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;

const Clients = () => {
  const { state } = useContext(AuthContext);
  const navigate = useNavigate();

  const columns = useMemo(() => [
    {
      accessorKey: "id",
      header: "Application ID",
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

  const { data, refetch, isFetching } = GetAllNotifications(state.token);

  const handleAction = async ({ type, row }) => {
    console.log(type, row);
    if (type === "read") {
      try {
        const config = {
          headers: { Authorization: `Bearer ${state.token}` },
        };
        //console.log(state.token);
        const res = await axios.put(
          BASE_URL +
            `/api/notifications/${
              type === "read" ? "mark_read_notification" : "delete_notification"
            }/${row.id}`,
          config
        );
        console.log(res);
        refetch();
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
        refetch();
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
    if (state?.isAuthenticated === false) {
      return navigate("/login", { replace: true });
    }
  }, [state]);

  return (
    <div className="clients-container">
      <Sidebar />
      <main>
        <Navbar title={"Notifications"} />
        {/* <SubNavbar /> */}
        <Table
          data={data?.data.reverse()}
          columns={columns}
          isLoading={isFetching}
          title={"Notifications"}
          height={"100vh - 215px"}
          refetchData={refetch}
          handleAction={handleAction}
          rowActions={rowActions}
          showActions={true}
        />
      </main>
    </div>
  );
};

export default Clients;
