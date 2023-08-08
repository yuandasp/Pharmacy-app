import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { resetServices } from "../../features/rajaongkir/rajaongkirSlice";

function Courier({
  onClickCourierHandler,
  onServicesClickHandler,
  resetFreightPrice,
}) {
  const dispatch = useDispatch();

  //Monitoring in case user change the address or update a new one
  const userAddresses = useSelector(
    (state) => state.address.addressList.allAddress
  );
  const userPrimaryAddress = useSelector(
    (state) => state.address.primaryAddress[0]
  );

  useEffect(() => {
    document.getElementById("courier").selectedIndex = 0;
    resetFreightPrice();
    dispatch(resetServices());
  }, [userPrimaryAddress]);

  //list of all services available for selected courier fetched from RajaOngkir
  const services = useSelector((state) => state.rajaongkir.services);
  return (
    <div className="flex flex-col justify-start gap-2">
      <label htmlFor="courier">Courier and Services</label>
      <div className="flex md:flex-row gap-2">
        <select
          onChange={onClickCourierHandler}
          name="courier"
          id="courier"
          className="border bg-white w-[50%] border-gray-500 text-sm rounded-lg p-2 focus:border-green-500"
        >
          <option key={1} value="">
            Choose Courier
          </option>
          <option key={2} value="JNE">
            JNE
          </option>
          <option key={3} value="TIKI">
            TIKI
          </option>
        </select>
        <select
          onChange={(e) => onServicesClickHandler(e.target.value)}
          name="courier"
          id="courier"
          className="border bg-white w-[50%] border-gray-500 text-sm rounded-lg p-2 focus:border-green-500"
        >
          <option key={"default"} value="">
            Choose Service
          </option>
          {services.map((val, index) => {
            return (
              <option
                key={index}
                value={JSON.stringify(val)}
              >{`${val.service} ${val.description}`}</option>
            );
          })}
        </select>
      </div>
    </div>
  );
}

export default Courier;
