import React from "react";
import { Button, Input, Tooltip } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { currency } from "../../../helpers/currency";
import { useState } from "react";
import { updateStock } from "../../../features/cart/productsSlice";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";

function ProductsCard({ product }) {
  const [isEdit, setEdit] = useState(false);
  const [stock, setStock] = useState(product.stock);
  const categories = useSelector((state) => state.product.categories);
  const dispatch = useDispatch();
  let updatedStock = stock - product.stock;
  const saveHandler = async (id, unit) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to Update Product Stock",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, change it!",
    });
    if (result.isConfirmed) {
      dispatch(updateStock(id, stock, setEdit, updatedStock, unit));
    }
  };
  const deleteHandler = async (id, unit) => {
    const deletedStock = 0;
    updatedStock = deletedStock - product.stock;

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to Delete Product Stock",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, change it!",
    });
    if (result.isConfirmed) {
      setStock(0);
      dispatch(updateStock(id, deletedStock, setEdit, updatedStock, unit));
    }
  };

  return (
    <div className="flex flex-col justify center items-center max-w-sm rounded overflow-hidden shadow-lg py-4">
      <img
        src={
          product.product_image
            ? `${process.env.REACT_APP_API_BE}/${product.product_image}`
            : "../assets/icon-medicine.png"
        }
        alt=""
        width="72px"
      />
      <div className="px-6 py-4 text-center">
        <h1 className="font-bold text-xl mb-2">{product.name}</h1>
        {categories.map((category) => {
          if (category.idproduct === product.idproduct) {
            return (
              <span
                key={category.id}
                className="inline-block bg-emerald-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-700 mr-2"
              >
                {category.category_name}
              </span>
            );
          }
        })}

        <p className="text-gray-700 text-base">{currency(product.price)}</p>
        {!isEdit ? (
          product.stock === 0 ? (
            <p className="text-red-500 text-base">Stock: Kosong</p>
          ) : (
            <p className="text-gray-700 text-base">
              Stock: {product.stock} {product.unit_product}
            </p>
          )
        ) : (
          <div className="text-gray-700 text-base">
            <p>
              {"Stock :"}{" "}
              <input
                type="text"
                className="border-2 border-black w-8"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />{" "}
              {product.unit_product}
            </p>
          </div>
        )}
      </div>
      {!isEdit ? (
        <Button className="border-button" onClick={() => setEdit(true)}>
          Update Stock
        </Button>
      ) : (
        <div className="flex gap-3">
          <Button
            className="border-button"
            onClick={() => saveHandler(product.idproduct, product.unit_product)}
          >
            Save
          </Button>
          <Button
            className="border-button"
            onClick={() => {
              deleteHandler(product.idproduct, product.unit_product);
            }}
          >
            Delete
          </Button>
        </div>
      )}
    </div>
  );
}

export default ProductsCard;
