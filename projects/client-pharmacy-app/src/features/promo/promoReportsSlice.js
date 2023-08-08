import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Swal from "sweetalert2";

export const promoReportsSlice = createSlice({
  name: "promoReports",
  initialState: {
    promos: [],
    promosData: [],
  },
  reducers: {
    setPromosData: (state, action) => {
      action.payload.forEach((data) => {
        if (!state.promosData.includes(data.idpromo)) {
          state.promosData.push(data);
        }
      });
    },
    setPromos: (state, action) => {
      state.promos = action.payload;
    },
  },
});

export const { setPromosData, setPromos } = promoReportsSlice.actions;
export default promoReportsSlice.reducer;

export function fetchCount() {
  return async (dispatch) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BE}/promos/reports/bonus-items`
      );
      const countSamePromo = response.data.countSamePromo;

      dispatch(setPromosData(countSamePromo));

      const secondResponse = await axios.get(
        `${process.env.REACT_APP_API_BE}/promos/reports/transaction-discounts`
      );
      const countSameDiscount = secondResponse.data.countSameDiscount;
      dispatch(setPromosData(countSameDiscount));

      const thirdResponse = await axios.get(
        `${process.env.REACT_APP_API_BE}/promos/reports/product-discounts`
      );
      const countSameDiscountProduct = thirdResponse.data.countSameDiscount;

      dispatch(setPromosData(countSameDiscountProduct));
    } catch (error) {
      // Handle error if necessary
      console.error(error);
    }
  };
}

export function fetchBonusItem(offset, search, order) {
  return async (dispatch) => {
    const response = await axios.get(
      `${process.env.REACT_APP_API_BE}/promos/reports/bonus-items?offset=${offset}&search=${search}&order=${order}`
    );
    dispatch(setPromos(response.data.bonusItemQuery));
  };
}
export function fetchTransactionDiscounts(offset, search, order) {
  return async (dispatch) => {
    const response = await axios.get(
      `${process.env.REACT_APP_API_BE}/promos/reports/transaction-discounts?offset=${offset}&search=${search}&order=${order}`
    );

    dispatch(setPromos(response.data.trasactionDiscount));
  };
}
export function fetchProductDiscounts(offset, search, order) {
  return async (dispatch) => {
    const response = await axios.get(
      `${process.env.REACT_APP_API_BE}/promos/reports/product-discounts?offset=${offset}&search=${search}&order=${order}`
    );
    dispatch(setPromos(response.data.productDiscount));
  };
}
