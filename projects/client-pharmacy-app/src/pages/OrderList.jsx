import React, { useState, useEffect } from "react";
import OrderListCard from "../components/orderlist/OrderListCard";
import ProfileOrderCard from "../components/orderlist/ProfileOrderCard";

function OrderList() {
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    setIsOrderOpen(true);
  }, []);

  return (
    <div className="w-full my-20">
      <div className="flex md:flex-row flex-col justify-between mx-10 gap-10">
        <div className="flex-grow">
          {isOrderOpen ? <OrderListCard /> : null}
          {isProfileOpen ? <ProfileOrderCard /> : null}
        </div>
      </div>
    </div>
  );
}

export default OrderList;
