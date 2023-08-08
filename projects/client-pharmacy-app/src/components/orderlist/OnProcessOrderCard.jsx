import React, { useEffect, useState } from "react";
import { currency } from "../../helpers/currency";
import { parse, format } from "date-fns";
import { useSelector } from "react-redux";
import ProductCard from "./ProductCard";
import dots_comment from "../../assets/dots_comment.png";
import Swal from "sweetalert2";

import { useDispatch } from "react-redux";
import PaymentImageModal from "./PaymentImageModal";
import {
  acceptOnProcessOrder,
  acceptPaymentReview,
  adminCancelOrder,
  confirmPaymentReview,
  rejectPaymentReview,
} from "../../features/order/orderSlice";

function OnProcessOrderCard({
  changePageInfo,
  keyword,
  page,
  limit,
  order,
  dateRange,
}) {
  const dispatch = useDispatch();

  const transactions = useSelector((state) => state.order.transaction);

  const onClickSubmitHandler = async (transaction) => {
    const swalAccept = await Swal.fire({
      title: "Send Order?",
      text: "order will be sent to user",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });
    if (swalAccept.isConfirmed) {
      const { pageStatus } = await dispatch(
        acceptOnProcessOrder(
          transaction,
          keyword,
          page,
          limit,
          order,
          dateRange
        )
      );
      // const { pageStatus } = await dispatch(acceptPaymentReview(transaction));
      changePageInfo(pageStatus);
    }
  };
  const cancelHandler = async (transaction) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Reject it!",
      showLoaderOnConfirm: true,
    });
    if (result.isConfirmed) {
      dispatch(adminCancelOrder(transaction.idtransaction, transaction.email));
    }
  };

  return (
    <>
      {transactions.map((transaction, transactionIndex) => {
        return (
          <div
            key={transactionIndex}
            className="w-full rounded even:bg-green-50 odd:bg-gray-50 shadow-xl px-6 pb-4 pt-1 mb-10"
          >
            <div className="flex flex-col my-4 justify-between items-center md:flex-row gap-4">
              <div className="font-bold text-center text-green-700">
                Transaction ID : {transaction.idtransaction}
              </div>
              <div
                hidden={localStorage.getItem("admin") ? false : true}
                className="font-bold text-center text-green-700"
              >
                Name : {transaction.full_name || transaction.username}
              </div>
            </div>
            <div className="flex md:flex-col flex-col-reverse">
              <div className="flex items-center sm:flex-row sm:gap-0 gap-4 flex-col justify-between mb-4">
                <div>
                  {transaction?.onprocess_date
                    ? format(
                        Date.parse(transaction.onprocess_date),
                        "EEEE, dd-MMMM-yyyy, HH:mm:ss"
                      )
                    : null}
                </div>
                <div className="rounded bg-yellow-400 border-2 font-bold text-yellow-900 border-yellow-700 p-2">
                  {transaction.status}
                </div>
              </div>
              <div className="font-bold text-green-700 sm:mb-2 my-4">
                Address : {transaction.full_name || transaction.username}'s{" "}
                {transaction.address_type}, {transaction.street}, ,{" "}
                {transaction.city_name}, {transaction.province},{" "}
                {transaction.postal_code}
              </div>
              <hr className="my-2" />
              {transactions[transactionIndex].orderProduct.map(
                (product, index) => {
                  return <ProductCard key={index} product={product} />;
                }
              )}
              <hr className="mt-4" />
            </div>
            <hr />
            <div className="flex sm:flex-row items-center mt-4 flex-col w-[100%] justify-between sm:gap-20 mt-2">
              <div className="item-center">
                Payment image:{" "}
                <span
                  onClick={(e) => {
                    const modal = document.getElementById(transactionIndex);
                    modal.style.display = "block";
                  }}
                  className="font-bold hover:underline text-green-500 hover:text-green-700 cursor-pointer"
                >
                  Click here
                </span>
              </div>
              <div className="flex flex-row gap-4 items-center">
                <div className="font-bold text-green-700">Sub Total: </div>
                <div className="font-bold text-green-700">
                  {currency(transaction.total)}
                </div>
              </div>
            </div>
            <div className="flex sm:flex-row-reverse flex-col mt-4 justify-between items-center">
              <div className="flex sm:w-[50%] w-full flex-row gap-4">
                <button
                  hidden={localStorage.getItem("user") ? true : false}
                  onClick={() => cancelHandler(transaction)}
                  className=" w-full  p-2 font-bold mx-auto rounded hover:bg-red-800 text-white bg-red-600"
                >
                  Cancel
                </button>
                <button
                  hidden={localStorage.getItem("user") ? true : false}
                  onClick={() => onClickSubmitHandler(transaction)}
                  className=" w-full  p-2 font-bold mx-auto rounded hover:bg-green-800 text-white bg-green-600"
                >
                  Submit
                </button>
              </div>
              <div className="flex flex-row mt-4 items-center hover:cursor-pointer gap-5 md:justify-start">
                <img className="w-[30px]" src={dots_comment} alt="dots" />
                <div className="font-bold text-green-600">
                  Are you confused?
                </div>
              </div>
            </div>
            {localStorage.getItem("admin") ? (
              <div
                className="relative -top-[650px]"
                id={transactionIndex}
                style={{ display: "none" }}
              >
                <PaymentImageModal
                  index={transactionIndex}
                  image={transaction.payment_image}
                />
              </div>
            ) : (
              <div style={{ display: "none" }} id={transactionIndex}>
                <PaymentImageModal
                  index={transactionIndex}
                  image={transaction.payment_image}
                />
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

export default OnProcessOrderCard;
