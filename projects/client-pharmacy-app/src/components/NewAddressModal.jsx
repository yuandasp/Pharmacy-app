import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";

import { getCity, getProvince } from "../features/rajaongkir/rajaongkirSlice";
import { addNewAddress } from "../features/users/addressSlice";
import { useEffect } from "react";

function NewAddressModal({ modalHandler }) {
  const dispatch = useDispatch();

  const province = useSelector((state) => state.rajaongkir.province);
  const city = useSelector((state) => state.rajaongkir.city);

  const [isPrimary, setIsPrimary] = useState(false);

  //temp data resulting from changing city selection
  const [idCity, setIdCity] = useState(0);
  const [cityName, setCityName] = useState("");
  const [idProvince, setIdProvince] = useState(0);
  const [provinceName, setProvinceName] = useState("");

  const addressSchema = Yup.object().shape({
    firstName: Yup.string().required("Field required"),
    lastName: Yup.string().required("Field required"),
    labelAddress: Yup.string().required("Field required"),
    phoneNumber: Yup.number().integer().required("Field required"),
    userAddress: Yup.string().required("Field required"),
    postalCode: Yup.number().required("Field required"),
  });

  //after user select province, function below is running to fetch city from rajaongkir
  const onClickProvinceHandler = (e) => {
    if (e.target.value !== "") {
      dispatch(getCity(e.target.value));
    }
  };

  //onClick city handler to output JSON after user select any city
  const onClickCityHandler = async (e) => {
    const { city_id, city_name, province, province_id } = JSON.parse(
      e.target.value
    );
    setIdCity(city_id);
    setCityName(city_name);
    setIdProvince(province_id);
    setProvinceName(province);
  };

  const onSubmitHandler = async (newAddressData) => {
    const response = await dispatch(addNewAddress(newAddressData));
    if (response.data.success) {
      Swal.fire(`${response.data.message}`, "", "success");
      modalHandler();
    } else {
      Swal.fire(`${response.data.message}`, "", "error");
    }
  };

  useEffect(() => {
    dispatch(getProvince());
  }, []);

  return (
    <Formik
      initialValues={{
        labelAddress: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        userAddress: "",
        postalCode: "",
      }}
      validationSchema={addressSchema}
      onSubmit={(value) => {
        onSubmitHandler({
          ...value,
          primary: isPrimary,
          idcity: idCity,
          city_name: cityName,
          idprovince: idProvince,
          province: provinceName,
        });
      }}
      validator={() => ({})}
    >
      {(props) => {
        return (
          <>
            <div className=" w-[90%] rounded-xl shadow-xl">
              <Form
                action="#"
                method="POST"
                className="w-full h-full absolute top-0 left-0 bg-opacity-25 backdrop-blur-sm z-10"
              >
                <div className="bg-white border-4 border-gray-600 rounded-xl sm:w-[50%] w-[90%] mx-auto mt-10">
                  <div className="sm:w-[90%] w-[80%] mx-auto whitespace-nowrap text-3xl tracking-wide font-bold font-roboto pt-10">
                    New Address
                  </div>
                  <hr className=" mt-4" />
                  <div className="sm:w-[90%] w-[80%] mx-auto sm:pt-20 pt-10 h-[170px]">
                    <label
                      className="text-[20px] font-bold"
                      htmlFor="labelAddress"
                    >
                      Label Address
                    </label>
                    <Field
                      id="labelAddress"
                      name="labelAddress"
                      required
                      type="text"
                      placeholder="Example: Apartment, Condo, etc."
                      className="rounded-md focus:outline-none sm:pl-4 pl-2 border-2 mt-4 h-[40px] w-full border-slate-300 focus:border-green-500"
                    />
                    <ErrorMessage
                      className="pl-3"
                      component="div"
                      name="labelAddress"
                      style={{ color: "red", fontSize: "12px" }}
                    />
                  </div>
                  <div className="sm:w-[90%] w-[80%] mx-auto sm:pt-10">
                    <label className="text-[20px] font-bold" htmlFor="info">
                      Customer Info
                    </label>
                    <div className="flex sm:flex-row flex-col w-full gap-6 items-center mt-5">
                      <div className="flex flex-col flex-1 w-full h-[100px]">
                        <label htmlFor="firstName">First Name</label>
                        <Field
                          id="firstName"
                          name="firstName"
                          type="text"
                          required
                          autoComplete="first name"
                          placeholder="Example: John"
                          className="rounded-md sm:pl-4 pl-2 border-2 focus:outline-none mt-4 w-full h-[40px] border-slate-300 focus:border-green-500"
                        />
                        <ErrorMessage
                          className="pl-3"
                          component="div"
                          name="firstName"
                          style={{ color: "red", fontSize: "12px" }}
                        />
                      </div>

                      <div className="flex flex-col flex-1 w-full h-[100px]">
                        <label htmlFor="lastName">Last Name</label>
                        <Field
                          id="lastName"
                          name="lastName"
                          required
                          placeholder="Example: Smith"
                          type="text"
                          className="rounded-md w-full focus:outline-none sm:pl-4 pl-2 border-2 mt-4 h-[40px] border-slate-300  focus:border-green-500"
                        />
                        <ErrorMessage
                          className="pl-3"
                          component="div"
                          name="lastName"
                          style={{ color: "red", fontSize: "12px" }}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col mt-5 h-[120px]">
                      <label htmlFor="phoneNumber">Phone Number</label>
                      <Field
                        id="phoneNumber"
                        name="phoneNumber"
                        required
                        placeholder="Enter your phone number"
                        type="text"
                        className="rounded-md border-2 sm:pl-4 pl-2 focus:outline-none mt-4 h-[40px] border-slate-300 focus:border-green-500"
                      />
                      <ErrorMessage
                        className="pl-3"
                        component="div"
                        name="phoneNumber"
                        style={{ color: "red", fontSize: "12px" }}
                      />
                    </div>
                    <div className="flex sm:flex-row flex-col w-full gap-6 items-center">
                      <div className="flex flex-col flex-1 w-full">
                        <label htmlFor="city">Province</label>
                        <select
                          as="select"
                          id="Province"
                          onChange={onClickProvinceHandler}
                          name="province"
                          className="bg-white border-2 mt-4 border-gray-300 text-sm rounded-lg w-full p-3 focus:ring-green-500 focus:border-green-500"
                        >
                          <option value="">Select Province</option>
                          {province.map((val) => {
                            return (
                              <option
                                key={val.province_id}
                                value={val.province_id}
                              >
                                {val.province}
                              </option>
                            );
                          })}
                        </select>
                        <ErrorMessage
                          className="pl-3"
                          component="div"
                          name="province"
                          style={{ color: "red", fontSize: "12px" }}
                        />
                      </div>
                      <div className="flex flex-col flex-1 w-full">
                        <label htmlFor="city">City / State</label>
                        <select
                          as="select"
                          id="city"
                          name="city"
                          onChange={onClickCityHandler}
                          className="bg-white border-2 mt-4 border-gray-300 text-sm rounded-lg w-full p-3 focus:ring-green-500 focus:border-green-500"
                        >
                          <option value="">Select City</option>
                          {city.map((val) => {
                            return (
                              <option
                                key={val.city_id}
                                value={JSON.stringify(val)}
                              >
                                {val.city_name}
                              </option>
                            );
                          })}
                        </select>
                        <ErrorMessage
                          className="pl-3"
                          component="div"
                          name="city"
                          style={{ color: "red", fontSize: "12px" }}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col relative mt-5 h-[100px]">
                      <label htmlFor="userAddress">Address</label>
                      <div className="flex flex-col">
                        <Field
                          id="userAddress"
                          name="userAddress"
                          placeholder="Enter your new address"
                          type="text"
                          className="rounded-md border-2 sm:pl-4 pl-2 focus:outline-none mt-4 h-[40px] border-slate-300 focus:border-green-500"
                        />
                        <ErrorMessage
                          className="pl-3"
                          component="div"
                          name="userAddress"
                          style={{ color: "red", fontSize: "12px" }}
                        />
                      </div>
                    </div>
                    <div className="flex flex-row w-full gap-6 items-center mt-5">
                      <div className="flex flex-col w-[100%] h-[100px]">
                        <label htmlFor="postalCode">Postal Code</label>
                        <Field
                          id="postalCode"
                          name="postalCode"
                          placeholder="Enter your postal code"
                          type="text"
                          className="rounded-md border-2 sm:pl-4 pl-2 focus:outline-none mt-4 h-[40px] border-slate-300 focus:border-green-500"
                        />
                        <ErrorMessage
                          className="pl-3"
                          component="div"
                          name="postalCode"
                          style={{ color: "red", fontSize: "12px" }}
                        />
                      </div>
                    </div>
                    <div className="flex flex-row w-full gap-3 items-center mb-10 mt-4">
                      <input
                        className="w-4 h-4"
                        id="primary_address"
                        type="checkbox"
                        onClick={() => {
                          setIsPrimary((prev) => !prev);
                        }}
                      />
                      <label htmlFor="primary_address">
                        Save as primary address
                      </label>
                    </div>
                    <div className="flex flex-row w-full gap-6 mb-20">
                      <button
                        onClick={() => modalHandler()}
                        className="flex-1 rounded-md border-2 border-gray-300 h-10 hover:border-green-500 hover:shadow-xl hover:bg-green-500 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 rounded-md border-2 border-gray-300 h-10 hover:border-green-500 hover:shadow-xl hover:bg-green-500 hover:text-white"
                      >
                        Save Address
                      </button>
                    </div>
                  </div>
                </div>
              </Form>
            </div>
          </>
        );
      }}
    </Formik>
  );
}

export default NewAddressModal;
