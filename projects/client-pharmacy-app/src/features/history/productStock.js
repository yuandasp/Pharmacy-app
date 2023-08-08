import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Swal from "sweetalert2";

export const productStock = createSlice({
  name: "history",
  initialState: {
    productStocks: [],
    count: {
      count: 0,
    },
  },
  reducers: {
    setproductStocks: (state, action) => {
      state.productStocks = action.payload;
    },
    setCount: (state, action) => {
      state.count = action.payload;
    },
  },
});

export const { setproductStocks, setCount } = productStock.actions;
export default productStock.reducer;
