import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchUser } from "../features/users/userSlice";
import { useSelector } from "react-redux";
import UploadModal from "../components/profiling/UploadModal";
import ProfileCard from "../components/profiling/ProfileCard";
import AddressCard from "../components/profiling/AddressCard";
import EditProfile from "../components/profiling/EditProfile";
import { useState } from "react";
import { getCity, getProvince } from "../features/rajaongkir/rajaongkirSlice";
import {
  fetchPrimaryAddress,
  fetchProvince,
} from "../features/users/addressSlice";

function Profile() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    dispatch(fetchPrimaryAddress());
  }, []);

  const profilePic = user.profile_image
    ? `${process.env.REACT_APP_API_PIC}/users/${user.profile_image}`
    : "/default.jpg";
  return (
    <div className="lg:flex lg:flex-row bg-white flex flex-col   gap-4 lg:gap-32 py-4 px-2 lg:px-12">
      <div className=" lg:h-60  flex justify-center items-center rounded-full">
        <h1 className=" font-extrabold px-6 text-3xl  mb-6 bg-gradient-to-r from-lime-300 via-green-400 to-green-700 bg-clip-text text-transparent">
          Profile Info
        </h1>
      </div>
      <div className=" py-8">
        <div>
          {edit ? (
            <EditProfile user={user} setEdit={setEdit} />
          ) : (
            <ProfileCard
              user={user}
              setEdit={setEdit}
              profilePic={profilePic}
            />
          )}
        </div>
      </div>
      <div className="py-8">
        <AddressCard />
      </div>
    </div>
  );
}

export default Profile;
