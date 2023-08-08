import React from "react";

import { useSelector } from "react-redux";

//import assets
import medicine from "../assets/medicine.png";

function ProductCard() {
  const myCart = useSelector((state) => state.cart.cart);

  //   const dispatch = useDispatch();
  //   const myCartLength = myCart.length;

  //   useEffect(() => {
  //     dispatch(getRelatedProduct(myCart));
  //   }, [myCartLength]);

  return (
    <div className=" bg-white border-none shadow-allxl ">
      <img
        className="w-[150px] h-[150px] mx-auto"
        src={
          `${process.env.REACT_APP_API_BE}/uploads/${myCart.product_image}` ||
          medicine
        }
        alt="medicine"
      />
      <div className="px-4">
        <a href="#">
          <h5 className="mt-4 text-md font-roboto tracking-tight">
            Product Name
          </h5>
        </a>
        <div className="flex flex-row gap-2">
          <p>17%</p>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
            Price <span>/ Pack</span>
          </p>
        </div>
        <div className="max-w-ful flex flex-row justify-center my-6">
          <button className="items-center w-[70%] h-8 text-sm text-green-700 font-medium font-roboto rounded-md hover:bg-green-700 hover:text-white border-2 border-green-600 tracking-widest">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
