import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  createConversionRules,
  setConversionRules,
} from "../../../features/cart/productsSlice";
import Swal from "sweetalert2";

function ConvertUnitModal() {
  const dispatch = useDispatch();
  const [unit, setUnit] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [unitDefault, setUnitDefault] = useState("");
  const [open, setOpen] = useState(false);

  const saveProductRules = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to Create New Rules",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, create it!",
    });
    if (result.isConfirmed) {
      dispatch(createConversionRules(unit, quantity, unitDefault, setOpen));
    }
  };
  return (
    <div>
      {!open ? (
        <button
          className=" bg-green-600 text-white font-bold h-full lg:h-10 py-2 px-2 rounded-md hover:bg-emerald-500 hover:text-white"
          onClick={() => setOpen(true)}
        >
          Create Conversion Rules
        </button>
      ) : (
        <div className="fixed inset-conversion-modal bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center z-10">
          <div className=" bg-white py-3 lg:px-14 px-2 rounded-xl gap-3 flex flex-col shadow-lg w-4/5 lg:w-[40rem]">
            <h1 className="font-bold lg:text-4xl text-center text-emerald-700">
              Conversion Rule
            </h1>

            <div className="flex flex-wrap lg:flex-nowrap  gap-2 border-2 p-2 rounded-md items-center justify-center border-emerald-600">
              <p>1</p>
              <input
                type="text"
                className="border-b-2 w-24 border-slate-500"
                placeholder="unit"
                onChange={(e) => setUnitDefault(e.target.value)}
              />
              <p>=</p>
              <input
                type="text"
                className="border-b-2 w-24 border-slate-500"
                placeholder="quantity"
                onChange={(e) => setQuantity(e.target.value)}
              />
              <input
                type="text"
                className="border-b-2 w-24 border-slate-500"
                placeholder="unit"
                onChange={(e) => setUnit(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-center gap-2 lg:gap-5">
              <button
                onClick={() => saveProductRules()}
                className="border-2 border-emerald-500  font-bold py-2 px-4 rounded-md hover:bg-emerald-500 hover:text-white text-emerald-500"
              >
                SAVE
              </button>
              <button
                onClick={() => setOpen(false)}
                className="border-2 border-emerald-500  font-bold py-2 px-4 rounded-md hover:bg-emerald-500 hover:text-white text-emerald-500"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ConvertUnitModal;
