import React, { useEffect, useState } from "react";

//import assets
import newAddress from "../assets/new_address.svg";
import medicine from "../assets/medicine.svg";

//import component
import NewAddressModal from "./NewAddressModal";

//take cart globalstate
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

//import helper
import { currency } from "../helpers/currency";
import ChangeAddressModal from "./ChangeAddressModal";
import {
  fetchAddresses,
  fetchPrimaryAddress,
} from "../features/users/addressSlice";

function PrescriptionAddress() {
  const dispatch = useDispatch();
  //control if user want to add new address
  const [isHidden, setIsHidden] = useState(false);
  const [isAddressModalHidden, setAddressModalHidden] = useState(false);

  const newAddressModalHandler = () => {
    setIsHidden((prev) => !prev);
  };

  const changeAddressModalHandler = () => {
    setAddressModalHidden((prev) => !prev);
  };

  const userData = useSelector((state) => state.user.user);
  const userAddresses = useSelector(
    (state) => state.address.addressList.allAddress
  );
  // return state.address.primaryAddress[0] || userAddresses[0];
  const userPrimaryAddress =
    useSelector((state) => state.address.primaryAddress[0]) || {};

  useEffect(() => {
    dispatch(fetchAddresses(0));
    dispatch(fetchPrimaryAddress());
  }, []);

  return (
    <div>
      <div className="shadow-xl rounded-xl relative">
        <div className="text-2xl font-roboto font-bold px-6 pt-8">
          Customer Address
        </div>
        <hr className="mt-4" />
        <div className="flex sm:flex-row flex-col px-6 pt-4 sm:items-center justify-between">
          <div className="font-bold whitespace-nowrap">
            {userData.fullname || userData.username}
            <span>, {userData.phone_number}</span>
          </div>
          <button
            onClick={changeAddressModalHandler}
            className="cursor-pointer sm:relative sm:bottom-0 absolute bottom-20 font-bold text-green-600"
          >
            Change Address
          </button>
        </div>
        <div className="w-[90%] ml-6 py-4 border-b-black sm:pb-4 pb-9">
          <div>
            {userData.fullname || userData.username}
            <span>{`'s ${userPrimaryAddress?.address_type}`}</span>
          </div>
          <div>{userPrimaryAddress.street}</div>
          <div>
            <span>
              {userPrimaryAddress.district
                ? `${userPrimaryAddress.district}, `
                : null}
            </span>
            <span>
              {userPrimaryAddress.city_name
                ? `${userPrimaryAddress.city_name}, `
                : null}
            </span>
            <span>{null || `${userPrimaryAddress.province}, `}</span>
            <span>{null || userPrimaryAddress.postal_code}</span>
          </div>
        </div>
        <hr />
        <button
          onClick={newAddressModalHandler}
          className="flex flex-row gap-4 py-4 ml-6 items-center"
        >
          <img src={newAddress} alt="plus" className="w-[40px] h-[40px]" />
          <div className="font-bold tracking-wide">Add New Address</div>
        </button>
      </div>
      {isHidden ? (
        <NewAddressModal modalHandler={newAddressModalHandler} />
      ) : null}
      {isAddressModalHidden ? (
        <ChangeAddressModal modalHandler={changeAddressModalHandler} />
      ) : null}
    </div>
  );
}

export default PrescriptionAddress;
