import React from "react";
import { useDispatch } from "react-redux";
import {
  removeAddress,
  setNewPrimary,
} from "../../features/users/addressSlice";
import Swal from "sweetalert2";

function MyAddressCard({ address }) {
  const dispatch = useDispatch();

  const deleteHandler = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      dispatch(removeAddress(id));
    }
  };
  const primaryHandler = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Want To Change Your Primary Address",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Change it!",
    });
    if (result.isConfirmed) {
      dispatch(setNewPrimary(id));
    }
  };
  return (
    <div className="block w-full bg-white border border-emerald-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 p-4">
      <h5 className="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">
        {address.isprimary ? "Primary Address" : ""}
      </h5>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        {address.full_name}
      </p>
      <p className="font-normal text-gray-700 dark:text-gray-400 text-xs">
        {address.phone_number}
      </p>
      <p className="font-bold text-gray-700 dark:text-gray-400">
        {address.addres_type}
      </p>
      <div className="flex gap-4">
        <div>
          <p className="font-normal text-gray-700 dark:text-gray-400 text-sm">
            {address.street}, {address.province}, {address.city_name},
          </p>
          <p className="font-normal text-gray-700 dark:text-gray-400 text-sm">
            {" "}
            {address.district}, {address.postal_code}
          </p>
        </div>
      </div>
      <div className="mt-auto">
        {!address.isprimary ? (
          <div className="flex gap-3 ">
            <button
              className="pt-2"
              onClick={() => deleteHandler(address.idaddress)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-8 "
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </button>
            <button
              type="button"
              className="border-2 border-green-300  font-bold  px-4 rounded-md hover:bg-emerald-500 hover:text-white text-emerald-500 mt-3"
              onClick={() => primaryHandler(address.idaddress)}
            >
              Set As Primary
            </button>
          </div>
        ) : (
          <div>
            <button
              className="pt-2"
              onClick={() => deleteHandler(address.idaddress)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyAddressCard;
