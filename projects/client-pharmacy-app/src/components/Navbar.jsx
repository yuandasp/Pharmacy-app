import { Button } from "@chakra-ui/react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Avatar } from "@chakra-ui/react";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { setResetUser } from "../features/users/userSlice";
import Swal from "sweetalert2";
import { resetCart } from "../features/cart/cartSlice";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const myCart = useSelector((state) => state.cart.cart) || [];
  const user = useSelector((state) => state.user.user);
  const profilePic = user.profile_image
    ? `${process.env.REACT_APP_API_PIC}/users/${user.profile_image}`
    : "/default.jpg";

  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.clear();
    dispatch(resetCart());
    dispatch(
      setResetUser({
        iduser: 0,
        username: "",
        email: "",
        phone_number: "",
        fullname: "",
        gender: "",
        profile_image: "",
      })
    );
    Swal.fire({
      icon: "success",
      title: "Logout",
      text: "You already logout from Pharmacy Web",
    });
    navigate("/");
  };

  return (
    <div className="w-full h-20 bg-white flex justify-between px-5 lg:px-24 items-center text-color-green shadow-navbar border-b-gray-100 border-b-2">
      <div className="flex lg:justify-start items-center lg:gap-7">
        <Link to="/">
          <img
            src="assets/logo-pharmacy.png"
            alt=""
            className="logo-image lg:mr-6 hidden lg:block"
          />
        </Link>
        <p className="hidden lg:block">|</p>
        <Link to="/">
          <div className="mr-11 lg:mr-0">
            <p className="text-lg hover:text-green-800 font-bold cursor-pointer hidden lg:block">
              Home
            </p>
            <div className="w-8 text-color-green font-bold block lg:hidden">
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
                  d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                ></path>
              </svg>
            </div>
          </div>
        </Link>
        <Link to="/forum">
          <p className="text-lg hover:text-green-800 font-bold cursor-pointer hidden lg:block">
            Forum
          </p>
          <div className="w-8 text-color-green font-bold block lg:hidden">
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
                d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
              ></path>
            </svg>
          </div>
        </Link>
      </div>
      <div className="flex gap-11 lg:gap-7 items-center">
        <div className="w-8">
          <div
            className="relative hover:cursor-pointer"
            onClick={() => navigate("/cart")}
          >
            {myCart.length === 0 ? null : (
              <p className="absolute -top-[10px] text-sm -right-[10px] font-bold bg-green-600 text-white rounded-full w-[65%] text-center">
                {myCart.length}
              </p>
            )}
            <svg
              className="hover:fill-green-400"
              fill={"none"}
              stroke="#009b90"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              // xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              ></path>
            </svg>
          </div>
        </div>
        {token && user ? (
          <>
            <Menu>
              <MenuButton>
                <div className="flex items-center gap-4 ">
                  <Avatar size="sm" src={profilePic} />
                  <p className="font-bold hidden lg:block">
                    {user.username ? user.username : ""}
                  </p>
                </div>
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => navigate("/profile")}>
                  <div className="w-6 mr-4">
                    <svg
                      fill="none"
                      stroke="gray"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                    </svg>
                  </div>
                  <p className="text-black">Profile Info</p>
                </MenuItem>
                <MenuItem onClick={() => navigate("/orderlist")}>
                  <div className="w-6 mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="gray"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
                      />
                    </svg>
                  </div>
                  <p className="text-black">My Transaction</p>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <div className="w-6 mr-4">
                    <svg
                      fill="none"
                      stroke="gray"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                      ></path>
                    </svg>
                  </div>
                  <p className="text-black">Logout</p>
                </MenuItem>
              </MenuList>
            </Menu>
          </>
        ) : (
          <>
            <Link to={"/login"}>
              <Button className="border-button">
                <p>Login</p>
              </Button>
            </Link>
            <div className="hidden lg:block">
              <Link to={"/register"}>
                <Button className="button-primary">
                  <p className="text-sm">Register</p>
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
