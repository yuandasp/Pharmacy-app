import { createSlice } from "@reduxjs/toolkit";
import Axios from "axios";

const initialState = {
  cart: [
    // {
    //   idproduct: 1,
    //   idunit: 1,
    //   idcategory: "Medicine",
    //   idpromo: 0,
    //   name: "Paracetamol Tablet 50mg",
    //   price: 25000,
    //   description: "Untuk menurunkan deman, batuk berdahak yg disertai flu",
    //   stock: 20,
    //   product_image: "",
    //   quantity: 1,
    // },
    // {
    //   idproduct: 2,
    //   idunit: 2,
    //   idcategory: "Obat Demam",
    //   idpromo: 0,
    //   name: "Dumin Tablet 100mg",
    //   price: 15000,
    //   description: "Untuk menurunkan deman, batuk berdahak yg disertai flu",
    //   stock: 40,
    //   product_image: "",
    //   quantity: 1,
    // },
    // {
    //   idproduct: 3,
    //   idunit: 2,
    //   idcategory: "Obat Demam",
    //   idpromo: 0,
    //   name: "Dumin Tablet 100mg",
    //   price: 15000,
    //   description: "Untuk menurunkan deman, batuk berdahak yg disertai flu",
    //   stock: 40,
    //   product_image:
    //     "https://www.shutterstock.com/image-vector/3d-icon-pharmacy-on-transparent-600w-2148866261.jpg",
    //   quantity: 1,
    // },
  ],
  relatedProduct: [],
  totalPrice: 0,
  bonusItem:[]
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addProduct: (state, action) => {
      let indexProduct = state.cart.findIndex(
        (val) => val.idproduct === action.payload.idproduct
      );
      if (indexProduct < 0) {
        state.cart.push(action.payload);
      } else {
        state.cart[indexProduct].quantity++;
      }
    },
    removeProduct: (state, action) => {
      state.cart = state.cart.filter((val, index) => {
        return index !== action.payload;
      });
    },
    setTotalPrice: (state, action) => {
      state.totalPrice = action.payload;
    },
    addProductQuantity: (state, action) => {
      state.cart[action.payload].quantity++;

      // state.cart.filter((val) => val.idproduct === 2)[0].quantity = 0;
    },
    decreaseProductQuantity: (state, action) => {
      if (state.cart[action.payload].quantity === 1) {
        state.cart = state.cart.filter(
          (val, index) => index !== action.payload
        );
      } else {
        state.cart[action.payload].quantity--;
      }
    },
    addCheckedProduct: (state, action) => {
      state.cart[action.payload] = {
        ...state.cart[action.payload],
        summary: true,
      };
    },
    removeCheckedProduct: (state, action) => {
      state.cart[action.payload] = {
        ...state.cart[action.payload],
        summary: false,
      };
    },
    setEachTotalPrice: (state, action) => {
      state.cart[action.payload] = {
        ...state.cart[action.payload],
        totalPrice:
          state.cart[action.payload].quantity *
          state.cart[action.payload].price,
      };
    },
    resetCart: (state, action) => {
      state.cart = [];
      state.totalPrice = 0;
    },
    setBonusItem: (state, action) => {
      const { id } = action.payload;
      const existingIndex = state.bonusItem.findIndex((item) => item.id === id);
    
      if (existingIndex === -1) {
        state.bonusItem.push(action.payload);
      }
    },
    addToCartFromLocal: (state, action) => {
      state.cart = action.payload;
    },
  },
});

export const getRelatedProduct = (cartProduct) => {
  return async (dispatch) => {
    const response = await Axios.post(
      `${process.env.REACT_APP_API_BE}/product/relatedproduct`,
      cartProduct
    );
  };
};

export const addProductToCart = (productData, calculateDiscountedPrice) => {
  return async (dispatch) => {
    const { discount, price, type } = productData;

    // Use the actual price if the product type is 'Bonus Item'
    const productPrice = type === 'Bonus Item' ? price : calculateDiscountedPrice(price, discount);

    // Create a new product object with the updated price
    const product = {
      ...productData,
      price: productPrice,
      quantity: 1,
    };

    dispatch(addProduct(product));
  };
};


export const {
  addProduct,
  removeProduct,
  setTotalPrice,
  addProductQuantity,
  decreaseProductQuantity,
  addCheckedProduct,
  removeCheckedProduct,
  setEachTotalPrice,
  resetCart,setBonusItem,
  addToCartFromLocal,
} = cartSlice.actions;

export default cartSlice.reducer;
