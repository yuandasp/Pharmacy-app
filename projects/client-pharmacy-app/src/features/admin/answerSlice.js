import { createSlice } from "@reduxjs/toolkit";

export const answerSlice = createSlice({
  name: "answer",
  initialState: {
    allUserQuestion: [],
    detailUserQuestion: [],
  },
  reducers: {
    setAllUserQuestion: (state, action) => {
      state.allUserQuestion = action.payload;
    },
    setDetailUserQuestion: (state, action) => {
      state.detailUserQuestion = action.payload;
    },
  },
});

export const { setAllUserQuestion, setDetailUserQuestion } =
  answerSlice.actions;
export default answerSlice.reducer;
