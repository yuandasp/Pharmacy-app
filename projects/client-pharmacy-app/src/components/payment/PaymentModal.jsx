import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import defaultImage from "../../assets/default_img.png";
import logo from "../../assets/logo-pharmacy.png";
import { paymentProof } from "../../features/order/orderSlice";

function PaymentModal({
  modalHandler,
  transaction,
  changePageInfo,
  keyword,
  page,
  limit,
  order,
  dateRange,
}) {
  const dispatch = useDispatch();
  const selectedTransaction = useSelector(
    (state) => state.order.selectedTransaction
  );
  const [imagePreview, setImagePreview] = useState("");
  const [file, setFile] = useState();
  const [isAccept, setIsAccept] = useState(false);

  const onImageUploadHandler = (e) => {
    const fileDetail = e.target.files[0];
    const fileFormat = fileDetail.type.split("/")[1];

    if (fileDetail.size > 1024 * 1024) {
      setIsAccept(false);
    } else if (
      fileFormat === "jpeg" ||
      fileFormat === "png" ||
      fileFormat === "jpg"
    ) {
      setIsAccept(true);
      setFile(fileDetail);
    } else {
      setIsAccept(false);
    }

    setImagePreview(URL.createObjectURL(e.target.files[0]));
    URL.revokeObjectURL(imagePreview);
  };

  const onClickSubmitHandler = async () => {
    const formData = new FormData();
    formData.append("file", file);
    const pageInfo = await dispatch(
      paymentProof(
        formData,
        selectedTransaction,
        modalHandler,
        keyword,
        page,
        limit,
        order,
        dateRange
      )
    );
    changePageInfo(pageInfo);
  };

  return (
    <div className="w-full h-full absolute top-0 left-0 bg-opacity-25 backdrop-blur-sm">
      <div className="bg-white border-4 border-gray-600 rounded-xl sm:w-[50%] w-[90%] mx-auto mt-20">
        <div className="p-5">
          <div className="flex md:flex-row-reverse flex-col md:gap-0 gap-4 font-bold justify-between items-center mt-5">
            <img className="md:w-[30%] w-[60%]" src={logo} alt="logo" />
            <div className="xl:text-2xl text-xl flex-1 text-green-700">
              Upload Your Payment
            </div>
          </div>
          <hr className="my-6" />
          <div>
            <img
              className="w-[80%] mx-auto"
              id="prescription"
              src={`${imagePreview || defaultImage}`}
              alt="prescription"
            />
          </div>
          {!isAccept ? (
            <div className="mt-7 text-red-600 text-center">
              *File must be in .jpeg or .png and size must not bigger than 1MB
            </div>
          ) : null}
          <div>
            <input
              className="mt-7 bg-red-100 w-[100%]"
              onChange={onImageUploadHandler}
              type="file"
              id="userPrescription"
              name="file"
            />
          </div>
          <div className="flex flex-row-reverse mt-10 justify-between">
            <button
              onClick={onClickSubmitHandler}
              disabled={!isAccept}
              className="bg-transparent disabled:bg-gray-200 disabled:text-gray-600 disabled:border-gray-200 hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded"
              type="submit"
            >
              Submit
            </button>
            <button
              className="bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
              onClick={() => {
                URL.revokeObjectURL(imagePreview);
                modalHandler();
              }}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentModal;
