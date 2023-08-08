import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

//importing component for Cart page in here
import ProductCart from "../components/ProductCart";
import TotalPriceCart from "../components/TotalPriceCart";
import ProductCard from "../components/ProductCard";

//import function from cartSlice
import { getRelatedProduct } from "../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";
import CardProduct from "../components/CardProduct";
import { getAllProductsByFilter } from "../features/product/productSlice";

function Cart() {
  const myCart = useSelector((state) => state.cart.cart);
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.productList);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(
      getAllProductsByFilter({
        order: "DESC",
        sortBy: "idproduct",
        page: 1,
      })
    );
  }, []);

  return (
    <div>
      <div className="mx-5 lg:mx-24 my-11">
        <p className="font-bold text-2xl">My Cart</p>
      </div>
      <div className="mx-5 lg:mx-14 flex md:flex-row flex-col gap-6">
        <div className="flex flex-col md:w-[60%] justify-center md:ml-8 gap-0 mt-5 rounded-xl">
          <ProductCart />
        </div>
        <div className="mt-5 md:pr-4 md:w-[40%] flex flex-col items-center">
          <TotalPriceCart />
        </div>
      </div>
      <hr className="mx-8 md:mt-20 mt-8 border-slate-400" />

      <div className="mx-5 lg:mx-24 my-11">
        <p className="font-bold text-2xl">Related Product</p>
        {/* To Page Productlist */}
        <div>
          <h4
            className="font-bold text-sm flex flex-row justify-end cursor-pointer"
            onClick={() => navigate("/productlist")}
          >
            See More
          </h4>
        </div>
        {/*  */}
        <div className="flex gap-4 justify-between mt-6 overflow-auto">
          {products.map((product, index) => (
            <CardProduct key={index} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Cart;
