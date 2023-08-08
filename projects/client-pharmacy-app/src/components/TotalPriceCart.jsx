import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { currency } from "../helpers/currency";
import { setTotalPrice } from "../features/cart/cartSlice";
import { removeCheckedProduct } from "../features/cart/cartSlice";
import NewAddressModal from "./NewAddressModal";
import ChangeAddressModal from "./ChangeAddressModal";

function TotalPriceCart() {
  const dispatch = useDispatch();
  const totalPrice = useSelector((state) => state.cart.totalPrice);
  const cartProduct = useSelector((state) => state.cart.cart);
  const addressData = useSelector(
    (state) => state.address.addressList.allAddress
  );
  const userPrimaryAddress = useSelector(
    (state) => state.address.primaryAddress
  );
  const navigate = useNavigate();

  const [total, setTotal] = useState(0);
  //when user doesn't have any address, below is hook to show address modal
  const [isHiddenAddress, setIsHiddenAddress] = useState(false);
  const [isHiddenChangeAddress, setIsHiddenChangeAddress] = useState(false);

  //modalHandler
  const isHiddenAddressHandler = () => {
    setIsHiddenAddress((prev) => !prev);
  };

  const isHiddenChangeAddressHandler = () => {
    setIsHiddenChangeAddress((prev) => !prev);
  };

  //clikhandle for pay, when address not available, show the address component modal on screen
  const payClickHandler = async () => {
    if (addressData.length === 0) {
      setIsHiddenAddress((prev) => !prev);
    } else if (userPrimaryAddress.length === 0) {
      setIsHiddenChangeAddress(true);
    } else {
      setTotal(0);
      await cartProduct.map(async (product, index) => {
        setTotal((prev) => prev + product.price * product.quantity);
      });
      navigate("/order");
    }
  };

  //when the page started, fetch province from rajaongkir
  useEffect(() => {
    cartProduct.map((val, index) => {
      return dispatch(removeCheckedProduct(index));
    });
    // dispatch(getProvince());
  }, []);

  useEffect(() => {
    dispatch(setTotalPrice(total));
  }, [total, dispatch]);

  return (
    <>
      <div className=" w-[100%] rounded-xl shadow-xl">
        <div className="ml-6 font-bold pt-6">Summary</div>
        <div className="flex flex-col justify-between mx-6 mt-4">
          {cartProduct.map((val) => {
            if (val.summary) {
              // if (checkBox.checked) {
              return (
                <div
                  key={val.idproduct}
                  className="flex flex-row justify-between "
                >
                  <div className="col-span-2">{val.name}</div>

                  <div className="text-end whitespace-nowrap">
                    {currency(val.price * val.quantity)}
                  </div>
                </div>
              );
              // }
            }
          })}
        </div>
        <hr className="border-gray-300 my-4" />
        <div className="flex flex-row justify-between mx-6">
          <div>Total Price</div>
          <div>{currency(totalPrice)}</div>
        </div>
        {isHiddenChangeAddress ? (
          <ChangeAddressModal modalHandler={isHiddenChangeAddressHandler} />
        ) : null}
        {isHiddenAddress ? (
          <NewAddressModal modalHandler={isHiddenAddressHandler} />
        ) : (
          <div className="w-full flex items-center my-10">
            <button
              id="payButton"
              disabled={cartProduct.length === 0 ? true : false}
              className=" disabled:bg-gray-300 disabled:hover:shadow-none hover:bg-green-500 hover:shadow-xl w-[80%] mx-auto rounded-md border-none text-white bg-green-700 h-[40px]"
              onClick={payClickHandler}
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default TotalPriceCart;
