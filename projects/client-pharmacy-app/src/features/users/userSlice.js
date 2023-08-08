import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Swal from "sweetalert2";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {
      iduser: 0,
      username: "",
      email: "",
      phone_number: "",
      fullname: "",
      gender: "",
      profile_image: "",
    },
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setChosenAddress: (state, action) => {
      state.chosenAddress = action.payload;
    },
    resetPrimary: (state, action) => {
      state.user.address.map((val) => {
        return (val.isprimary = false);
      });
    },
    setResetUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const {
  setUser,
  setProvinces,
  setChosenAddress,
  resetPrimary,
  setResetUser,
} = userSlice.actions;
export default userSlice.reducer;

export function fetchUser() {
  const userId = JSON.parse(localStorage.getItem("user")).iduser;
  return async (dispatch) => {
    let response = await axios.get(
      `${process.env.REACT_APP_API_BE}/users/profiles/${userId}`
    );
    dispatch(setUser(response.data));
  };
}

export function uploadPicture(image, setOpen) {
  const userId = JSON.parse(localStorage.getItem("user")).iduser;
  return async (dispatch) => {
    try {
      const file = new FormData();
      file.append("file", image);

      let response = await axios.post(
        `${process.env.REACT_APP_API_BE}/users/profiles/upload-picture/${userId}`,
        file
      );
      Swal.fire(`${response.data.message}`, "", "success");
      setOpen(false);
      dispatch(fetchUser());
    } catch (error) {
      if (error.response) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${error.response.data.error}`,
        });
      } else if (error.message) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${error.message}`,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "An error occurred while uploading the picture.",
        });
      }
    }
  };
}

export function editProfile(username, fullname, email, gender, birthdate) {
  const userId = JSON.parse(localStorage.getItem("user")).iduser;
  return async (dispatch) => {
    let response = await axios.post(
      `${process.env.REACT_APP_API_BE}/users/profiles/edit-profiles/${userId}`,
      { username, fullname, email, gender, birthdate }
    );
    Swal.fire(`${response.data.message}`, "", "success");
    dispatch(fetchUser());
  };
}
