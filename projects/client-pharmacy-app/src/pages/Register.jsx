import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { Button } from "@chakra-ui/react";
import InputComponent from "../components/Input";

function Register() {
  const [isLoading, setIsLoading] = useState(false);

  const registerSchema = Yup.object().shape({
    username: Yup.string().required("This field is required"),
    email: Yup.string()
      .email("Wrong email format")
      .required("This field is required"),
    password: Yup.string()
      .required("This field is required")
      .min(8, "Password too short"),
    phone_number: Yup.number()
      .min(10, "Must be more than 10 characters")
      .required("This field is requried"),
  });

  const registerUser = async (value, actions) => {
    try {
      setIsLoading(true);
      let response = await axios.post(
        `${process.env.REACT_APP_API_BE}/auth/register`,
        value
      );

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: response.data.message,
        footer: "",
      });

      setIsLoading(false);
      actions.resetForm({
        username: "",
        email: "",
        password: "",
        phone_number: "",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response.data?.message || "Something went wrong!!",
      });
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Formik
        initialValues={{
          username: "",
          email: "",
          password: "",
          phone_number: "",
        }}
        validationSchema={registerSchema}
        onSubmit={(value, actions) => {
          registerUser(value, actions);
        }}
      >
        {(props) => {
          return (
            <>
              <div className="flex min-h-screen h-full">
                <div className="w-4/6 hidden lg:flex items-center justify-center register-page relative">
                  <div className=" absolute left-6 top-6 ">
                    <Link to={"/"}>
                      <img
                        src="./assets/logo-pharmacy.png"
                        alt="pharmacy"
                        className="logo-image"
                      />
                    </Link>
                  </div>
                  <img
                    src="./assets/register-pict-green.svg"
                    width="70%"
                    alt=""
                  />
                </div>
                <div className="w-full lg:w-3/6 flex justify-center flex-col p-14">
                  <Link to={"/"}>
                    <div className="flex items-center gap-2 text-color-green mb-9">
                      <div className="w-7">
                        <svg
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
                          ></path>
                        </svg>
                      </div>
                      <p>Back to home</p>
                    </div>
                  </Link>
                  <div>
                    <p className="text-3xl font-bold mb-2">
                      Welcome to Pharmacy App!
                    </p>
                    <p className="text-xl text-slate-500">
                      Create your account
                    </p>
                  </div>
                  <div>
                    <Form className="mt-8 space-y-6" action="#" method="POST">
                      <input
                        type="hidden"
                        name="remember"
                        defaultValue="true"
                      />
                      <div className="rounded-md">
                        <div className="my-6">
                          <label
                            htmlFor="username"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Username
                          </label>
                          <div className="mt-2">
                            <Field
                              id="username"
                              name="username"
                              type="text"
                              required
                              className="shadow-sm pl-4 relative block w-full rounded-md border-0 py-6 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-900 sm:text-sm sm:leading-6"
                              placeholder="Username"
                              autoComplete="username"
                              component={InputComponent}
                              icon={
                                <svg
                                  fill="none"
                                  stroke="gray"
                                  strokeWidth="1.5"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                  aria-hidden="true"
                                  className="p-2 pt-4"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                                  ></path>
                                </svg>
                              }
                            />
                          </div>
                          <ErrorMessage
                            component="div"
                            name="username"
                            style={{ color: "red", fontSize: "12px" }}
                          />
                        </div>
                        <div className="my-6">
                          <label
                            htmlFor="email-address"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Email address
                          </label>
                          <div className="mt-2">
                            <Field
                              id="email"
                              name="email"
                              type="email"
                              autoComplete="email"
                              required
                              className="shadow-sm pl-4 relative block w-full rounded-md border-0 py-6 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-900 sm:text-sm sm:leading-6"
                              placeholder="Email"
                              component={InputComponent}
                              icon={
                                <svg
                                  fill="none"
                                  stroke="gray"
                                  strokeWidth="1.5"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                  aria-hidden="true"
                                  className="p-2 pt-4"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                                  ></path>
                                </svg>
                              }
                            />
                          </div>
                          <ErrorMessage
                            component="div"
                            name="email"
                            style={{ color: "red", fontSize: "12px" }}
                          />
                        </div>
                        <div className="my-6">
                          <label
                            htmlFor="phone_number"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Phone Number
                          </label>
                          <div className="mt-2">
                            <Field
                              id="phone_number"
                              name="phone_number"
                              type="text"
                              required
                              className="shadow-sm pl-4 relative block w-full rounded-md border-0 py-6 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-900 sm:text-sm sm:leading-6"
                              placeholder="Phone Number"
                              component={InputComponent}
                              icon={
                                <svg
                                  fill="none"
                                  stroke="gray"
                                  strokeWidth="1.5"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                  aria-hidden="true"
                                  className="p-2 pt-4"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                                  ></path>
                                </svg>
                              }
                            />
                          </div>
                          <ErrorMessage
                            component="div"
                            name="phone_number"
                            style={{ color: "red", fontSize: "12px" }}
                          />
                        </div>
                        <div className="my-6">
                          <label
                            htmlFor="password"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                          >
                            Password
                          </label>
                          <div className="mt-2">
                            <Field
                              id="password"
                              name="password"
                              type="password"
                              required
                              className="shadow-sm pl-4 relative block w-full rounded-md border-0 py-6 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-900 sm:text-sm sm:leading-6"
                              placeholder="Password"
                              autoComplete="new-password"
                              component={InputComponent}
                              icon={
                                <svg
                                  fill="none"
                                  stroke="gray"
                                  strokeWidth="1.5"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                  aria-hidden="true"
                                  className="p-2 pt-4"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                                  ></path>
                                </svg>
                              }
                            />
                          </div>
                          <ErrorMessage
                            component="div"
                            name="password"
                            style={{ color: "red", fontSize: "12px" }}
                          />
                        </div>
                      </div>
                      <div>
                        <Button
                          isLoading={isLoading}
                          type="submit"
                          className="w-full rounded-md py-6 text-white button-primary"
                        >
                          <p className="text-lg ">Create account</p>
                        </Button>

                        <div className="flex flex-wrap gap-2 items-end justify-end my-4">
                          <p className="text-color-green text-end text-base lg:text-md">
                            Already have an account?
                          </p>
                          <Link to={"/login"}>
                            <p className="text-color-green text-end font-bold text-md lg:text-lg hover:text-cyan-900">
                              Log in
                            </p>
                          </Link>
                        </div>
                      </div>
                    </Form>
                  </div>
                </div>
              </div>
            </>
          );
        }}
      </Formik>
    </div>
  );
}

export default Register;
