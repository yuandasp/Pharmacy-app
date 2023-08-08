import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function Verification() {
  let { token } = useParams();
  const navigate = useNavigate();

  const tokenVerification = async () => {
    try {
      if (token) {
        const response = await axios.post(
          `${process.env.REACT_APP_API_BE}/auth/verification`,
          {},
          { headers: { authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: response.data.message,
            footer: "",
          });
          navigate("/");
        }
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response.data?.message || "Something went wrong!!",
      });
    }
  };
  useEffect(() => {
    tokenVerification();
  }, []);

  return <div></div>;
}

export default Verification;
