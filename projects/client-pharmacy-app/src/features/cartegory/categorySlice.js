import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Swal from "sweetalert2";

export const categorySlice = createSlice({
  name: "categories",
  initialState: {
    categories: [],
    category: {
      idcategory: "",
      name: "",
    },
    count: {
      count: 0,
    },
  },
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setCategory: (state, action) => {
      state.category = action.payload;
    },
    setCount: (state, action) => {
      state.count = action.payload;
    },
  },
});

export const { setCategories, setCount } = categorySlice.actions;
export default categorySlice.reducer;

export function getAllCategory(sort, search, offset) {
  return async (dispatch) => {
    const response = await axios.get(
      `${process.env.REACT_APP_API_BE}/categories`,
      {
        params: {
          sort,
          search,
          offset,
        },
      }
    );
    dispatch(setCategories(response.data.categories));
    dispatch(setCount(response.data.countData[0].count));
  };
}
export function deleteCategory(id) {
  const sort = "ASC";
  const offset = 0;
  const search = "";
  return async (dispatch) => {
    const response = await axios.delete(
      `${process.env.REACT_APP_API_BE}/categories/${id}`
    );
    Swal.fire(`${response.data.message}`, "", "success");
    dispatch(getAllCategory(sort, search, offset));
  };
}
export function createCategory(category) {
  const sort = "ASC";
  const offset = 0;
  const search = "";
  return async (dispatch) => {
    const response = await axios.post(
      `${process.env.REACT_APP_API_BE}/categories/create-category`,
      { category }
    );
    Swal.fire(`${response.data.message}`, "", "success");
    dispatch(getAllCategory(sort, search, offset));
  };
}
export function updateCategory(id, name) {
  const sort = "ASC";
  const offset = 0;
  const search = "";
  return async (dispatch) => {
    const response = await axios.put(
      `${process.env.REACT_APP_API_BE}/categories/update-category/${id}`,
      { name }
    );
    Swal.fire(`${response.data.message}`, "", "success");
    dispatch(getAllCategory(sort, search, offset));
  };
}
