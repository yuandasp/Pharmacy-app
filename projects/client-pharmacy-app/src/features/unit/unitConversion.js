import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { AUTH_TOKEN } from "../../helpers/constant";
import Swal from "sweetalert2";

export const unitConversionSlice = createSlice({
  name: "units",
  initialState: {
    units: [],
  },
  reducers: {
    setUnits: (state, action) => {
      state.units = action.payload;
    },
  },
});

export const { setUnits } = unitConversionSlice.actions;
export default unitConversionSlice.reducer;

export function getAllUnitConversion() {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem(AUTH_TOKEN);
      const response = await axios.get(
        `${process.env.REACT_APP_API_BE}/admin/unit-conversion/all`,
        { headers: { authorization: `Bearer ${token}` } }
      );
      dispatch(setUnits(response.data));
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message,
      });
    }
  };
}
