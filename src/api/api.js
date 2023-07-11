import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;

const queryConfig = {
  cacheTime: 10 * 60 * 10000,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  staleTime: Infinity,
};

const url = {
  allPendingClient: "/api/approvals/get_pending_approvals",
  allNotifications: "/api/notifications/get_received_notifications",
  allAppliedCertifications: "/api/approvals/get_active_approvals",
  allActiveClients: "/api/application_form/get_application_details",
};

export function API(method, endpoint, payload, token) {
  const encrypted = "" || token;
  return axios({
    method: method.toLowerCase(),
    url: `${BASE_URL}/${
      endpoint.startsWith("/") ? endpoint.slice(1) : endpoint
    }`,
    data: payload,
    headers: {
      Authorization: `Bearer ${encrypted}`,
    },
  });
}

export function GetAllPendingClient(token) {
  const queryKey = "allPendingClient";
  const queryFn = () => API("get", url.allPendingClient, {}, token);
  const { refetch, ...queryResult } = useQuery(
    [queryKey],
    queryFn,
    queryConfig
  );
  return {
    refetch: () => {
      refetch();
    },
    ...queryResult,
  };
}

export function GetAllNotifications(token) {
  const queryKey = "allNotifications";
  const queryFn = () => API("get", url.allNotifications, {}, token);
  const { refetch, ...queryResult } = useQuery(
    [queryKey],
    queryFn,
    queryConfig
  );
  return {
    refetch: () => {
      refetch();
    },
    ...queryResult,
  };
}

export function GetAllAppliedCertifications(token) {
  const queryKey = "alAppliedCertifications";
  const queryFn = () => API("get", url.allAppliedCertifications, {}, token);
  const { refetch, ...queryResult } = useQuery(
    [queryKey],
    queryFn,
    queryConfig
  );
  return {
    refetch: () => {
      refetch();
    },
    ...queryResult,
  };
}

export function GetAllActiveClients(token) {
  const queryKey = "alActiveClients";
  const queryFn = () => API("get", url.allActiveClients, {}, token);
  const { refetch, ...queryResult } = useQuery(
    [queryKey],
    queryFn,
    queryConfig
  );
  return {
    refetch: () => {
      refetch();
    },
    ...queryResult,
  };
}
