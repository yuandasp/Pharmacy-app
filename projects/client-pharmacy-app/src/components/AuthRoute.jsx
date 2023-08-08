import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AUTH_TOKEN, USER } from "../helpers/constant";

function AuthRoute() {
  const userId = JSON.parse(localStorage.getItem(USER))?.iduser;

  if (localStorage.getItem(AUTH_TOKEN) && userId) {
    return <Navigate to="/" replace={true} />;
  }
  return <Outlet />;
}

export default AuthRoute;
