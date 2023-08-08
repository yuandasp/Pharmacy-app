import { createSlice } from "@reduxjs/toolkit";
import Axios from "axios";
import Swal from "sweetalert2";
import { AUTH_TOKEN } from "../../helpers/constant";
import TableHistoryStockByIdProduct from "../../components/admin/products/TableHistoryStockByIdProduct";

export const productsSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    product: {
      idproduct: "",
      idunit: "",
      idcategory: "",
      idpromo: "",
      name: "",
      price: "",
      description: "",
      stock: "",
      product_image: "",
    },
    categories: [],
    convertedUnit: [],
    count: {
      count: "",
    },
    countProduct: 0,
  },
  reducers: {
    setProduct: (state, action) => {
      state.product = action.payload;
    },
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setConvertedUnit: (state, action) => {
      state.convertedUnit = action.payload;
    },
    setCount: (state, action) => {
      state.count = action.payload;
    },
    setCountProduct: (state, action) => {
      state.countProduct = action.payload;
    },
  },
});

export const {
  setProduct,
  setProducts,
  setCategories,
  setConvertedUnit,
  setCount,
  setCountProduct,
} = productsSlice.actions;
export default productsSlice.reducer;

export function fetchProducts(order, filter, search, offset, limit) {
  return async (dispatch) => {
    const response = await Axios.get(
      `${process.env.REACT_APP_API_BE}/products?order=${order}&filter=${filter}&search=${search}&offset=${offset}&limit=${limit}`
    );
    dispatch(setCategories(response.data.categoryQuery));
    dispatch(setProducts(response.data.productQuery));
    dispatch(setCount(response.data.countData));
  };
}

export function fetchDetailProduct(idproduct) {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem(AUTH_TOKEN);
      const response = await Axios.get(
        `${process.env.REACT_APP_API_BE}/admin/products/${idproduct}`,
        { headers: { authorization: `Bearer ${token}` } }
      );
      dispatch(setProduct(response.data.product));
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message,
      });
    }
  };
}

export function updateStock(id, stock, setEdit, updatedStock, unit) {
  if (updatedStock == "0") {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: `You didn't update anything`,
    });
    setEdit(false);
  } else {
    return async (dispatch) => {
      let response = await Axios.put(
        `${process.env.REACT_APP_API_BE}/products/stock/${id}`,
        { stock, updatedStock, unit }
      );
      Swal.fire(`${response.data.message}`, "", "success");
      dispatch(fetchDetailProduct(id));
      setEdit(false);
    };
  }
}

export function createConversionRules(unit, quantity, unitDefault, setOpen) {
  return async (dispatch) => {
    const response = await Axios.post(
      `${process.env.REACT_APP_API_BE}/products/unit-conversions`,
      { unit, quantity, unitDefault }
    );
    Swal.fire(`${response.data.message}`, "", "success");
    setOpen(false);
  };
}
export function setConversionRules(idProduct, idUnit, order, filter, search) {
  const offset = 0;
  const limit = 5;
  return async (dispatch) => {
    let response = await Axios.post(
      `${process.env.REACT_APP_API_BE}/products/assign-rule/${idProduct}`,
      { idUnit }
    );
    dispatch(fetchProducts(order, filter, search, offset, limit));
    Swal.fire(`${response.data.message}`, "", "success");
  };
}

export function fetchUnitConversionRules() {
  return async (dispatch) => {
    let response = await Axios.get(
      `${process.env.REACT_APP_API_BE}/products/rules`
    );
    dispatch(setConvertedUnit(response.data));
  };
}

export function changeDefaultUnit(
  idProduct,
  unit_product,
  stock,
  order,
  filter,
  search
) {
  const offset = 0;
  const limit = 5;
  return async (dispatch) => {
    let response = await Axios.put(
      `${process.env.REACT_APP_API_BE}/products/change-unit/${idProduct}`,
      { unit_product, stock }
    );
    dispatch(fetchProducts(order, filter, search, offset, limit));
    Swal.fire(`${response.data.message}`, "", "success");
  };
}

export function removeRuleProduct(idProduct, order, filter, search) {
  const offset = 0;
  const limit = 5;
  return async (dispatch) => {
    let response = await Axios.delete(
      `${process.env.REACT_APP_API_BE}/products/remove-rule/${idProduct}`
    );
    dispatch(fetchProducts(order, filter, search, offset, limit));
    Swal.fire(`${response.data.message}`, "", "success");
  };
}

export function fetchAllProductOnAdmin(idcategory, sort, key, page, search) {
  const LIMIT = 5;
  const token = localStorage.getItem(AUTH_TOKEN);
  return async (dispatch) => {
    try {
      let response = await Axios.get(
        `${process.env.REACT_APP_API_BE}/admin/products/all`,
        {
          params: {
            idcategory,
            sort,
            key,
            limit: LIMIT,
            page,
            search,
          },
          headers: { authorization: `Bearer ${token}` },
        }
      );
      dispatch(setProducts(response.data.products || []));
      dispatch(setCountProduct(response.data.count));
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message,
      });
    }
  };
}
