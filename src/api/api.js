import { useQuery } from "@tanstack/react-query";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;

const queryConfig = {
  cacheTime: 10 * 60 * 10000,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  staleTime: Infinity,
};

const url = {
  allPendingClient: "/api/app_form_approval/get_pending_approvals",
  allNotifications: "/api/notifications/get_received_notifications",
  allAppliedCertifications:
    "/api/app_form_approval/get_pending_applicationform",
  allActiveClients: "/api/application_form/get_application_details",
  allActiveCertifications:
    "/api/application_form/get_client_application_details",
  allAuditors: "api/assign_auditor/get_auditors_list",
  allAssignedApplications: "api/assign_auditor/get_assigned_applications",
  allPendingAssignedApplications: "/api/get_assigned_pending_applications",
  allActiveAuditors: "/api/select_auditor/get_auditors_list",
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

export function GetAllActiveAuditors(token) {
  const queryKey = "alActiveAuditors";
  const queryFn = () => API("get", url.allActiveAuditors, {}, token);
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

export function GetAllAssignedApplications(token) {
  const queryKey = "allAssignedApplications";
  const queryFn = () => API("get", url.allAssignedApplications, {}, token);
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

export function GetAllPendingAssignedApplications(token) {
  const queryKey = "allPendingAssignedApplications";
  const queryFn = () =>
    API("get", url.allPendingAssignedApplications, {}, token);
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

export function GetAllActiveCertifications(token) {
  const queryKey = "allActiveCertifications";
  const queryFn = () => API("get", url.allActiveCertifications, {}, token);
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

export function GetAllAuditors(token) {
  const queryKey = "allAuditors";
  const queryFn = () => API("get", url.allAuditors, {}, token);
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
