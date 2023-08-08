import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../features/cart/cartSlice";
import userReducer from "../features/users/userSlice";
import adminReduces from "../features/admin/adminSlice";
import questionReducer from "../features/qna/questionSlice";
import productReducer from "../features/product/productSlice";
import categoryReducer from "../features/cartegory/categorySlice";
import rajaongkirReducer from "../features/rajaongkir/rajaongkirSlice";
import addressReducer from "../features/users/addressSlice";
import productsReducer from "../features/cart/productsSlice";
import answerReducer from "../features/admin/answerSlice";
import transactionReducer from "../features/transaction/transactionSlice";
import orderReducer from "../features/order/orderSlice";
import unitConversionReducer from "../features/unit/unitConversion";
import promoProductReducer from "../features/promo/promoProductSlice";
import productStockReducer from "../features/history/productStock";
import prescriptionReducer from "../features/product/prescriptionSlice";
import promoReducer from "../features/promo/promoSlice";
import promoReportsReducer from "../features/promo/promoReportsSlice";
import reportReducer from "../features/report/reportSlice";

//Global state

export default configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer,
    admin: adminReduces,
    questions: questionReducer,
    rajaongkir: rajaongkirReducer,
    address: addressReducer,
    product: productsReducer,
    answers: answerReducer,
    order: orderReducer,
    transactions: transactionReducer,
    products: productReducer,
    categories: categoryReducer,
    prescriptions: prescriptionReducer,
    units: unitConversionReducer,
    promos: promoProductReducer,
    history: productStockReducer,
    promo: promoReducer,
    promoReports: promoReportsReducer,
    report: reportReducer,
  },
});
