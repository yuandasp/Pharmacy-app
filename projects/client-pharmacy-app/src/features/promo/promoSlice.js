import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Swal from "sweetalert2";

export const promoSlice = createSlice({
  name: "promo",
  initialState: {
    discounts: [],
    discount: {},
    count: 0,
  },
  reducers: {
    setDiscounts: (state, action) => {
      state.discounts = action.payload;
    },
    setDiscount: (state, action) => {
      state.discount = action.payload;
    },
    setCount: (state, action) => {
      state.count = action.payload;
    },
  },
});
export const { setDiscounts, setDiscount, setCount } = promoSlice.actions;
export default promoSlice.reducer;

export function createDiscount(discount) {
  return async (dispatch) => {
    const response = await axios.post(
      `${process.env.REACT_APP_API_BE}/promos/new-discount`,
      discount
    );
    dispatch(fetchDiscounts());
    Swal.fire(`${response.data.message}`, "", "success");
  };
}
export function fetchDiscounts(order, filter, search, offset) {
  return async (dispatch) => {
    const response = await axios.get(
      `${process.env.REACT_APP_API_BE}/promos/discounts?order=${order}&filter=${filter}&search=${search}&offset=${offset}`
    );
    dispatch(setDiscounts(response.data.allDiscounts));
    dispatch(setCount(response.data.countData));
  };
}
export function fetchDiscount(id) {
  return async (dispatch) => {
    const response = await axios.get(
      `${process.env.REACT_APP_API_BE}/promos/discount/${id}`
    );

    dispatch(setDiscount(response.data[0]));
  };
}
export function editDiscount(id, editData) {
  return async (dispatch) => {
    const response = await axios.put(
      `${process.env.REACT_APP_API_BE}/promos/update-discount/${id}`,
      editData
    );
    dispatch(fetchDiscount(id));
    dispatch(fetchDiscounts());
    Swal.fire(`${response.data.message}`, "", "success");
  };
}
export function disableDiscount(id, order, filter, search, offset) {
  return async (dispatch) => {
    const response = await axios.put(
      `${process.env.REACT_APP_API_BE}/promos/disable-discount/${id}`
    );
    dispatch(fetchDiscounts(order, filter, search, offset));
    Swal.fire(`${response.data.message}`, "", "success");
  };
}
export function enableDiscount(id) {
  return async (dispatch) => {
    const response = await axios.put(
      `${process.env.REACT_APP_API_BE}/promos/enable-discount/${id}`
    );
    dispatch(fetchDiscounts());
    Swal.fire(`${response.data.message}`, "", "success");
  };
}
export function assignDiscount(idpromo, idproduct) {
  return async (dispatch) => {
    const response = await axios.put(
      `${process.env.REACT_APP_API_BE}/promos/assign-products/${idpromo}`,
      { idproduct }
    );
    Swal.fire(`${response.data.message}`, "", "success");
  };
}
export function transactionDiscounts() {
  return async (dispatch) => {
    const response = await axios.get(
      `${process.env.REACT_APP_API_BE}/promos/transaction-discounts`
    );
    dispatch(setDiscounts(response.data));
  };
}
