import React, { useState } from "react";

import logo from "../../assets/logo-pharmacy.png";

function PrescriptionImageModal({ image, index }) {
  return (
    <div className="w-full shadow-xl absolute h-full top-0 left-0 bg-opacity-25 backdrop-blur-sm">
      <div className="bg-white border-4 border-gray-600 rounded-xl w-[90%] mx-auto mt-20">
        <div className="p-5">
          <div className="flex md:flex-row-reverse flex-col md:gap-0 gap-4 font-bold justify-between items-center mt-5">
            <img className="md:w-[30%] w-[60%]" src={logo} alt="logo" />
            <div className=" sm:text-4xl text-2xl flex-1 text-center sm:text-left text-green-700">
              Prescription
            </div>
          </div>
          <hr className="my-6" />
          <div>
            <img
              className="w-[100%] mx-auto"
              id="prescription"
              src={`http://localhost:8000/prescription${image}`}
              alt="prescription"
            />
          </div>
          <div className="flex flex-row-reverse mt-10 justify-center">
            <button
              onClick={() => {
                const modal = document.getElementById(index);
                modal.style.display = "none";
              }}
              className="bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
            >
              Ok
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrescriptionImageModal;
