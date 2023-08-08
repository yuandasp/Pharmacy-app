import { createSlice } from "@reduxjs/toolkit";
import Axios from "axios";
import Swal from "sweetalert2";

export const transactionSlice = createSlice({
  name: "transaction",
  initialState: {
    transactions: [],
  },
  reducers: {
    setTransactions: (state, action) => {
      state.transactions = action.payload;
    },
  },
});

export const { setTransactions } = transactionSlice.actions;
export default transactionSlice.reducer;

export const fetchTransaction = () => {
  const idUser = JSON.parse(localStorage.getItem("user")).iduser;
  return async (dispatch) => {
    let response = await Axios.get(
      `${process.env.REACT_APP_API_BE}/transactions/my-transactions/${idUser}`
    );
    dispatch(setTransactions(response.data));
  };
};

export const setStatus = (id, status) => {
  return async (dispatch) => {
    let response = await Axios.put(
      `${process.env.REACT_APP_API_BE}/transactions/status-transactions/${id}`,
      { status }
    );
    dispatch(fetchTransaction());
  };
};
