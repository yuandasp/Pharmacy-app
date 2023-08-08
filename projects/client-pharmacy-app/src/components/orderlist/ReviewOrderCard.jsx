import React, { useEffect, useState } from "react";
import { currency } from "../../helpers/currency";
import { parse, format } from "date-fns";
import { useSelector } from "react-redux";
import ProductCard from "./ProductCard";
import dots_comment from "../../assets/dots_comment.png";
import medicine from "../../assets/medicine.png";
import Swal from "sweetalert2";

import { useDispatch } from "react-redux";
import PaymentImageModal from "./PaymentImageModal";
import {
  acceptPaymentReview,
  confirmPaymentReview,
  rejectPaymentReview,
  userCancelOrder,
} from "../../features/order/orderSlice";

function ReviewOrderCard({
  changePageInfo,
  keyword,
  page,
  limit,
  order,
  dateRange,
}) {
  const dispatch = useDispatch();

  const transactions = useSelector((state) => state.order.transaction);

  const onClickAcceptHandler = async (transaction) => {
    const swalAccept = await Swal.fire({
      title: "Confirmed payment?",
      text: "User payment will be confirmed",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });
    if (swalAccept.isConfirmed) {
      const { pageStatus } = await dispatch(
        acceptPaymentReview(transaction, keyword, page, limit, order, dateRange)
      );
      changePageInfo(pageStatus);
    }
  };

  const onClickConfirmHandler = async (transaction) => {
    const swalAccept = await Swal.fire({
      title: "Process the order?",
      text: "Proceed your order to the next step",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });
    if (swalAccept.isConfirmed) {
      const { pageStatus } = await dispatch(
        confirmPaymentReview(
          transaction,
          keyword,
          page,
          limit,
          order,
          dateRange
        )
      );
      changePageInfo(pageStatus);
    }
  };

  const onClickUserCancelHandler = async (transaction, email) => {
    dispatch(userCancelOrder(transaction, email));
  };

  const onClickRejectHandler = async (transaction) => {
    const swalAccept = await Swal.fire({
      title: "Reject Payment?",
      text: "Order will be rejected",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });
    if (swalAccept.isConfirmed) {
      const { pageStatus } = await dispatch(
        rejectPaymentReview(transaction, keyword, page, limit, order, dateRange)
      );
      changePageInfo(pageStatus);
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
                  {transaction?.review_date
                    ? format(
                        Date.parse(transaction.review_date),
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
                <div className="flex flex-col gap-2">
                  <div className="font-bold text-green-700">
                    Freight Cost : {currency(transaction.freightCost)}
                  </div>
                  <div className="font-bold text-green-700">
                    {" "}
                    Total Cost : {currency(transaction.total)}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex sm:flex-row-reverse flex-col mt-4 justify-between items-center">
              {transaction.status === "PAYMENT CONFIRMED" &&
              localStorage.getItem("user") ? (
                <div className="flex sm:w-[50%] w-full flex-row gap-4">
                  <button
                    onClick={() =>
                      onClickUserCancelHandler(
                        transaction.idtransaction,
                        transaction.email
                      )
                    }
                    className=" w-full p-2 font-bold mx-auto rounded hover:bg-red-800 text-white bg-red-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => onClickConfirmHandler(transaction)}
                    className=" w-full  p-2 font-bold mx-auto rounded hover:bg-green-800 text-white bg-green-600"
                  >
                    Submit
                  </button>
                </div>
              ) : (
                <div className="flex sm:w-[50%] w-full flex-row gap-4">
                  <button
                    hidden={localStorage.getItem("user") ? true : false}
                    onClick={() => onClickRejectHandler(transaction)}
                    className=" w-full p-2 font-bold mx-auto rounded hover:bg-red-800 text-white bg-red-600"
                  >
                    Reject
                  </button>
                  <button
                    hidden={localStorage.getItem("user") ? true : false}
                    onClick={() => onClickAcceptHandler(transaction)}
                    className=" w-full  p-2 font-bold mx-auto rounded hover:bg-green-800 text-white bg-green-600"
                  >
                    Accept
                  </button>
                </div>
              )}
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

export default ReviewOrderCard;
