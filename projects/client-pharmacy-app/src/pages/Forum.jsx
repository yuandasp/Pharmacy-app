import React, { useState } from "react";
import QuestionModal from "../components/qna/QuestionModal";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  fetchAllQuestions,
  fetchMyQuestion,
  loadMoreQuestion,
} from "../features/qna/questionSlice";
import MyQuestionModal from "../components/qna/MyQuestionModal";
import { useSelector } from "react-redux";
import QuestionsCard from "../components/qna/QuestionsCard";
import { useRef } from "react";

function Forum() {
  const dispatch = useDispatch();
  const allQuestions = useSelector((state) => state.questions.allQuestion);
  let countData = useSelector((state) => state.questions.count.count);
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("DESC");
  const shouldLog = useRef(true);

  countData = parseInt(countData);
  const pages = Math.floor(countData / 6);
  const renderQuestions = () => {
    return allQuestions.map((question) => {
      return <QuestionsCard key={question.idquestion} question={question} />;
    });
  };
  const searchHandler = (e) => {
    shouldLog.current = true;
    setOffset(0);
    setSearch(e.target.value);
  };

  const nextData = () => {
    shouldLog.current = true;
    let nextOffset = offset + 6;
    setOffset(nextOffset);
  };
  const prevData = () => {
    shouldLog.current = true;
    let prevOffset = offset - 6;
    setOffset(prevOffset);
  };
  const handleSortChange = (e) => {
    shouldLog.current = true;
    const selectedSort = e.target.value;
    setOffset(0);
    const updatedSort = selectedSort;
    setSort(updatedSort);
  };
  useEffect(() => {
    if (shouldLog.current) {
      shouldLog.current = false;
      dispatch(fetchAllQuestions(offset, search, sort));
    }
  }, [offset, search, sort]);
  return (
    <div className=" bg-zinc-50 flex flex-col  justify-center items-center ">
      <section
        className="bg-center bg-no-repeat bg-gray-500 bg-blend-multiply w-full"
        style={{ backgroundImage: `url('/doctor.jpg')` }}
      >
        <div className="px-4 mx-auto max-w-screen-xl text-center py-24 lg:py-56">
          <h1 className=" h-24  mb-4 text-4xl font-extrabold tracking-tight leading-none border-green-400 text-transparent bg-gradient-to-r from-lime-200 via-emerald-300 to-green-400 bg-clip-text md:text-5xl lg:text-6xl">
            Got Something Troubling You
          </h1>
          <p className="mb-8 text-lg font-normal text-gray-300 lg:text-xl sm:px-16 lg:px-48">
            Here Our Team Are Glady to Help You Solve The Problem
          </p>
          <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
            <QuestionModal />
            <MyQuestionModal />
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-5 justify-center items-center w-full px-11">
        <div className="flex justify-center lg:justify-between items-center w-full lg:w-[44rem] h-full my-11 bg-gradient-to-r from-green-500 via-emerald-300 to-lime-300 rounded-2xl">
          <div className="flex flex-wrap flex-col mx-auto my-6">
            <h2 className="text-2xl lg:text-4xl font-extrabold text-white text-center">
              FORUM DISCUSSION
            </h2>
            <p className="my-4 text-lg text-white text-center">
              Some People Might Already Had Same Problem
            </p>
            <div className=" flex flex-wrap lg:flex-nowrap items-center justify-center gap-3 ">
              <div>
                <input
                  type="text"
                  placeholder="Search Question"
                  className="bg-gray-50 border border-green-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full h-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 "
                  onChange={(e) => searchHandler(e)}
                />
              </div>
              <select
                name="sort"
                id="sort"
                className=" bg-gray-50 border-green-300 rounded-md border-2 h-10 text-gray-900 text-sm "
                onChange={(e) => handleSortChange(e)}
              >
                <option>Sort By Date</option>
                <option value="DESC">Descending Date</option>
                <option value="ASC">Ascending Date</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full">{renderQuestions()}</div>
        <div className="flex flex-row mx-auto my-3">
          {offset == 0 ? (
            <></>
          ) : (
            <button
              type="button"
              className="bg-emerald-600 text-white rounded-l-md border-r border-gray-100 py-2 hover:bg-red-700 hover:text-white px-3"
              onClick={() => prevData()}
            >
              <div className="flex flex-row align-middle">
                <svg
                  className="w-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <p className="ml-2">Prev</p>
              </div>
            </button>
          )}
          {offset / 6 == pages ? (
            <></>
          ) : (
            <button
              type="button"
              className="bg-emerald-600 text-white rounded-r-md py-2 border-l border-gray-200 hover:bg-red-700 hover:text-white px-3"
              onClick={() => nextData()}
            >
              <div className="flex flex-row align-middle">
                <span className="mr-2">Next</span>
                <svg
                  className="w-5 ml-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Forum;
