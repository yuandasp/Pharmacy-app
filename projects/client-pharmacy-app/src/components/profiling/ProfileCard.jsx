import React, { useState } from "react";
import UploadModal from "./UploadModal";

function ProfileCard({ user, setEdit, profilePic }) {
  const date = new Date(user.birthdate);
  const dateTime =
    date.getFullYear() +
    "/" +
    ("00" + (date.getMonth() + 1)).slice(-2) +
    "/" +
    ("00" + date.getDate()).slice(-2) +
    " ";
  return (
    <div className="px-4">
      <div className="border-b pb-4 mb-4">
        <div className="relative">
          <h1 className="font-bold text-xl mb-2 lg:text-2xl">
            Profile Picture
          </h1>
          <div className="flex gap-3">
            <img src={profilePic} alt="" className="w-20 h-20 rounded-full" />
            <UploadModal />
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row lg:gap-28 lg:border-b">
        <div className="border-b pb-4 mb-4 lg:border-b-0">
          <div>
            <h1 className="font-bold text-xl mb-2 lg:text-2xl">Username</h1>
            <p>{user.username}</p>
          </div>
        </div>
        <div className="border-b pb-4 mb-4 lg:border-b-0">
          <div>
            <h1 className="font-bold text-xl mb-2 lg:text-2xl">Full Name</h1>
            <p>{user.fullname}</p>
          </div>
        </div>
      </div>
      <div className="border-b pb-4 mb-4 lg:py-4">
        <div>
          <h1 className="font-bold text-xl mb-2 lg:text-2xl">Email</h1>
          <p>{user.email}</p>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row lg:gap-36 lg:border-b">
        <div className="border-b pb-4 mb-4 lg:border-b-0">
          <div>
            <h1 className="font-bold text-xl mb-2 lg:text-2xl">Gender</h1>
            <p>{user.gender}</p>
          </div>
        </div>
        <div className="border-b pb-4 mb-4 lg:border-b-0">
          <div>
            <h1 className="font-bold text-xl mb-2 lg:text-2xl">
              Date of Birth
            </h1>
            <p>{dateTime}</p>
          </div>
        </div>
      </div>
      <div className="border-b pb-4 mb-4 lg:py-4">
        <div>
          <h1 className="font-bold text-xl mb-2 lg:text-2xl">Phone Number</h1>
          <p>{user.phone_number}</p>
        </div>
      </div>
      <div className=" pb-4 mb-4 items-center justify-center flex  ">
        <button
          className=" border-2 border-green-300  font-bold h-10 px-2 rounded-md hover:bg-emerald-500 hover:text-white text-emerald-500"
          onClick={() => setEdit(true)}
        >
          Edit Profile Info
        </button>
      </div>
    </div>
  );
}

export default ProfileCard;
