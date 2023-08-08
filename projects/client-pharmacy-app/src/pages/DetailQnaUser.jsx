import axios from "axios";
import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { AUTH_TOKEN } from "../helpers/constant";
import { useDispatch, useSelector } from "react-redux";
import { setDetailQna } from "../features/qna/questionSlice";
import { Avatar } from "@chakra-ui/react";
import moment from "moment";

function DetailQnaUser() {
  const params = useParams();
  const dispatch = useDispatch();
  const token = localStorage.getItem(AUTH_TOKEN);
  const questions = useSelector((state) => state.questions.detailQna);
  const profilePicUser = questions.profile_image
    ? `${process.env.REACT_APP_API_PIC}/users/${questions.profile_image}`
    : "/default.jpg";

  const fetchDetailQuestion = async () => {
    try {
      let response = await axios.get(
        `${process.env.REACT_APP_API_BE}/qna/questions/${params.idquestion}`,
        { headers: { authorization: `Bearer ${token}` } }
      );

      dispatch(setDetailQna(response.data[0]));
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message,
      });
    }
  };

  useEffect(() => {
    fetchDetailQuestion();
  }, []);

  // console.log(moment(questions.answer_date).format());
  console.log(questions);

  return (
    <div className="w-4/5 lg:w-3/5 h-full mx-auto mt-11">
      <div className="">
        <Link to="/forum">
          <div className="flex gap-2 items-center text-color-green">
            <svg
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="w-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              ></path>
            </svg>
            <p className="font-bold text-lg">Back to Forum</p>
          </div>
        </Link>
        <p className="text-xl lg:text-3xl font-bold mt-11 mb-6">
          {questions.title}
        </p>
        <div className="flex justify-between my-6">
          <div className="flex gap-6">
            <Avatar src={profilePicUser} alt="" />
            <p className="font-bold text-base lg:text-xl">
              {questions.username}
            </p>
          </div>
          <div className="flex flex-col text-sm lg:text-base text-right gap-1 text-slate-500">
            <p>{moment(questions.date).format("DD-MM-YYYY")}</p>
            <p>{moment(questions.date).format("HH:mm:ss")}</p>
          </div>
        </div>
        <p>{questions.question}</p>
        <div className="border-2 my-6 p-2 lg:p-6 rounded-md">
          <p className="font-bold text-slate-400 mb-6 mt-2">dijawab oleh:</p>
          <div className="flex justify-between my-6">
            <div className="flex gap-4 lg:gap-6">
              <Avatar src={questions.admin_image} alt="" />
              <p className="font-bold text-base lg:text-xl">
                {questions.admin_name}
              </p>
            </div>
            <div className="flex flex-col text-sm lg:text-base text-right gap-1 text-slate-500">
              <p>{moment(questions.answer_date).format("DD-MM-YYYY")}</p>
              <p>{moment(questions.answer_date).format("HH:mm:ss")}</p>
            </div>
          </div>
          <div>
            <p>{questions.answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailQnaUser;
