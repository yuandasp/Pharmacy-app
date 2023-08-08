import React from "react";

function Footer() {
  return (
    <div className="text-green-900">
      <div className="flex w-full text-sm  bg-white justify-between px-5 lg:px-24 py-11 flex-wrap border-t-2">
        <div className="flex flex-col mb-4">
          <img
            src="./assets/logo-pharmacy.png"
            alt=""
            className="logo-image mb-4"
          />
          <div className="flex gap-2">
            <svg
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="w-11"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
              ></path>
            </svg>
            <div>
              <p className="font-bold text-base">Email</p>
              <p>pharmacy@mail.co</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 mb-4">
          <p>About Us</p>
          <p>FAQ</p>
          <p>Terms & Conditions</p>
        </div>
        <div className="flex flex-col gap-4 mb-4">
          <p>Blog</p>
          <p>Carier</p>
          <p>How to shop</p>
        </div>
        <div className="mr-9 flex flex-col gap-4">
          <p className="text-xl font-bold">Follow us</p>
          <div className="flex gap-2">
            <img src="./assets/logo-fb.png" alt="facebook" width="24px" />
            <p>Facebook</p>
          </div>
          <div className="flex gap-2">
            <img src="./assets/logo-ig.png" alt="instagram" width="24px" />
            <p>Instagram</p>
          </div>
        </div>
      </div>
      <div className="background-color-green w-full flex justify-center items-center py-2">
        <p className="text-white">Copyright Pharmacy 2023</p>
      </div>
    </div>
  );
}

export default Footer;
