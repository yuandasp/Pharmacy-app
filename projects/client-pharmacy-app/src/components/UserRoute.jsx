import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { ADMIN } from "../helpers/constant";
import Swal from "sweetalert2";

function UserRoute() {
  const adminId = JSON.parse(localStorage.getItem(ADMIN))?.idadmin;

  if (adminId) {
    Swal.fire({
      icon: "warning",
      title: "Access denied!",
    });
    return <Navigate to="/admin/dashboard" replace={true} />;
  }
  return <Outlet />;
}

export default UserRoute;
