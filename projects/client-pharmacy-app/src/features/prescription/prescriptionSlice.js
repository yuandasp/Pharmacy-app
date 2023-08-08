import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Swal from "sweetalert2";

const initialState = {
  prescription: [],
};

export const prescriptionSlice = createSlice({
  name: "prescription",
  initialState,
  reducers: {
    addPrescription: (state, action) => {
      state.order = action.value;
    },
  },
});

export const addUserPrescription = (file, modalHandler, navigate) => {
  return async (dispatch) => {
    const userId = JSON.parse(localStorage.getItem("user")).iduser;
    const response = await axios.post(
      `${process.env.REACT_APP_API_BE}/prescription/upload/${userId}`,
      file
    );
    if (response.data.success) {
      const condition = await Swal.fire({
        icon: "success",
        title: `${response.data.message}`,
        text: "Do you want to see your order list?",
        showCancelButton: "true",
        cancelButtonText: "No",
        confirmButtonText: "Yes",
      });
      //if user don't want to view the orderlist page then close the prescriptionUpload modal
      if (condition.isDismissed) {
        modalHandler();
      }
      //if user confirm to redirect their page to order list, then navigate to orderlist page
      if (condition.isConfirmed) {
        navigate("/orderlist");
      }
    } else {
      Swal.fire({
        icon: "error",
        title: `${response.data.error}`,
      });
    }
  };
};

export const { addPrescription } = prescriptionSlice.actions;

export default prescriptionSlice.reducer;
