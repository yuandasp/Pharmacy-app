import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AUTH_TOKEN, ADMIN } from "../../helpers/constant";
import Swal from "sweetalert2";

function PrivateRouteAdmin() {
  const adminId = JSON.parse(localStorage.getItem(ADMIN))?.idadmin;

  if (!localStorage.getItem(AUTH_TOKEN) || !adminId) {
    Swal.fire({
      icon: "warning",
      title: "Please login as admin!",
    });

    return <Navigate to="/admin/login" replace={true} />;
  }

  return <Outlet />;
}

export default PrivateRouteAdmin;
