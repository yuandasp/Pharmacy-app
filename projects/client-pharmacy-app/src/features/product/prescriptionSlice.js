import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { fetchProducts } from "../cart/productsSlice";
import Swal from "sweetalert2";

export const prescriptionSlice = createSlice({
  name: "prescriptions",
  initialState: {
    prescription: {},
    prescriptionMedicine: [],
  },
  reducers: {
    setPrescription: (state, action) => {
      state.prescription = action.payload;
    },
    setPrescriptionMedicine: (state, action) => {
      const product = action.payload;
      const existingMedicine = state.prescriptionMedicine.find(
        (medicine) =>
          medicine.idproduct === action.payload.idproduct &&
          medicine.unit === action.payload.unit
      );

      if (existingMedicine) {
        // Update the quantity of the existing medicine
        existingMedicine.quantity += action.payload.quantity;
      } else {
        // Add the new medicine to the array
        state.prescriptionMedicine.push(action.payload);
      }
    },
    setEmpty: (state) => {
      state.prescriptionMedicine = [];
    },
    setPrescriptionCheckOut: (state, action) => {
      state.prescription = action.payload;
    },
  },
});
export const {
  setPrescription,
  setPrescriptionMedicine,
  setEmpty,
  setPrescriptionCheckOut,
} = prescriptionSlice.actions;
export default prescriptionSlice.reducer;

export function fetchUserPrescription(id) {
  return async (dispatch) => {
    const response = await axios.get(
      `${process.env.REACT_APP_API_BE}/prescription/${id}`
    );

    dispatch(setPrescription(response.data[0]));
  };
}
export function convertPrescription(
  id,
  order,
  filter,
  search,
  offset,
  retail_quantity,
  quantity,
  stock,
  unit,
  unit_retail,
  productQuantity
) {
  const limit = 0;
  return async (dispatch) => {
    const response = await axios.post(
      `${process.env.REACT_APP_API_BE}/prescription/convert-prescription/${id}`,
      { retail_quantity, quantity, stock, unit, unit_retail, productQuantity }
    );
    dispatch(fetchProducts(order, filter, search, offset, limit));
    Swal.fire(`${response.data.message}`, "", "success");
  };
}
export function preparePrescription(
  medicines,
  totalprice,
  weight,
  doctor,
  patient
) {
  return async (dispatch) => {
    const response = await axios.post(
      `${process.env.REACT_APP_API_BE}/prescription/prepare-prescription`,
      { medicines, totalprice, weight, doctor, patient }
    );
    Swal.fire(`${response.data.message}`, "", "success");
  };
}
export function prescriptionOrder(orderData) {
  const userId = JSON.parse(localStorage.getItem("user")).iduser;
  return async (dispatch) => {
    const response = await axios.post(
      `${process.env.REACT_APP_API_BE}/prescription/prescription-order/${userId}`,
      orderData
    );
    Swal.fire(`${response.data.message}`, "", "success");
  };
}
export function rejectPresciption(idPrescription) {
  return async (dispatch) => {

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_BE}/prescription/reject-prescriptions/${idPrescription}`,
      );
      Swal.fire(`${response.data.message}`, "", "success");
      window.location.reload();
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };
}
