import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { convertPrescription } from "../../../features/product/prescriptionSlice";
import { useNavigate } from "react-router-dom";

function ConversionModal({
  product,
  order,
  filter,
  search,
  offset,
  open,
  setOpen,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(0);

  const saveHandler = (quantity) => {
    let retail_quantity = product.retail_remain
      ? quantity * product.quantity + product.retail_remain
      : quantity * product.quantity;
    let stock = product.stock - quantity;
    let productQuantity = quantity * product.quantity;
    dispatch(
      convertPrescription(
        product.idproduct,
        order,
        filter,
        search,
        offset,
        retail_quantity,
        quantity,
        stock,
        product.unit_product,
        product.unitname,
        productQuantity
      )
    );
    setOpen(false);
  };

  return (
    <div>
      {!open ? (
        <button
          className="border-2 border-green-300 font-bold h-10 px-2 rounded-md hover:bg-emerald-500 hover:text-white text-emerald-500"
          onClick={() => setOpen(true)}
        >
          Convert Unit
        </button>
      ) : (
        <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
          <div className="bg-white py-3 lg:px-14 px-2 rounded-xl gap-3 flex flex-col shadow-lg w-96 lg:w-[40rem]">
            <h1 className="font-bold lg:text-4xl text-emerald-700">{`Convert: ${product.name}`}</h1>

            {product.stock !== 0 ? (
              <div className="flex gap-2 border-2 p-2 rounded-md items-center justify-center border-emerald-600">
                <input
                  type="text"
                  className="border-b-2 w-24 border-slate-500"
                  placeholder="quantity"
                  onChange={(e) => setQuantity(e.target.value)}
                />
                <p>{product.unit_product}</p>
                <p>=</p>
                <p>{`${quantity * product.quantity} ${product.unitname}`}</p>
              </div>
            ) : (
              <div className="mb-4 rounded-lg bg-red-100 px-6 py-5 text-base text-danger-700">
                <p>
                  Stock is Unavailable, Please Check Product Page For Details
                </p>
                <a
                  href=""
                  onClick={() => navigate("/admin/products")}
                  className="font-bold text-danger-700"
                >
                  Product Page
                </a>
              </div>
            )}

            {product.stock !== 0 && (
              <div className="flex items-center justify-center gap-5">
                <button
                  onClick={() => saveHandler(quantity)}
                  className="border-2 border-emerald-500 font-bold py-2 px-4 rounded-md hover:bg-emerald-500 hover:text-white text-emerald-500"
                >
                  SAVE
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="border-2 border-emerald-500 font-bold py-2 px-4 rounded-md hover:bg-emerald-500 hover:text-white text-emerald-500"
                >
                  CANCEL
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ConversionModal;
