import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

//importing component for Cart page in here
import OrderProductCart from "../components/OrderProductCart";
import OrderTotalPriceCart from "../components/OrderTotalPriceCart";
import NewAddressModal from "../components/NewAddressModal";

function Order() {
  const myCart = useSelector((state) => state.cart.cart);

  return (
    <div>
      <div className="mt-10 ml-7 font-bold font-roboto leading-2 text-xl tracking-wide"></div>
      <div className="flex md:flex-row flex-col mb-20">
        <div className="flex flex-col md:w-[50%] justify-center mx-8 md:ml-8 gap-0 mt-5 rounded-xl">
          <OrderProductCart />
        </div>
        <div className="mt-5 md:pr-4 md:w-[50%] flex flex-col items-center">
          <OrderTotalPriceCart />
        </div>
      </div>
    </div>
  );
}

export default Order;
