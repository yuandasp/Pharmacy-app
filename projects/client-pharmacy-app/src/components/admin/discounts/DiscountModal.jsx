import React, { useState } from "react";
import { useDispatch } from "react-redux";
import DiscountTypeCard from "./DiscountTypeCard";
import AmountCard from "./AmountCard";
import { createDiscount } from "../../../features/promo/promoSlice";

function DiscountModal() {
  const [open, setOpen] = useState(false);
  const [discountType, setDiscountType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [percentage, setPercentage] = useState(0);
  const [minimum, setMinimum] = useState(0);
  const [minimumItem, setMinimumItem] = useState(0);
  const [bonusItem, setBonusItem] = useState(0);
  const dispatch = useDispatch();

  const handleDiscountTypeChange = (event) => {
    setDiscountType(event.target.value);
  };
  const saveHandler = () => {
    const discount = {
      title: title,
      description: description,
      percentage: percentage ? percentage : bonusItem,
      minimumTransaction: minimum ? minimum : minimumItem,
      type: discountType,
    };
    dispatch(createDiscount(discount));
    resetAllState();
  };
  const resetAllState = () => {
    setOpen(false);
    setDescription("");
    setMinimum(0);
    setPercentage(0);
    setDescription("");
    setDiscountType("");
  };

  return (
    <div>
      {!open ? (
        <button
          className="bg-green-600 text-white font-bold h-full lg:h-10 py-2 px-2 rounded-md hover:bg-emerald-500 hover:text-white"
          onClick={() => setOpen(true)}
        >
          Create Discount
        </button>
      ) : (
        <div className="fixed inset-conversion-modal bg-gray-200 bg-opacity-25 backdrop-blur-sm flex justify-center items-center z-10">
          <div className="bg-gray-100 py-3 lg:px-14 px-2 rounded-xl gap-3 flex flex-col shadow-lg w-4/5 lg:w-[40rem]">
            <h1 className="font-bold lg:text-4xl text-center text-emerald-700">
              Discount Info's
            </h1>

            <div className="flex flex-col gap-3">
              <DiscountTypeCard
                discountType={discountType}
                handleDiscountTypeChange={handleDiscountTypeChange}
                setTitle={setTitle}
                setDescription={setDescription}
              />
              {discountType && (
                <AmountCard
                  discountType={discountType}
                  setPercentage={setPercentage}
                  setMinimum={setMinimum}
                  setMinimumItem={setMinimumItem}
                  setBonusItem={setBonusItem}
                />
              )}{" "}
              {/* Render AmountCard only if discountType is truthy */}
            </div>

            <div className="flex items-center justify-center gap-2 lg:gap-5">
              <button
                type="submit"
                className="border-2 border-emerald-500 font-bold py-2 px-4 rounded-md hover:bg-emerald-500 hover:text-white text-emerald-500"
                onClick={() => saveHandler()}
              >
                SAVE
              </button>
              <button
                onClick={() => resetAllState()}
                className="border-2 border-emerald-500 font-bold py-2 px-4 rounded-md hover:bg-emerald-500 hover:text-white text-emerald-500"
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

export default DiscountModal;
