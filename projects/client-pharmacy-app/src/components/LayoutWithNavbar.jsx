import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useDispatch } from "react-redux";
import { fetchUser } from "../features/users/userSlice";
import {
  fetchAddresses,
  fetchPrimaryAddress,
} from "../features/users/addressSlice";
import { fetchTransaction } from "../features/transaction/transactionSlice";
import { addToCartFromLocal } from "../features/cart/cartSlice";

function LayoutWithNavbar() {
  const dispatch = useDispatch();
  const userId = JSON.parse(localStorage.getItem("user"))?.iduser;

  useEffect(() => {
    if (userId) {
      dispatch(
        addToCartFromLocal(JSON.parse(localStorage.getItem("myCart")) || [])
      );
      dispatch(fetchTransaction());
      dispatch(fetchUser());
      dispatch(fetchAddresses(0));
      dispatch(fetchPrimaryAddress(userId));
    }
  }, []);
  return (
    <div>
      <Navbar />
      <div style={{ minHeight: "70vh" }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default LayoutWithNavbar;
