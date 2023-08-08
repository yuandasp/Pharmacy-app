import React from "react";
import Sidebar from "../../components/admin/Sidebar";
import OrderListCard from "../../components/orderlist/OrderListCard";

function Transaction() {
  return (
    <>
      <div className="w-screen h-full flex justify-between bg-slate-50">
        <div className="sidebar-width">
          <Sidebar />
        </div>
        <div className="min-h-screen h-full bg-dashboard-admin p-8 lg:p-28 flex flex-col gap-11 content-width">
          <p className="text-3xl font-bold">Order List</p>
          <div className="bg-white px-6 pb-11 rounded-lg shadow-card-tagline">
            <OrderListCard />
          </div>
        </div>
      </div>
    </>
  );
}

export default Transaction;
