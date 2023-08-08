import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import MyAddressCard from "./MyAddressCard";
import { fetchAddresses } from "../../features/users/addressSlice";
import { useDispatch } from "react-redux";

function ManageAddressModal() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [offset, setOffset] = useState(0);
  const addresses = useSelector(
    (state) => state.address.addressList.allAddress
  );
  const countAddress = useSelector(
    (state) => state.address.addressList.counData?.[0].count
  );
  const pages = parseInt(countAddress);

  const renderCard = () => {
    return addresses.map((address) => {
      return <MyAddressCard address={address} />;
    });
  };

  const nextData = () => {
    let nextOffset = offset + 2;
    setOffset(nextOffset);
  };
  const prevData = () => {
    let prevOffset = offset - 2;
    setOffset(prevOffset);
  };
  useEffect(() => {
    dispatch(fetchAddresses(offset));
  }, [offset]);
  return (
    <div>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="border-2 border-green-300 font-bold py-2 px-4 rounded-md hover:bg-emerald-500 hover:text-white text-emerald-500"
        >
          Manage
        </button>
      ) : (
        <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
          <div className="bg-white py-3 lg:px-14 px-2 rounded-xl gap-2 flex flex-col shadow-lg w-96 lg:w-[32rem] max-h-screen mx-4">
            <div className="relative flex justify-between items-end">
              <h5 className="text-xl lg:text-3xl pb-3 font-medium text-gray-900 dark:text-white">
                My Address
              </h5>
              <button
                onClick={() => setOpen(false)}
                className="absolute top-0 right-0"
              >
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex flex-col gap-3">{renderCard()}</div>
            <div className="flex flex-row mx-auto my-3">
              {offset == 0 ? (
                <></>
              ) : (
                <button
                  type="button"
                  className="bg-emerald-600 text-white rounded-l-md border-r border-gray-100 py-2 hover:bg-red-700 hover:text-white px-3"
                  onClick={() => prevData()}
                >
                  <div className="flex flex-row align-middle">
                    <svg
                      className="w-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <p className="ml-2">Prev</p>
                  </div>
                </button>
              )}
              {offset + 3 >= pages ? (
                <></>
              ) : (
                <button
                  type="button"
                  className="bg-emerald-600 text-white rounded-r-md py-2 border-l border-gray-200 hover:bg-red-700 hover:text-white px-3"
                  onClick={() => nextData()}
                >
                  <div className="flex flex-row align-middle">
                    <span className="mr-2">Next</span>
                    <svg
                      className="w-5 ml-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageAddressModal;
