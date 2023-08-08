import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { AUTH_TOKEN } from "../../helpers/constant";
import { useDispatch, useSelector } from "react-redux";
import { setDetailUserQuestion } from "../../features/admin/answerSlice";
import Sidebar from "../../components/admin/Sidebar";
import { Button, Divider } from "@chakra-ui/react";
import moment from "moment";

function DetailUserQuestion() {
  const params = useParams();
  const dispatch = useDispatch();
  const token = localStorage.getItem(AUTH_TOKEN);
  const detailQuestion = useSelector(
    (state) => state.answers.detailUserQuestion
  );
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formAnswer, setFormAnswer] = useState({ answer: "" });
  const [onOpenAnswerModal, setOnOpenAnswerModal] = useState(false);

  const fetchDetailUserQuestion = async () => {
    try {
      let response = await axios.get(
        `${process.env.REACT_APP_API_BE}/admin/qna/${params.idquestion}`,
        { headers: { authorization: `Bearer ${token}` } }
      );

      dispatch(setDetailUserQuestion(response.data[0]));
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message,
      });
    }
  };

  const handleAnswerForm = async (event) => {
    const key = event.target.name;
    setFormAnswer({ ...formAnswer, [key]: event.target.value });
  };

  const handleSubmitAnswer = async (event) => {
    try {
      setIsLoading(true);
      event.preventDefault();
      let response = await axios.post(
        `${process.env.REACT_APP_API_BE}/admin/qna/answer/${params.idquestion}`,
        formAnswer,
        { headers: { authorization: `Bearer ${token}` } }
      );
      setIsLoading(false);
      setOnOpenAnswerModal(false);
      navigate("/admin/answer-question");
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: response.data?.message,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message || "Something went wrong!!",
      });
      setIsLoading(false);
      setOnOpenAnswerModal(false);
      navigate("/admin/answer-question");
    }
  };

  useEffect(() => {
    fetchDetailUserQuestion();
  }, []);

  return (
    <>
      <div className="w-screen h-full flex justify-between bg-slate-50">
        <div className="sidebar-width">
          <Sidebar />
        </div>
        <div className="min-h-screen h-full bg-dashboard-admin p-8 lg:p-28 flex flex-col gap-6 content-width">
          <p className="text-3xl font-bold">Detail Question</p>
          <div className="flex flex-wrap lg:flex-nowrap items-center lg:gap-6 pt-12">
            <div className="w-full lg:w-1/4">
              <p className="text-slate-500">Title </p>
            </div>
            <div className="w-3/4">
              <p className="text-black text-3xl font-bold py-1">
                {detailQuestion.title}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap lg:flex-nowrap  items-center lg:gap-6">
            <div className="w-full lg:w-1/4">
              <p className="text-slate-500">Question </p>
            </div>
            <div className="w-3/4">
              <p className="text-black text-xl py-1">
                {detailQuestion.question}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap lg:flex-nowrap items-center lg:gap-6">
            <div className="w-full lg:w-1/4">
              <p className="text-slate-500">Question Date</p>
            </div>
            <div className="w-3/4">
              <p className="text-black text-md py-1">
                {moment(detailQuestion.date).format("DD-MM-YYYY")}
              </p>
            </div>
          </div>
          <Divider orientation="horizontal" />
          {detailQuestion.is_answer === 0 ? (
            <>
              <p className="text-slate-500">Answer</p>
              <div className="w-full flex flex-col">
                <form onSubmit={handleSubmitAnswer}>
                  <textarea
                    rows={10}
                    id="answer"
                    name="answer"
                    type="text"
                    placeholder="Input your answer here"
                    value={formAnswer.answer}
                    onChange={handleAnswerForm}
                    className="bg-white w-full text-black p-4 rounded-md shadow-card-tagline"
                  ></textarea>

                  <div className="text-center lg:text-right">
                    <Button
                      className="button-primary w-11 mt-6"
                      variant="solid"
                      type="submit"
                      isLoading={isLoading}
                    >
                      Submit Answer
                    </Button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="w-full flex flex-col gap-6">
              <div className="flex flex-wrap lg:flex-nowrap items-center lg:gap-6">
                <div className="w-full lg:w-1/4">
                  <p className="text-slate-500">Status</p>
                </div>
                <div className="w-3/4">
                  <p className="text-black text-md py-1">Answered</p>
                </div>
              </div>
              <div className="flex flex-wrap lg:flex-nowrap items-center lg:gap-6">
                <div className="w-full lg:w-1/4">
                  <p className="text-slate-500">Answer</p>
                </div>
                <div className="w-3/4">
                  <p className="text-black text-md py-1">
                    {detailQuestion.answer}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default DetailUserQuestion;
