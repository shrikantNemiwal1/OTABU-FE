import { useContext, useMemo } from "react";
import Table from "./Table";
import { AuthContext } from "../context/AuthContext";
import { GetAllClientPendingApplications } from "../api/api";
import { useNavigate } from "react-router-dom";

const ClientPendingApplications = () => {
  const { state } = useContext(AuthContext);
  const navigate = useNavigate();

  const columns = useMemo(
    () => [
      {
        accessorKey: "basic_app_id",
        header: "Application ID",
        enableColumnOrdering: false,
        enableEditing: false,
        enableSorting: false,
        size: 30,
      },
      {
        accessorKey: "acceptance_status",
        header: "Status",
        size: 10,
      },
    ],
    []
  );

  const { data, refetch, isFetching } = GetAllClientPendingApplications(
    state.token
  );

  const rowActions = ({ row }) => (
    <button
      onClick={() =>
        navigate(`/application/${row?.original?.basic_app_id}/new-application`)
      }
      className="application-action"
    >
      View
    </button>
  );

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("refresh")) setTimeout(() => refetch(), 0);

  return (
    <>
      <Table
        data={data?.data}
        columns={columns}
        title={""}
        height={"100vh - 215px"}
        isLoading={isFetching}
        refetchData={refetch}
        rowActions={rowActions}
        showActions={true}
      />
    </>
  );
};

export default ClientPendingApplications;
