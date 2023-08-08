import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Swal from "sweetalert2";

export const questionSlice = createSlice({
  name: "questions",
  initialState: {
    myQuestion: [],
    allQuestion: [],
    count: {
      count: "",
    },
    detailQna: [],
  },
  reducers: {
    setMyQuestion: (state, action) => {
      state.myQuestion = action.payload;
    },
    removeMyQuestion: (state, action) => {
      const deleteQuestion = action.payload;
      state.myQuestion = state.myQuestion.filter(
        (question) => question.idquestion !== deleteQuestion
      );
    },
    setAllQuestion: (state, action) => {
      state.allQuestion = action.payload;
    },
    setMore: (state, action) => {
      state.allQuestion.push(...action.payload);
    },
    setCount: (state, action) => {
      state.count = action.payload;
    },
    setDetailQna: (state, action) => {
      state.detailQna = action.payload;
    },
  },
});

export const {
  setMyQuestion,
  removeMyQuestion,
  setAllQuestion,
  setMore,
  setCount,
  setDetailQna,
} = questionSlice.actions;
export default questionSlice.reducer;

export function fetchMyQuestion(offset, search, sort) {
  const userId = JSON.parse(localStorage.getItem("user")).iduser;
  return async (dispatch) => {
    let response = await axios.get(
      `${process.env.REACT_APP_API_BE}/qna/questions/my-question/${userId}?offset=${offset}&search=${search}&sort=${sort}`
    );
    dispatch(setMyQuestion(response.data));
  };
}

export function deleteMyQuestion(id) {
  let offset = 0;
  let search = "";
  let sort = "DESC";
  return async (dispatch) => {
    let response = await axios.delete(
      `${process.env.REACT_APP_API_BE}/qna/questions/remove-question/${id}`
    );
    Swal.fire(`${response.data.message}`, "", "success");
    dispatch(removeMyQuestion(id));
    dispatch(fetchMyQuestion(offset, search, sort));
  };
}

export function addMyQuestion(userId, question, title, setOpen) {
  return async (dispatch) => {
    let response = await axios.post(
      `${process.env.REACT_APP_API_BE}/qna/questions/add-question/${userId}`,
      { question, title }
    );
    Swal.fire(`${response.data.message}`, "", "success");
    setOpen(false);
  };
}

export function fetchAllQuestions(offset, search, sort) {
  return async (dispatch) => {
    let response = await axios.get(
      `${process.env.REACT_APP_API_BE}/qna/questions/all-questions?offset=${offset}&search=${search}&sort=${sort}`
    );
    dispatch(setAllQuestion(response.data.questionQuery));
    dispatch(setCount(response.data.countData[0]));
  };
}
export function loadMoreQuestion(offset, search, sort) {
  return async (dispatch) => {
    let response = await axios.get(
      `${process.env.REACT_APP_API_BE}/qna/questions/all-questions?offset=${offset}&search=${search}&sort=${sort}`
    );
    dispatch(setMore(response.data));
  };
}
