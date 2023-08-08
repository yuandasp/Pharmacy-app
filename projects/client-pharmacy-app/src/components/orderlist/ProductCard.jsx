import React, { useEffect, useState } from "react";
import medicine from "../../assets/medicine.png";
import { currency } from "../../helpers/currency";

function ProductCard({ product }) {
  const calculateDiscountedPrice = (price, discount) => {
    return price - (price * discount) / 100;
  };
  const prescriptionPic = `${process.env.REACT_APP_API_PIC}/prescription/${product.prescription_image}`;

  return (
    <div className="md:flex-row flex flex-col sm:gap-6 gap-10 mt-4">
      <img
        className="lg:w-[15%] md:w-[30%] w-[50%] mx-auto object-contain"
        src={
          product.product_image
            ? `${process.env.REACT_APP_API_BE}/uploads/${product.product_image}`
            : product.prescription_image
            ? prescriptionPic
            : medicine
        }
        alt="gambar"
      />
      <div className="flex flex-col justify-between md:w-[70%] lg:[85%]">
        <div className="flex md:flex-row flex-col justify-between">
          <div className="flex flex-col justify-between">
            <div>
              {product.doctor ? `Doctor: ${product.doctor}` : product.name}
            </div>
            <div>{product.patient ? `Patient: ${product.patient}` : null}</div>
            {product.type === "Bonus Item" ? (
              <div>
                {`${product.quantity} + ${product.discount} (Bonus Item) = ${
                  product.quantity + product.discount
                } `}
                {product.unit}
              </div>
            ) : (
              <div>
                {product.quantity} {product.unit}
              </div>
            )}
          </div>
          {product.type === "Bonus Item" ? (
            <p color="black" className="text-sm font-medium">
              {currency(product.price * product.quantity)}
            </p>
          ) : product.discount ? (
            <>
              <p color="black" className="text-sm font-medium">
                {currency(
                  calculateDiscountedPrice(product.price, product.discount) *
                    product.quantity
                )}
              </p>
            </>
          ) : (
            <p color="black" className="text-sm font-medium">
              Price:{" "}
              {currency(
                product.prescription_price
                  ? product.prescription_price
                  : product.price * product.quantity
              )}
            </p>
          )}
        </div>
        <div className="mt-4 text-green-600">Show Detail</div>
      </div>
    </div>
  );
}

export default ProductCard;
