import React from "react";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch } from "react-redux";
import { editProfile } from "../../features/users/userSlice";
import Swal from "sweetalert2";

function EditProfile({ user, setEdit }) {
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState(new Date(user.birthdate));
  const [username, setUsername] = useState(user.username);
  const [fullname, setFullname] = useState(user.fullname);
  const [email, setEmail] = useState(user.email);
  const [gender, setGender] = useState(user.gender);
  const [emailError, setEmailError] = useState("");

  const saveEdit = async (username, fullname, email, gender, birthdate) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to change your profile",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, change it!",
    });
    if (result.isConfirmed) {
      dispatch(editProfile(username, fullname, email, gender, birthdate));
      setEdit(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleEmailBlur = () => {
    if (!email.includes("@")) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }
  };

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:gap-20 lg:border-b">
        <div className="border-b pb-4 mb-4 lg:border-b-0">
          <div>
            <h1 className="font-bold text-xl mb-2">User Name</h1>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-gray-50 border-green-300 rounded-md border-2 h-10"
            />
          </div>
        </div>
        <div className="border-b pb-4 mb-4 lg:border-b-0">
          <div>
            <h1 className="font-bold text-xl mb-2">Full Name</h1>
            <input
              type="text"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              className="bg-gray-50 border-green-300 rounded-md border-2 h-10"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row lg:gap-36 lg:border-b lg:pt-2">
        <div className="border-b pb-4 mb-4 lg:border-b-0">
          <div>
            <h1 className="font-bold text-xl mb-2">Gender</h1>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="bg-gray-50 border-green-300 rounded-md border-2 h-10"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>
        <div className="border-b pb-4 mb-4 lg:border-b-0">
          <div>
            <h1 className="font-bold text-xl mb-2">Birth Date</h1>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              peekNextMonth
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              className="bg-gray-50 border-green-300 rounded-md border-2 h-10"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row lg:gap-36 lg:border-b lg:pt-2">
        <div className="border-b pb-4 mb-4 lg:border-b-0">
          <div>
            <h1 className="font-bold text-xl mb-2">Email</h1>
            <input
              type="text"
              value={email}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              className="bg-gray-50 border-green-300 rounded-md border-2 h-10"
            />
            {emailError && <p className="text-red-500">{emailError}</p>}
          </div>
        </div>
      </div>
      <div className="flex gap-3 items-center justify-center py-3">
        <button
          className="border-2 border-green-300  font-bold py-2 px-4 rounded-md hover:bg-emerald-500 hover:text-white text-emerald-500"
          onClick={() => saveEdit(username, fullname, email, gender, startDate)}
        >
          Save
        </button>
        <button
          className="border-2 border-green-300  font-bold py-2 px-4 rounded-md hover:bg-emerald-500 hover:text-white text-emerald-500"
          onClick={() => setEdit(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default EditProfile;
