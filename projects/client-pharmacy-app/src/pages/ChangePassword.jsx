import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { Button, Checkbox } from "@chakra-ui/react";
import { AUTH_TOKEN } from "../helpers/constant";

function ChangePassword() {
  const params = useParams();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  let authToken = localStorage.getItem(AUTH_TOKEN);

  const shapeYup = {
    password: Yup.string()
      .required("This field is required")
      .min(8, "Password too short"),
    newPassword: Yup.string()
      .required("This field is required")
      .min(8, "Password too short"),
    repeatPassword: Yup.string()
      .required("This field is required")
      .oneOf(
        [Yup.ref("newPassword"), null],
        "Password must match with new password"
      ),
  };

  if (location.pathname.includes("/reset-password")) {
    delete shapeYup.password;
    authToken = params.token;
  }

  const newPasswordSchema = Yup.object().shape(shapeYup);

  const changePassword = async (value, actions) => {
    try {
      setIsLoading(true);
      let response = await axios.post(
        `${process.env.REACT_APP_API_BE}/auth/change-password`,
        value,
        {
          headers: {
            authorization: `Bearer ${authToken}`,
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Success change your password",
        text: response.data?.message,
      });
      setIsLoading(false);
      localStorage.clear();
      navigate("/login");
    } catch (error) {
      setIsLoading(false);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message || "Something went wrong!!",
      });
    }
  };

  return (
    <div>
      <div>
        <Formik
          initialValues={{
            newPassword: "",
          }}
          validationSchema={newPasswordSchema}
          onSubmit={(value) => {
            changePassword(value);
          }}
        >
          {(props) => {
            return (
              <>
                <div className="flex min-h-screen h-full">
                  <div className="w-full items-center flex justify-center flex-col p-11">
                    <div>
                      <p className="text-3xl font-bold mb-2 text-center">
                        Change Password
                      </p>
                      <p className="text-xl text-slate-500">
                        Secure your password by not telling to anybody!
                      </p>
                    </div>
                    <div className="w-full lg:w-1/2">
                      <Form className="mt-8 space-y-6" action="#" method="POST">
                        <input
                          type="hidden"
                          name="remember"
                          defaultValue="true"
                        />
                        {location.pathname.includes("/change-password") && (
                          <div className="rounded-md">
                            <div className="my-6">
                              <label
                                htmlFor="Current Password"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              >
                                Current Password
                              </label>
                              <div className="mt-2">
                                <Field
                                  id="password"
                                  name="password"
                                  type={show ? "text" : "password"}
                                  required
                                  className="shadow-sm relative block w-full rounded-md border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-900 sm:text-sm sm:leading-6"
                                />
                              </div>
                              <ErrorMessage
                                component="div"
                                name="password"
                                style={{ color: "red", fontSize: "12px" }}
                              />
                            </div>
                          </div>
                        )}
                        <div className="rounded-md">
                          <div className="my-6">
                            <label
                              htmlFor="New Password"
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                              New Password
                            </label>
                            <div className="mt-2">
                              <Field
                                id="newPassword"
                                name="newPassword"
                                type={show ? "text" : "password"}
                                required
                                className="shadow-sm relative block w-full rounded-md border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-900 sm:text-sm sm:leading-6"
                              />
                            </div>
                            <ErrorMessage
                              component="div"
                              name="newPassword"
                              style={{ color: "red", fontSize: "12px" }}
                            />
                          </div>
                        </div>
                        <div className="rounded-md">
                          <div className="my-6">
                            <label
                              htmlFor="Repeat New Password"
                              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                              Repeat New Password
                            </label>
                            <div className="mt-2">
                              <Field
                                id="repeatPassword"
                                name="repeatPassword"
                                type={show ? "text" : "password"}
                                required
                                className="shadow-sm relative block w-full rounded-md border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-900 sm:text-sm sm:leading-6"
                              />
                            </div>
                            <ErrorMessage
                              component="div"
                              name="repeatPassword"
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
                            <p className="text-lg ">Save New Password</p>
                          </Button>

                          <div className="flex flex-wrap gap-2 items-end justify-end my-4">
                            <Link to={"/"}>
                              <p className="text-color-green text-end font-bold text-md lg:text-lg hover:text-cyan-900">
                                Cancel
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
    </div>
  );
}

export default ChangePassword;
