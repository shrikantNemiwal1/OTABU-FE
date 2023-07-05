export const SET_ERROR = "SET_ERROR";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";

export const authReducer = (state, action) => {
  switch (action.type) {
    case SET_ERROR:
      return { ...state, error: action.payload };

    case LOGIN_SUCCESS:
      //console.log(action.payload);
      localStorage.setItem("token", action.payload.access_token);
      localStorage.setItem("refresh-token", action.payload.refresh_token);
      localStorage.setItem("otabu-audit-email", action.payload.email);
      localStorage.setItem("otabu-audit-role", action.payload.role);
      // localStorage.setItem("otabu-audit-name", action.payload.name);
      // localStorage.setItem("otabu-audit-mobile", action.payload.mobile);
      // localStorage.setItem("otabu-audit-exp", action.payload.tokenExpTime);
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload.access_token,
        refreshToken: action.payload.refresh_token,
        email: action.payload.email,
        role: action.payload.role,
        // name: action.payload.name,
        // mobile: action.payload.mobile,
        // tokenExpTime: action.payload.tokenExpTime,
      };

    case LOGOUT_SUCCESS:
      console.log(`logout trigger`);
      localStorage.setItem("token", "");
      localStorage.setItem("refresh-token", "");
      localStorage.setItem("otabu-audit-email", "");
      localStorage.setItem("otabu-audit-role", "");
      //localStorage.setItem("otabu-audit-mobile", "");
      //localStorage.setItem("otabu-audit-name", "");
      //localStorage.setItem("otabu-audit-exp", "");
      return {
        ...state,
        isAuthenticated: false,
        token: null,
        refreshToken: null,
        email: null,
        role: null,
        // name: null,
        // mobile: null,
      };

    default:
      return state;
  }
};
