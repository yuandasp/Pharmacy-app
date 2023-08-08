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
import { setBonusItem } from "../features/cart/cartSlice";

function OrderProductCart() {
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

  const myCart = useSelector((state) => state.cart.cart);
  const userData = useSelector((state) => state.user.user);
  const userAddresses = useSelector(
    (state) => state.address.addressList.allAddress || []
  );
  // return state.address.primaryAddress[0] || userAddresses[0];
  const userPrimaryAddress = useSelector(
    (state) => state.address.primaryAddress[0] || []
  );
  const bonusItem = (item) => {
    const totalQuantity = item.quantity + item.discount;
    const bonus = {
      id: item.idproduct,
      quantity: item.quantity,
    };
    dispatch(setBonusItem(bonus));
    return totalQuantity;
  };

  useEffect(() => {
    dispatch(fetchAddresses(0));
    dispatch(fetchPrimaryAddress());
  }, []);

  return (
    <>
      {myCart.length !== 0 ? (
        <div>
          <div className="shadow-xl rounded-xl relative">
            <div className="text-2xl font-roboto font-bold px-6 pt-8">
              Customer Address
            </div>
            <hr className="mt-4" />
            <div className="flex sm:flex-row flex-col px-6 pt-4 sm:items-center justify-between">
              <div className=" font-bold whitespace-nowrap">
                {userData.fullname || userData.username}
                <span>, {userData.phone_number}</span>
              </div>
              <button
                onClick={changeAddressModalHandler}
                className="cursor-pointer sm:relative sm:bottom-0 absolute bottom-20  font-bold text-green-600"
              >
                Change Address
              </button>
            </div>
            <div className=" w-[90%] ml-6 py-4 border-b-black sm:pb-4 pb-9">
              <div>
                {userData.fullname || userData.username}
                <span>{`'s ${userPrimaryAddress.address_type}`}</span>
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
          <div className="shadow-xl rounded-xl mt-10">
            {myCart.map((item, index) => {
              return (
                <div
                  key={item.idproduct}
                  className=" w-[100%] h-[200px] py-4 border-b-black pl-4"
                >
                  <div className="flex flex-row relative h-full">
                    <div className="flex">
                      <div className="flex items-center mb-4 pl-3">
                        <label
                          htmlFor="default-checkbox"
                          className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        ></label>
                      </div>
                      <img
                        src={
                          item.product_image
                            ? `${process.env.REACT_APP_API_BE}/uploads/${item.product_image}`
                            : "./assets/icon-medicine.png"
                        }
                        className=" object-contain w-[200px] h-full"
                        alt="product"
                      />
                    </div>
                    <div className="flex sm:flex-row sm:gap-4 ml-10 flex-col w-full mt-10 mb-3 justify-between">
                      <div className="flex sm:flex-row flex-col justify-between gap-4 w-full ml-4">
                        <div>
                          <p>{item.name}</p>
                          <p className="text-xs">1 {item.unit}</p>
                          <p className=" ">
                            {item.type === "Bonus Item" &&
                            item.quantity >= item.discount
                              ? `Bonus Item ${item.discount} `
                              : ""}
                          </p>
                        </div>
                        <p className="font-bold whitespace-nowrap">
                          {currency(item.price)}
                        </p>
                      </div>
                      <div className="flex flex-row mx-4 items-center">
                        <div className=" sm:absolute w-[80px] h-[25px] sm:bottom-4 sm:right-[125px] rounded-tl-sm rounded-bl-sm hover:bg-green-500">
                          Quantity :
                        </div>
                        <span className="sm:absolute sm:bottom-4 sm:right-[75px] text-center w-[50px] h-[25px]">
                          {item.type === "Bonus Item" &&
                          item.quantity >= item.discount
                            ? `${item.quantity} = ${bonusItem(item)} `
                            : item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {isHidden ? (
            <NewAddressModal modalHandler={newAddressModalHandler} />
          ) : null}
          {isAddressModalHidden ? (
            <ChangeAddressModal modalHandler={changeAddressModalHandler} />
          ) : null}
        </div>
      ) : (
        <>
          <div className="text-center md:py-10 py-20">
            <div className="text-2xl font-bold">Please select a product</div>
          </div>
        </>
      )}
    </>
  );
}

export default OrderProductCart;
