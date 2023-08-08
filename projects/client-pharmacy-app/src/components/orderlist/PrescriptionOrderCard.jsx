import React, { useState } from "react";
import { parse, format } from "date-fns";
import { useSelector } from "react-redux";
import dots_comment from "../../assets/dots_comment.png";
import PaymentModal from "../payment/PaymentModal";
import { setSelectedTransaction } from "../../features/order/orderSlice";
import PrescriptionImageModal from "./PrescriptionImageModal";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  prescriptionCart,
  prescriptionTotalPrice,
} from "../../features/cart/cartSlice";
import {
  rejectPresciption,
  setPrescriptionCheckOut,
} from "../../features/product/prescriptionSlice";
import Swal from "sweetalert2";

function PrescriptionOrderCard() {
  //function to close the modal
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const prescriptions = useSelector((state) => state.order.prescriptions);

  const onClickAcceptHandler = (prescription) => {
    navigate(`/admin/prescription/${prescription.idprescription}`);
  };

  const onClickRejectHandler = async (prescription) => {
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
      dispatch(
        rejectPresciption(
          prescription.idprescription,
        )
      );
    }
  };
  const checkoutHandler = (prescriptions) => {
    dispatch(setPrescriptionCheckOut(prescriptions));
    navigate("/prescription/checkout");
  };

  return (
    <>
      {prescriptions.map((prescription, prescriptionIndex) => {
        return (
          <div
            key={prescription.idprescription}
            className="w-full rounded even:bg-green-50 odd:bg-gray-50 shadow-xl px-4 lg:px-6 pb-4 pt-1 mb-10"
          >
            <div className="flex flex-col my-4 justify-between items-center md:flex-row gap-4">
              <div className="font-bold text-center text-green-700 text-sm md:text-base">
                Transaction ID : {prescription.idprescription}
              </div>
              <div
                hidden={localStorage.getItem("admin") ? false : true}
                className="font-bold text-center text-green-700 text-sm md:text-base"
              >
                Name : {prescription.full_name || prescription.username}
              </div>
            </div>
            <div className="flex md:flex-col flex-col-reverse">
              <div className="flex items-center sm:flex-row sm:gap-0 gap-4 flex-col justify-between mb-4 text-slate-600 text-sm md:text-base">
                <div>
                  {prescription?.date
                    ? format(
                        Date.parse(prescription.date),
                        "EEEE, dd-MMMM-yyyy, HH:mm:ss"
                      )
                    : null}
                </div>
                <div className="rounded bg-yellow-400 border-2 text-xs lg:text-base font-bold text-yellow-900 border-yellow-700 p-2">
                  {prescription.status}
                </div>
              </div>
              <div className="my-4 text-center sm:text-left">
                See Prescription :{" "}
                <span
                  onClick={(e) => {
                    const modal = document.getElementById(prescriptionIndex);
                    modal.style.display = "block";
                  }}
                  className="font-bold text-green-600 cursor-pointer hover:text-green-700"
                >
                  Click Here
                </span>
              </div>
              <hr className="mt-2" />
            </div>
            <div className="flex flex-row w-[100%] sm:justify-end justify-between sm:gap-20"></div>
            <div className="flex sm:flex-row-reverse flex-col mt-4 justify-between items-center">
              <div className="flex sm:w-[50%] w-full flex-row flex-wrap sm:flex-nowrap gap-2 lg:gap-4">
                <button
                  hidden={localStorage.getItem("user") ? true : false}
                  onClick={() => onClickRejectHandler(prescription)}
                  className=" w-full p-2 font-bold mx-auto rounded hover:bg-red-800 text-white text-sm lg:text-base bg-red-600"
                >
                  Reject
                </button>
                <button
                  hidden={localStorage.getItem("user") ? false : true}
                  onClick={() => onClickRejectHandler(prescription)}
                  className=" w-full p-2 font-bold mx-auto rounded hover:bg-red-800 text-white bg-red-600"
                >
                  Cancel
                </button>
                {prescription.status !== "WAITING TO CHECKOUT" ? (
                  <button
                    hidden={localStorage.getItem("user") ? true : false}
                    onClick={() => onClickAcceptHandler(prescription)}
                    className=" w-full  p-2 font-bold mx-auto rounded hover:bg-green-800 text-white text-sm lg:text-base bg-green-600"
                  >
                    Accept
                  </button>
                ) : (
                  <button
                    hidden={localStorage.getItem("user") ? false : true}
                    onClick={() => checkoutHandler(prescription)}
                    className=" w-full  p-2 font-bold mx-auto rounded hover:bg-green-800 text-white bg-green-600"
                  >
                    Checkout
                  </button>
                )}
              </div>
              <div className="flex flex-row mt-4 items-center hover:cursor-pointer gap-2 lg:gap-5 justify-between">
                <img
                  className="w-5 lg:w-[30px]"
                  src={dots_comment}
                  alt="dots"
                />
                <div className="font-bold text-green-600 text-sm lg:text-base text-center">
                  Are you confused?
                </div>
              </div>
            </div>
            {localStorage.getItem("admin") ? (
              <div
                className="relative -top-[400px] w-full h-full"
                style={{ display: "none" }}
                id={prescriptionIndex}
              >
                <PrescriptionImageModal
                  index={prescriptionIndex}
                  image={prescription.prescription_image}
                />
              </div>
            ) : (
              <div style={{ display: "none" }} id={prescriptionIndex}>
                <PrescriptionImageModal
                  index={prescriptionIndex}
                  image={prescription.prescription_image}
                />
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

export default PrescriptionOrderCard;
