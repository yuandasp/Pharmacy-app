import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { Button, Checkbox } from "@chakra-ui/react";
import InputComponent from "../../components/Input";
import { ADMIN, AUTH_TOKEN } from "../../helpers/constant";
import { useDispatch } from "react-redux";
import { setAdmin } from "../../features/admin/adminSlice";

function LoginAdmin() {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const loginAdminSchema = Yup.object().shape({
    email: Yup.string()
      .email("Wrong email format")
      .required("This field is required"),
    password: Yup.string()
      .required("This field is required")
      .min(8, "Password too short"),
  });

  const loginUserAdmin = async (value, actions) => {
    try {
      setIsLoading(true);
      let response = await axios.post(
        `${process.env.REACT_APP_API_BE}/auth/admin/login`,
        value
      );

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: response.data.message,
      });

      setIsLoading(false);
      if (response.data?.token) {
        localStorage.setItem(AUTH_TOKEN, response.data?.token);
        localStorage.setItem(ADMIN, JSON.stringify(response.data?.data));
        dispatch(setAdmin(response.data?.data));
        navigate("/admin/dashboard");
      }
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
      <div>
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={loginAdminSchema}
          onSubmit={(value, actions) => {
            loginUserAdmin(value, actions);
          }}
        >
          {(props) => {
            return (
              <>
                <div className="flex min-h-screen h-full">
                  <div className="w-4/6 hidden lg:flex items-center justify-center register-page relative">
                    <div className="absolute left-6 top-6 ">
                      <img
                        src="../assets/logo-pharmacy.png"
                        alt="pharmacy"
                        className="logo-image"
                      />
                    </div>
                    <img src="../assets/admin-picture.svg" width="70%" alt="" />
                  </div>
                  <div className="w-full lg:w-3/6 flex justify-center flex-col p-14">
                    <p className="text-2xl text-center lg:text-left lg:text-3xl font-bold mb-2">
                      Log in as admin
                    </p>

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
                                className="pl-4 shadow-sm relative block w-full rounded-md border-0 py-6 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-900 sm:text-sm sm:leading-6 "
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

                          <div className="mt-6 mb-2">
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
                                type={show ? "text" : "password"}
                                required
                                className="pl-4 shadow-sm relative block w-full rounded-md border-0 py-6 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-900 sm:text-sm sm:leading-6"
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
                        <Checkbox
                          style={{
                            background: "transparent",
                            color: "black",
                            marginTop: "0px",
                          }}
                          onChange={(event) => setShow(event.target.checked)}
                        >
                          <p style={{ fontSize: "14px" }}>Show Password</p>
                        </Checkbox>
                        <div>
                          <Button
                            isLoading={isLoading}
                            type="submit"
                            className="w-full rounded-md py-6 text-white button-primary"
                          >
                            <p className="text-lg ">Login as admin</p>
                          </Button>
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
    </div>
  );
}

export default LoginAdmin;
