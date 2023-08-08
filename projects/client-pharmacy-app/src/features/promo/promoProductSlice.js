import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { AUTH_TOKEN } from "../../helpers/constant";
import Swal from "sweetalert2";

export const promoProductSlice = createSlice({
  name: "promos",
  initialState: {
    promos: [],
  },
  reducers: {
    setPromos: (state, action) => {
      state.promos = action.payload;
    },
  },
});

export const { setPromos } = promoProductSlice.actions;
export default promoProductSlice.reducer;

export function getAllPromo() {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem(AUTH_TOKEN);
      const response = await axios.get(
        `${process.env.REACT_APP_API_BE}/admin/promo/all`,
        { headers: { authorization: `Bearer ${token}` } }
      );
      dispatch(setPromos(response.data));
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message,
      });
    }
  };
}
