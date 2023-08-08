import axios from "axios";
import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addMyQuestion } from "../../features/qna/questionSlice";

function QuestionModal() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [title, setTitle] = useState("");

  const inputTitle = (e) => {
    setTitle(e.target.value);
  };
  const inputQuestion = (e) => {
    setQuestion(e.target.value);
  };
  const saveHandler = async (question, title, setOpen) => {
    const userId = JSON.parse(localStorage.getItem("user")).iduser;
    dispatch(addMyQuestion(userId, question, title, setOpen));
  };
  const isFormValid = title.trim() !== "" && question.trim() !== "";

  return (
    <div>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="border-2 border-green-300  font-bold py-2 px-4 rounded-md hover:bg-green-300 text-white"
        >
          ASK QUESTION
        </button>
      ) : (
        <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center ">
          <div className=" bg-white mx-4 p-2 rounded-xl gap-2 flex flex-col shadow-lg w-80  lg:w-[40rem]">
            <div className="bg-emerald-800">
              <h1 className="text-2xl text-white">Ask Question</h1>
            </div>
            <div>
              <div className="relative mb-3" data-te-input-wrapper-init>
                <input
                  type="text"
                  className=" border-4 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg  border-emerald-800 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  id="exampleFormControlInput1"
                  placeholder="Title"
                  onChange={(e) => inputTitle(e)}
                  required
                />
              </div>
              <textarea
                onChange={(e) => inputQuestion(e)}
                className=" h-44 bg-gray-50  w-full border-4 border-emerald-500 rounded-lg"
                required
              ></textarea>
            </div>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => saveHandler(question, title, setOpen)}
                disabled={!isFormValid}
                className=" border-2 border-emerald-800 px-3 py-1 rounded-lg"
              >
                Save
              </button>
              <button
                onClick={() => setOpen(false)}
                className="border-2 border-emerald-800 px-3 py-1 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuestionModal;
