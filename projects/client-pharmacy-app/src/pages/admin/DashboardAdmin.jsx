import React from "react";
import Sidebar from "../../components/admin/Sidebar";

function DashboardAdmin() {
  return (
    <>
      <div className="w-screen h-full flex justify-between bg-slate-50">
        <div className="sidebar-width">
          <Sidebar />
        </div>
        <div className="min-h-screen h-full bg-dashboard-admin p-8 lg:p-28 flex flex-col gap-11 content-width">
          <p className="text-xl sm:text-4xl">Welcome to Dashboard Admin of</p>
          <p className="text-xl sm:text-4xl text-color-green font-bold">
            Pharmacy Web App
          </p>
          <img src="../assets/admin-picture.svg" width="70%" alt="" />
        </div>
      </div>
    </>
  );
}

export default DashboardAdmin;
