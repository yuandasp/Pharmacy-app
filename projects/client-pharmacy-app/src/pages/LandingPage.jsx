import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@chakra-ui/react";
import CardProduct from "../components/CardProduct";
import axios from "axios";
import Swal from "sweetalert2";
import ChangeAddressModal from "../components/ChangeAddressModal";
import { useDispatch, useSelector } from "react-redux";
import NewAddressModal from "../components/NewAddressModal";
import PrescriptionModal from "../components/prescriptionn/PrescriptionModal";
import { getAllProductsByFilter } from "../features/product/productSlice";
import { addToCartFromLocal } from "../features/cart/cartSlice";

function LandingPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isChangeAddressModalHidden, setIsChangeAddressModalHidden] =
    useState(false);
  const [isNewAddressModalHidden, setIsNewAddressModalHidden] = useState(false);
  const [isUploadPrescriptionModalHidden, setIsUploadPrescriptionModalHidden] =
    useState(false);

  const userLogin = useSelector((state) => state.user.user.username);
  const userAddresses = useSelector(
    (state) => state.address.addressList.allAddress
  );

  const products = useSelector((state) => state.products.productList);

  const userId = JSON.parse(localStorage.getItem("user"))?.iduser;

  const onClickUploadPrescriptionHandler = async () => {
    if (!userId) {
      Swal.fire({
        icon: "info",
        title: "You have to login/register first",
        text: "Please login / register your username",
      });
      navigate("/login");
    } else if (userAddresses.length !== 0) {
      setIsChangeAddressModalHidden((prev) => !prev);
    } else {
      setIsNewAddressModalHidden((prev) => !prev);
    }
  };

  const uploadPrescriptionHandler = () => {
    setIsUploadPrescriptionModalHidden((prev) => !prev);
  };

  useEffect(() => {
    dispatch(
      getAllProductsByFilter({
        order: "DESC",
        sortBy: "idproduct",
        page: 1,
      })
    );
  }, []);

  return (
    <>
      <div className="">
        <div className="flex justify-center lg:justify-between items-center h-48 mx-5 lg:mx-24 my-11 background-color-green rounded-2xl">
          <div className="px-5 lg:pl-16 flex flex-col gap-6">
            <p className="font-bold text-2xl lg:text-3xl text-white">
              One-stop for your health goods
            </p>
            <p className="font-bold text-white">
              buy drugs with or without a prescription
            </p>
          </div>

          <img
            src="./assets/banner.png"
            alt=""
            className="banner-homepage hidden lg:block"
          />
        </div>
        <div className="flex flex-wrap lg:flex-nowrap gap-6 justify-center lg:justify-between items-center h-full lg:h-44 mx-5 lg:mx-24 my-16 bg-white shadow-card-tagline px-16 py-4 rounded-2xl">
          <img
            src="./assets/icon-resep-obat.png"
            alt=""
            className="banner-homepage-perscription"
          />

          <div>
            <p className="font-bold text-lg">already have a prescription?</p>
            <p>
              No need to stand in line & the medicine is sent directly to your
              location!
            </p>
          </div>
          <div>
            <Button
              onClick={onClickUploadPrescriptionHandler}
              className="button-primary"
            >
              Upload prescription
            </Button>
          </div>
        </div>
        <hr className="mx-5 lg:mx-24  m-11" />
        <div className="mx-5 lg:mx-24 ">
          <p className="font-bold text-2xl">Our Product</p>
          {/* To Page Productlist */}
          <div>
            <h4
              className="font-bold text-sm flex flex-row justify-end cursor-pointer"
              onClick={() => navigate("/productlist")}
            >
              See More
            </h4>
          </div>
          {/*  */}
          <div className="flex gap-4 mt-6 overflow-auto">
            {products.map((product, index) => (
              <CardProduct key={index} product={product} />
            ))}
          </div>
        </div>
        <hr className="mx-5 lg:mx-24  m-11" />
      </div>
      <div className="my-16">
        <p className="font-bold text-2xl mx-5 lg:mx-24 ">Our Services</p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mx-5 lg:mx-24  pt-6 mb-11">
          <div className="bg-white w-full h-full px-4 py-6 rounded-md shadow-card-tagline">
            <div className="flex gap-6 items-center ">
              <img src="./assets/icon-medicine.png" alt="" width="64px" />
              <div>
                <p className="font-bold text-lg">100 % Original</p>
                <p>
                  All the products we sell are guaranteed authentic & of the
                  best quality for you
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white w-full h-full px-4 py-6 rounded-md shadow-card-tagline">
            <div className="flex gap-6 items-center">
              <img src="./assets/icon-save-money.png" alt="" width="64px" />
              <div>
                <p className="font-bold text-lg">Save more money</p>
                <p>We guarantee to refund the difference in price difference</p>
              </div>
            </div>
          </div>
          <div className="bg-white w-full h-full px-4 py-6 rounded-md shadow-card-tagline">
            <div className="flex gap-6 items-center">
              <img src="./assets/icon-free-delivery.png" alt="" width="64px" />
              <div>
                <p className="font-bold text-lg">Free delivery</p>
                <p>
                  No need to stand in line, we deliver to your address free of
                  charge!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full h-full text-sm  bg-slate-100 justify-between px-24 py-11 flex-wrap">
        <div className="flex flex-col gap-10 items-center mx-auto">
          <p className="font-bold text-2xl text-center">Metode Pembayaran</p>
          <div className="flex flex-wrap gap-11 justify-center items-center">
            <img src="./assets/logo-mandiri.png" alt="" className="logo-bank" />
            <img src="./assets/logo-bca.png" alt="" className="logo-bank" />
            <img src="./assets/logo-permata.png" alt="" className="logo-bank" />
          </div>
        </div>
      </div>
      {isNewAddressModalHidden ? (
        <NewAddressModal modalHandler={onClickUploadPrescriptionHandler} />
      ) : null}
      {isChangeAddressModalHidden ? (
        <ChangeAddressModal
          modalHandler={onClickUploadPrescriptionHandler}
          uploadModalHandler={uploadPrescriptionHandler}
        />
      ) : null}
      {isUploadPrescriptionModalHidden ? (
        <PrescriptionModal modalHandler={uploadPrescriptionHandler} />
      ) : null}
    </>
  );
}

export default LandingPage;
