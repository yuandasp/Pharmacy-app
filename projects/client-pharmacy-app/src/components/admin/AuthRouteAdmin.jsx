import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AUTH_TOKEN, ADMIN } from "../../helpers/constant";

function AuthRouteAdmin() {
  const adminId = JSON.parse(localStorage.getItem(ADMIN))?.idadmin;

  if (localStorage.getItem(AUTH_TOKEN) && adminId) {
    return <Navigate to="/admin/dashboard" replace={true} />;
  }
  return <Outlet />;
}

export default AuthRouteAdmin;
