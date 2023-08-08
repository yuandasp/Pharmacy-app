import React, { useEffect } from "react";
import { getProductById } from "../features/product/productSlice";
import { currency } from "../helpers/currency";
import { addProductToCart } from "../features/cart/cartSlice";
import { Button } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

function DetailProductUser() {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const product = useSelector((state) => state.products.product);

  useEffect(() => {
    dispatch(getProductById(productId));
  }, []);

  return (
    <div>
      <div className="w-full justify-center my-11 gap-11 flex flex-wrap xs:flex-nowrap px-11">
        <div className="sm:w-1/3 max-w-xs">
          <img
            className="w-full object-contain"
            src={
              product.product_image
                ? `${process.env.REACT_APP_API_BE}/uploads/${product.product_image}`
                : "./assets/icon-medicine.png"
            }
            alt=""
          />
        </div>

        <div className="shadow-card-tagline border-y-2 w-full sm:w-1/3 flex flex-col p-1 xs:p-4">
          <div className="p-4">
            <div className="text-2xl font-extrabold">{product.name}</div>
            <div className="mt-6 text-base font-medium">
              {product.description}
            </div>
            <div className="mt-11 text-sm font-medium flex gap-4 ">
              Stock
              <div className="text-blue-600">{product.stock}</div>
            </div>
            <div className="mt-2 text-sm font-medium flex gap-4">
              Category
              <div className="flex gap-2 flex-wrap xs:flex-nowrap">
                {(product.categories || []).length > 0
                  ? (product.categories || []).map((category) => {
                      return (
                        <p key={category.idcategory} className="text-blue-600">
                          {category.name || "-"}
                        </p>
                      );
                    })
                  : "-"}
              </div>
            </div>
            <hr className="mt-4" />
            <div className="mt-4 text-2xl font-bold text-center">
              {currency(product.price)}
            </div>
          </div>
          <Button
            className="button-primary mt-2 mb-2 mx-4"
            variant={"solid"}
            size={"md"}
            onClick={() =>
              navigate("/cart", dispatch(addProductToCart(product)))
            }
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DetailProductUser;
