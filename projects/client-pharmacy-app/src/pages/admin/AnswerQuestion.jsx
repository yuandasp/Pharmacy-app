import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  Tooltip,
} from "@chakra-ui/react";
import axios from "axios";
import Swal from "sweetalert2";
import { useSelector, useDispatch } from "react-redux";
import { setAllUserQuestion } from "../../features/admin/answerSlice";
import { AUTH_TOKEN } from "../../helpers/constant";
import { useNavigate } from "react-router-dom";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import moment from "moment";
import debounce from "lodash.debounce";

function AnswerQuestion() {
  const LIMIT = 5;
  const dispatch = useDispatch();
  const questions = useSelector((state) => state.answers.allUserQuestion);
  const token = localStorage.getItem(AUTH_TOKEN);
  const navigate = useNavigate();
  const [selectedIsAnswer, setSelectedIsAnswer] = useState({
    isAnswer: undefined,
  });
  const [selectedSortBy, setSelectedSortBy] = useState({
    sort: undefined,
    key: undefined,
  });
  const [countData, setCountData] = useState(0);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAllUserQuestion = async () => {
    try {
      let response = await axios.get(
        `${process.env.REACT_APP_API_BE}/admin/qna/questions`,
        {
          params: {
            is_answer: selectedIsAnswer.isAnswer,
            sort: selectedSortBy.sort,
            key: selectedSortBy.key,
            limit: LIMIT,
            page,
            search: searchTerm,
          },
          headers: { authorization: `Bearer ${token}` },
        }
      );
      dispatch(setAllUserQuestion(response.data?.questions || []));
      setCountData(response.data.count);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message,
      });
    }
  };

  const getName = (name) => {
    if (name.length > 20) {
      return name.slice(0, 20) + "...";
    }
    return name;
  };

  const handleDeleteQuestion = async (idquestion) => {
    try {
      let response = await axios.delete(
        `${process.env.REACT_APP_API_BE}/admin/qna/${idquestion}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      navigate("/admin/answer-question");
      fetchAllUserQuestion();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message,
      });
    }
  };

  const saveHandler = async (idquestion) => {
    fetchAllUserQuestion();
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this question",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, change it!",
    });
    if (result.isConfirmed) {
      handleDeleteQuestion(idquestion);
    }
  };

  const handlePageDetailUserQuestion = async (idquestion) => {
    try {
      navigate(`/admin/answer-question/${idquestion}`);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message,
      });
    }
  };

  const renderPagination = () => {
    // const pages = [...Array(Math.ceil(countData / LIMIT))];
    const pages = Array(Math.ceil(countData / LIMIT)).fill(undefined);
    return pages.map((el, i) => (
      <div
        key={i}
        onClick={() => setPage(i + 1)}
        className={`cursor-pointer py-1 px-2 rounded-md text-center ${
          page === i + 1 ? "bg-slate-900 text-white" : "text-black bg-slate-200"
        }`}
      >
        <p>{i + 1}</p>
      </div>
    ));
  };

  const searchHandler = (value) => {
    setSearchTerm(value);
  };

  const debouncedChangeHandler = useMemo(
    () => debounce(searchHandler, 500),
    []
  );

  const filter = (idanswer) => {
    if (idanswer == undefined) {
      return "Filter All";
    }
    if (idanswer == 1) {
      return "Answered";
    }
    if (idanswer == 0) {
      return "No answer";
    }
  };

  const sortBy = (sort) => {
    if (sort == "ASC") {
      return "Oldest - Newest";
    }
    if (sort == "DESC") {
      return "Newest - Oldest";
    }
  };

  useEffect(() => {
    fetchAllUserQuestion();
  }, [selectedIsAnswer.isAnswer, selectedSortBy.sort, page, searchTerm]);

  return (
    <>
      <div className="w-screen h-full flex justify-between bg-slate-50">
        <div className="sidebar-width">
          <Sidebar />
        </div>
        <div className="min-h-screen h-full bg-dashboard-admin p-8 lg:p-28 flex flex-col gap-11 content-width">
          <p className="text-3xl font-bold">Answer Question</p>
          <div className="bg-white px-6 pb-11 rounded-lg shadow-card-tagline">
            <div className="flex flex-wrap gap-4 my-11 items-end">
              <div>
                <p className="font-bold text-sm">Search question</p>
                <input
                  placeholder="Search question"
                  onChange={(e) => debouncedChangeHandler(e.target.value)}
                  className="w-full bg-gray-50 rounded-md border-2 h-8 px-2"
                />
              </div>
              <div>
                <Menu>
                  <MenuButton>
                    <div className="flex gap-2 bg-slate-800 text-white py-1 rounded-md font-bold px-3">
                      <div className="w-6">
                        <svg
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
                          ></path>
                        </svg>
                      </div>
                      <p>{filter(selectedIsAnswer.isAnswer)}</p>
                    </div>
                  </MenuButton>
                  <MenuList label={selectedIsAnswer.isAnswer}>
                    <MenuItem
                      onClick={() =>
                        setSelectedIsAnswer({ isAnswer: undefined })
                      }
                    >
                      <p className="text-black">Filter All</p>
                    </MenuItem>
                    <MenuItem
                      onClick={() => setSelectedIsAnswer({ isAnswer: 1 })}
                    >
                      <p className="text-black">Answered</p>
                    </MenuItem>
                    <MenuItem
                      onClick={() => setSelectedIsAnswer({ isAnswer: 0 })}
                    >
                      <p className="text-black">No Answer</p>
                    </MenuItem>
                  </MenuList>
                </Menu>
              </div>
              <div>
                <Menu>
                  <MenuButton>
                    <div className="flex gap-1 bg-slate-800 text-white py-1 rounded-md font-bold pl-2 pr-3">
                      <div className="w-6">
                        <svg
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                          ></path>
                        </svg>
                      </div>

                      <p>{sortBy(selectedSortBy.sort) || "No sort"}</p>
                    </div>
                  </MenuButton>
                  <MenuList label={selectedSortBy.sort}>
                    <MenuItem
                      onClick={() =>
                        setSelectedSortBy({ sort: undefined, key: undefined })
                      }
                    >
                      <p className="text-black">No sort</p>
                    </MenuItem>
                    <MenuItem
                      onClick={() =>
                        setSelectedSortBy({ sort: "DESC", key: "date" })
                      }
                    >
                      <p className="text-black">Date: Oldest - Newest</p>
                    </MenuItem>
                    <MenuItem
                      onClick={() =>
                        setSelectedSortBy({ sort: "ASC", key: "date" })
                      }
                    >
                      <p className="text-black">Date: Newest - Oldest</p>
                    </MenuItem>
                  </MenuList>
                </Menu>
              </div>
            </div>
            <TableContainer className="rounded-lg bg-table-list-color">
              {questions.length > 0 ? (
                <Table variant="striped" colorScheme="teal">
                  <Thead className="table-list-head">
                    <Tr>
                      <Th color="white" fontSize="base">
                        No
                      </Th>
                      <Th color="white" fontSize="base">
                        Title
                      </Th>
                      <Th color="white" fontSize="base">
                        Question
                      </Th>
                      <Th color="white" fontSize="base">
                        Date
                      </Th>
                      <Th color="white" fontSize="base">
                        Status
                      </Th>
                      <Th color="white" fontSize="base">
                        Action
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {questions.map((question, index) => (
                      <Tr key={question.idquestion}>
                        <Td>{LIMIT * (page - 1) + 1 + index}</Td>
                        <Td
                          onClick={() =>
                            handlePageDetailUserQuestion(question.idquestion)
                          }
                          className="cursor-pointer"
                        >
                          {question.title}
                        </Td>
                        <Td
                          onClick={() =>
                            handlePageDetailUserQuestion(question.idquestion)
                          }
                          className="cursor-pointer"
                        >
                          {getName(question.question)}
                        </Td>
                        <Td
                          onClick={() =>
                            handlePageDetailUserQuestion(question.idquestion)
                          }
                          className="cursor-pointer"
                        >
                          {moment(question.date).format("DD-MM-YYYY")}
                        </Td>
                        <Td
                          onClick={() =>
                            handlePageDetailUserQuestion(question.idquestion)
                          }
                          className="cursor-pointer"
                        >
                          {question.is_answer ? (
                            <Tooltip label="You already answer this question">
                              <Button
                                colorScheme="gray"
                                variant="solid"
                                className="cursor-not-allowed"
                              >
                                Answered
                              </Button>
                            </Tooltip>
                          ) : (
                            <Button className="button-primary" variant="solid">
                              No Answer
                            </Button>
                          )}
                        </Td>

                        <Td>
                          <div
                            className="w-fit"
                            onClick={() => saveHandler(question.idquestion)}
                          >
                            <Tooltip label="delete">
                              <Button colorScheme="red" variant="ghost">
                                <svg
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                  aria-hidden="true"
                                  className="w-7"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                  ></path>
                                </svg>
                              </Button>
                            </Tooltip>
                          </div>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              ) : (
                <div className="w-full flex flex-col items-center my-11">
                  <p className="text-xl mb-11 font-bold text-slate-400">
                    No Data
                  </p>
                  <img
                    src={"./assets/image-no-data-admin.svg"}
                    alt=""
                    width="200px"
                    className=""
                  />
                </div>
              )}
            </TableContainer>
            <div className="flex flex-wrap sm:flex-nowrap  w-full gap-4 justify-center mt-11">
              {renderPagination()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AnswerQuestion;
