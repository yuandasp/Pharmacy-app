import React, { useEffect, useState } from "react";
import { currency } from "../../helpers/currency";
import { parse, format } from "date-fns";
import { useSelector } from "react-redux";
import ProductCard from "./ProductCard";
import dots_comment from "../../assets/dots_comment.png";

function FinishedOrderCard() {
  const transactions = useSelector((state) => state.order.transaction);

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
                  {transaction?.finished_date
                    ? format(
                        Date.parse(transaction.finished_date),
                        "EEEE, dd-MMMM-yyyy, HH:mm:ss"
                      )
                    : null}
                </div>
                <div className="rounded bg-yellow-400 border-2 font-bold text-yellow-900 border-yellow-700 p-2">
                  {transaction.status}
                </div>
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
            <div className="flex sm:flex-row items-center mt-4 flex-col w-[100%] justify-end sm:gap-20 mt-2">
              <div className="flex flex-row gap-4 items-center">
                <div className="font-bold text-green-700">Sub Total: </div>
                <div className="font-bold text-green-700">
                  {currency(transaction.total)}
                </div>
              </div>
            </div>
            <div className="flex sm:flex-row-reverse flex-col mt-4 justify-between items-center">
              <div className="flex flex-row mt-4 items-center hover:cursor-pointer gap-5 md:justify-start">
                <img className="w-[30px]" src={dots_comment} alt="dots" />
                <div className="font-bold text-green-600">
                  Are you confused?
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

export default FinishedOrderCard;
