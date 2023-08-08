import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function QuestionsCard({ question }) {
  const navigate = useNavigate();
  const date = new Date(question.date);
  const dateTime =
    date.getFullYear() +
    "/" +
    ("00" + (date.getMonth() + 1)).slice(-2) +
    "/" +
    ("00" + date.getDate()).slice(-2) +
    " ";
  const profilePic = question.profile_image
    ? `${process.env.REACT_APP_API_PIC}/users/${question.profile_image}`
    : "/default.jpg";

  const handlePageDetaiQna = async (idquestion) => {
    try {
      navigate(`/forum/${idquestion}`);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message,
      });
    }
  };

  return (
    <div className=" flex flex-col w-full lg:w-[44rem] px-8 py-4 mx-auto bg-white rounded-lg shadow-md dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <span className="text-sm font-light text-gray-600 dark:text-gray-400">
          {dateTime}
        </span>
      </div>
      <div className="mt-2">
        <h1 className="text-2xl font-bold text-gray-700 dark:text-white hover:text-gray-600 dark:hover:text-gray-200 hover:underline">
          {question.title}
        </h1>
        <div className=" max-h-16 lg:max-h-30 py-2 break-normal mb-5">
          <p className="mt-2 text-gray-600 dark:text-gray-300 break-normal line-clamp-2 ">
            {question.question}
          </p>
        </div>
      </div>

      <div className="mt-auto">
        <div className="flex items-center justify-between">
          <button
            onClick={() => handlePageDetaiQna(question.idquestion)}
            className="text-emerald-500 hover:underline"
          >
            Read More ⟶
          </button>
          <div className="flex items-center">
            <img
              src={profilePic}
              alt="Author Photo"
              className="hidden object-cover w-10 h-10 mx-4 rounded-full lg:block"
            />
            <a className="hidden lg:block font-bold text-gray-700 cursor-pointer dark:text-gray-200">
              {question.username}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionsCard;
