import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const productSlice = createSlice({
  name: "products",
  initialState: {
    productList: [],
    totalPage: 1,
    product: {
      idproduct: "",
      idunit: "",
      idcategory: "",
      idpromo: "",
      name: "",
      price: "",
      description: "",
      stock: "",
      product_image: "",
      category: {
        idcategory: "",
        name: "",
      },
      unitProduct: "",
    },
  },
  reducers: {
    setProductList: (state, action) => {
      state.productList = action.payload;
    },
    setProduct: (state, action) => {
      state.product = action.payload;
    },
    setTotalPage: (state, action) => {
      state.totalPage = action.payload;
    },
  },
});

export const { setProduct, setProductList, setTotalPage } =
  productSlice.actions;
export default productSlice.reducer;

export function getAllProductsByFilter({
  order = "DESC",
  productName = "",
  category = "",
  sortBy = "idproduct",
  page = 1,
}) {
  return async (dispatch) => {
    const response = await axios.get(
      `${process.env.REACT_APP_API_BE}/products/filter?order=${order}&productName=${productName}&category=${category}&sortBy=${sortBy}&page=${page}`
    );
    dispatch(setProductList(response.data.products));
    dispatch(setTotalPage(response.data.totalPage));
    return response.data.products;
  };
}

export function getProductById(id) {
  return async (dispatch) => {
    const response = await axios.get(
      `${process.env.REACT_APP_API_BE}/products/${id}`
    );
    dispatch(setProduct(response.data.product));
    return response.data.product;
  };
}
