import { createSlice } from "@reduxjs/toolkit";
import Axios from "axios";
import Swal from "sweetalert2";

const initialState = {
  province: [],
  city: [],
  services: [],
};

export const rajaongkirSlice = createSlice({
  name: "rajaongkir",
  initialState,
  reducers: {
    addProvince: (state, action) => {
      state.province = action.payload;
    },
    addCity: (state, action) => {
      state.city = action.payload;
    },
    resetCity: (state, action) => {
      state.city = [];
    },
    addServices: (state, action) => {
      state.services = action.payload;
    },
    resetServices: (state, action) => {
      state.services = [];
    },
  },
});

export const getProvince = () => {
  return async (dispatch) => {
    const response = await Axios.get(
      `${process.env.REACT_APP_API_BE}/rajaongkir/province`
    );
    if (response.data.success) {
      dispatch(addProvince(response.data.province));
    } else {
      alert(response.data.message);
    }
  };
};

export const getCity = (provID) => {
  return async (dispatch) => {
    const response = await Axios.get(
      `${process.env.REACT_APP_API_BE}/rajaongkir/city/${provID}`
    );
    if (response.data.success) {
      dispatch(addCity(response.data.city));
    }
  };
};

export const getCost = (origin, destination, weight, courier) => {
  return async (dispatch) => {
    const response = await Axios.post(
      `${process.env.REACT_APP_API_BE}/rajaongkir/cost`,
      {
        origin,
        destination,
        weight,
        courier,
      }
    );
    if (!response.data.success) {
      Swal.fire(`${response.data.message}`, "", "error");
    } else {
      dispatch(addServices(response.data.services));
    }
  };
};

export const { addProvince, addCity, resetCity, addServices, resetServices } =
  rajaongkirSlice.actions;

export default rajaongkirSlice.reducer;
