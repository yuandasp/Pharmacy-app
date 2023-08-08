import "./App.css";
import { Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import LandingPage from "./pages/LandingPage";
import LayoutWithNavbar from "./components/LayoutWithNavbar";
import AuthRoute from "./components/AuthRoute";
import Profile from "./pages/Profile";
import Forum from "./pages/Forum";
import OrderList from "./pages/OrderList";

//put imported pages here!

import Cart from "./pages/Cart";
import ProductList from "./pages/ProductList";
import Verification from "./pages/Verification";
import Login from "./pages/Login";
// import Address from "./pages/Address";
import Order from "./pages/Order";
import ChangePassword from "./pages/ChangePassword";
import PageNotFound from "./pages/PageNotFound";
import Products from "./pages/admin/Products";
import PrivateRoute from "./components/PrivateRoute";
import LoginAdmin from "./pages/admin/LoginAdmin";
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import AnswerQuestion from "./pages/admin/AnswerQuestion";
import AuthRouteAdmin from "./components/admin/AuthRouteAdmin";
import PrivateRouteAdmin from "./components/admin/PrivateRouteAdmin";
import DetailUserQuestion from "./pages/admin/DetailUserQuestion";
import UserTransacations from "./pages/UserTransacations";
import UserRoute from "./components/UserRoute";
import AdminRoute from "./components/admin/AdminRoute";
import DetailProductAdmin from "./pages/admin/DetailProduct";
import UnitConversion from "./pages/admin/UnitConversion";
import Transaction from "./pages/admin/Transaction";
import DetailProductUser from "./pages/DetailProductUser";
import DetailQnaUser from "./pages/DetailQnaUser";
import Prescription from "./pages/admin/Prescription";
import PrescriptionCheckOut from "./pages/PrescriptionCheckOut";
import Categories from "./pages/admin/Categories";
import ProductStockHistory from "./pages/admin/ProductStockHistory";
import Discount from "./pages/admin/Discount";
import ProductsDisount from "./pages/admin/ProductsDisount";
import PromoReport from "./pages/admin/PromoReport";
import Report from "./pages/admin/Report";

//
function App() {
  return (
    <div className="">
      <Routes>
        <Route element={<UserRoute />}>
          <Route element={<LayoutWithNavbar />}>
            <Route path="/productlist" element={<ProductList />} />
            <Route path="/detail/:productId" element={<DetailProductUser />} />
            <Route path="/" element={<LandingPage />} />
            <Route element={<PrivateRoute />}>
              <Route path="/cart" element={<Cart />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/forum" element={<Forum />} />
              <Route path="/order" element={<Order />} />
              <Route
                path="/prescription/checkout"
                element={<PrescriptionCheckOut />}
              />
              <Route path="/orderlist" element={<OrderList />} />
              <Route path="/change-password" element={<ChangePassword />} />
              <Route path="/my-transactions" element={<UserTransacations />} />
              <Route path="/forum/:idquestion" element={<DetailQnaUser />} />
            </Route>
          </Route>
          <Route element={<AuthRoute />}>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verification/:token" element={<Verification />} />
            <Route path="/reset-password/:token" element={<ChangePassword />} />
          </Route>
        </Route>
        <Route element={<AdminRoute />}>
          <Route element={<PrivateRouteAdmin />}>
            <Route path="/admin/dashboard" element={<DashboardAdmin />} />
            <Route path="/admin/answer-question" element={<AnswerQuestion />} />
            <Route path="/admin/products" element={<Products />} />
            <Route path="/admin/discounts" element={<Discount />} />
            <Route path="/admin/reports/promos" element={<PromoReport />} />
            <Route path="/admin/discounts/manage-products/:idPromo" element={<ProductsDisount />} />
            <Route path="/admin/products/categories" element={<Categories />} />
            <Route
              path="/admin/prescription/:idprescription"
              element={<Prescription />}
            />
            <Route path="/admin/report" element={<Report />} />
            <Route
              path="/admin/products/unit-conversion"
              element={<UnitConversion />}
            />
            <Route
              path="/admin/answer-question/:idquestion"
              element={<DetailUserQuestion />}
            />
            <Route path="/admin/transactions" element={<Transaction />} />
            <Route
              path="/admin/products/:idproduct"
              element={<DetailProductAdmin />}
            />
            <Route
              path="/admin/history-stock"
              element={<ProductStockHistory />}
            />
          </Route>
          <Route element={<AuthRouteAdmin />}>
            <Route path="/admin/login" element={<LoginAdmin />} />
          </Route>
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;
