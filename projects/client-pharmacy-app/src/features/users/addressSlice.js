import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Swal from "sweetalert2";

export const addressSlice = createSlice({
  name: "address",
  initialState: {
    primaryAddress: {},
    addressList: [],
    provinces: [],
    countAddress: [],
  },
  reducers: {
    setPrimary: (state, action) => {
      state.primaryAddress = action.payload;
    },
    setAddressList: (state, action) => {
      state.addressList = action.payload;
    },
    setProvinces: (state, action) => {
      state.provinces = action.payload;
    },
    setCount: (state, action) => {
      state.countAddress = action.payload;
    },
  },
});

export const { setPrimary, setAddressList, setProvinces, setCount } =
  addressSlice.actions;
export default addressSlice.reducer;

export function fetchPrimaryAddress() {
  const userId = JSON.parse(localStorage.getItem("user")).iduser;
  return async (dispatch) => {
    let response = await axios.get(
      `${process.env.REACT_APP_API_BE}/addresses/primary/${userId}`
    );
    dispatch(setPrimary(response.data));
  };
}

export function fetchAddresses(offset) {
  const userId = JSON.parse(localStorage.getItem("user")).iduser;
  return async (dispatch) => {
    let response = await axios.get(
      `${process.env.REACT_APP_API_BE}/addresses/${userId}?offset=${offset}`
    );
    dispatch(setAddressList(response.data));
  };
}
export function removeAddress(idAddress) {
  return async (dispatch) => {
    let response = await axios.delete(
      `${process.env.REACT_APP_API_BE}/addresses/${idAddress}`
    );
    Swal.fire(`${response.data.message}`, "", "success");
    dispatch(fetchAddresses());
  };
}
export function fetchProvince() {
  return async (dispatch) => {
    let response = await axios.get(
      `${process.env.REACT_APP_API_BE}/addresses/provinces`
    );
    dispatch(setProvinces(response.data));
  };
}
export function addUserAddress(
  city,
  idProvince,
  street,
  isPrimary,
  district,
  postal_code,
  type
) {
  const idUser = JSON.parse(localStorage.getItem("user")).iduser;
  const selectedCity = JSON.parse(city);
  const idCity = selectedCity.city_id;
  const cityName = `${selectedCity.type} ${selectedCity.city_name}`;
  const offset = 0;
  return async (dispatch) => {
    let response = await axios.post(
      `${process.env.REACT_APP_API_BE}/users/address`,
      {
        idUser,
        idCity,
        idProvince,
        street,
        isPrimary,
        district,
        postal_code,
        cityName,
        type,
      }
    );
    Swal.fire(`${response.data.message}`, "", "success");
    dispatch(fetchPrimaryAddress());
    dispatch(fetchAddresses(offset));
  };
}
export function setNewPrimary(idAddress, modalHandler, uploadModalHandler) {
  return async (dispatch) => {
    let response = await axios.put(
      `${process.env.REACT_APP_API_BE}/addresses/${idAddress}`
    );
    Swal.fire(`${response.data.message}`, "", "success").then(() => {
      dispatch(fetchAddresses());
      dispatch(fetchPrimaryAddress());
      if (modalHandler) {
        modalHandler();
      }
      if (uploadModalHandler) {
        uploadModalHandler();
      }
    });
  };
}

export const addNewAddress = (newAddress) => {
  return async (dispatch) => {
    const userId = JSON.parse(localStorage.getItem("user")).iduser;
    const response = await axios.post(
      `${process.env.REACT_APP_API_BE}/addresses/new`,
      { ...newAddress, userId }
    );

    if (response.data.success) {
      dispatch(fetchAddresses(0));
      dispatch(fetchPrimaryAddress());
      return response;
    } else {
      return response;
    }
  };
};
