import React from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import MyQuestionCard from "./MyQuestionCard";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchMyQuestion } from "../../features/qna/questionSlice";

function MyQuestionModal() {
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const myQuestion = useSelector(
    (state) => state.questions.myQuestion.questionQuery
  )||[];
  const countQuestion = useSelector(
    (state) => state.questions.myQuestion?.countData?.[0]?.count
  );
  const lastPage = Math.floor(countQuestion / 3);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("DESC");

  const renderMyQuestion = () => {
    return myQuestion.map((question) => {
      return <MyQuestionCard key={question.idquestion} question={question} />;
    });
  };
  const nextPage = () => {
    let count = offset + 3;
    setOffset(count);
  };
  const searchHandler = (e) => {
    setOffset(0);
    setSearch(e.target.value);
  };
  const handleSortChange = (e) => {
    const selectedSort = e.target.value;
    setOffset(0);
    const updatedSort = selectedSort;
    setSort(updatedSort);
    dispatch(fetchMyQuestion(offset, search, updatedSort));
  };
  const backPage = () => {
    let count = offset - 3;
    if (count < 0) {
      count = 0;
    }
    setOffset(count);
  };
  useEffect(() => {
    dispatch(fetchMyQuestion(offset, search, sort));
  }, [offset, search, sort]);
  return (
    <div>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="border-2 border-green-300  font-bold py-2 px-4 rounded-md hover:bg-green-300 text-white"
        >
          MY QUESTION
        </button>
      ) : (
        <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
          <div className=" bg-white mx-4 p-5 border-2 border-emerald-800 rounded-lg  gap-2 flex flex-col shadow-2xl w-80 items-center lg:w-[40rem] lg:h-[30rem]">
            <div className="flex flex-col  gap-2 lg:flex-row">
              <input
                type="text"
                placeholder="Search Question"
                className="bg-gray-50 border border-green-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500  block w-40 h-10 lg:w-80 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 "
                onChange={searchHandler}
              />
              <select
                name="sort"
                id="sort"
                className=" bg-gray-50 border-green-300 rounded-md border-2 h-8 w-30 text-xs lg:h-10"
                onChange={handleSortChange}
              >
                <option value="DESC">Descending Date</option>
                <option value="ASC">Ascending Date</option>
              </select>
            </div>

            {renderMyQuestion()}
            <p className=" text-red-300 text-sm font-bold">
              *Question only can delete before 1 hour after created and not
              answered yet
            </p>
            <div>
              {offset > 0 ? (
                <button onClick={() => backPage()}>
                  {" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
                    />
                  </svg>
                </button>
              ) : (
                <></>
              )}
              {offset / 3 == lastPage ? (
                <></>
              ) : (
                <button onClick={() => nextPage()}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                    />
                  </svg>
                </button>
              )}
            </div>
            <button onClick={() => setOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyQuestionModal;
