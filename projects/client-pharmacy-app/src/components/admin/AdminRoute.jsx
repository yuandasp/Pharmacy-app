import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { USER } from "../../helpers/constant";
import Swal from "sweetalert2";

function AdminRoute() {
  const userId = JSON.parse(localStorage.getItem(USER))?.iduser;

  if (userId) {
    Swal.fire({
      icon: "warning",
      title: "Access denied!",
    });
    return <Navigate to="/" replace={true} />;
  }
  return <Outlet />;
}

export default AdminRoute;
