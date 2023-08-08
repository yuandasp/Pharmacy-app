import React, { useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
  Select,
  Input,
  Button,
} from "@chakra-ui/react";
import { useEffect } from "react";
import {
  createCategory,
  getAllCategory,
} from "../../features/cartegory/categorySlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import CategoryRow from "../../components/admin/products/CategoryRow";

function Categories() {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.categories);
  const countData = useSelector((state) => state.categories.count);
  const [newCategory, setNewCategory] = useState("");
  const [sortOption, setSortOption] = useState("ASC");
  const [searchTerm, setSearchTerm] = useState("");
  const [offset, setOffset] = useState(0);
  const pages = Math.floor(countData / 5);
  const sortHandler = (e) => {
    setOffset(0);
    setSortOption(e.target.value);
  };

  const searchHandler = (value) => {
    setOffset(0);
    setSearchTerm(value);
  };

  const nextData = () => {
    let nextOffset = offset + 5;
    setOffset(nextOffset);
  };
  const prevData = () => {
    let prevOffset = offset - 5;
    setOffset(prevOffset);
  };

  const renderCategory = () => {
    return categories.map((category, index) => (
      <CategoryRow key={index} category={category} count={index + 1 + offset} />
    ));
  };

  const handleCreateCategory = () => {
    dispatch(createCategory(newCategory));
    setNewCategory("");
  };

  useEffect(() => {
    dispatch(getAllCategory(sortOption, searchTerm, offset));
  }, [offset, sortOption, searchTerm]);

  return (
    <>
      <div className="w-screen h-full flex justify-between bg-slate-50">
        <div className="sidebar-width">
          <Sidebar />
        </div>
        <div className="min-h-screen h-full bg-dashboard-admin p-8 lg:p-28 flex flex-col gap-11 content-width">
          <p className="text-3xl font-bold">Categories</p>
          <div className="bg-white p-8 rounded-lg shadow-card-tagline">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col lg:flex-row gap-10">
                <div className=" flex flex-col gap-3 max-w-sm bg-white rounded-lg shadow-lg p-6 max-h-44 item justify-center">
                  <h1 className="text-xl font-semibold">Create New Category</h1>
                  <div className="flex items-start gap-3 justify-center">
                    <Input
                      placeholder="Category Name"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                    />
                    <Button
                      colorScheme="teal"
                      size="md"
                      onClick={() => handleCreateCategory()}
                    >
                      Create
                    </Button>
                  </div>
                </div>{" "}
                <div className="flex flex-col flex-grow  ">
                  <div className="flex items-center ">
                    <select
                      value={sortOption}
                      onChange={sortHandler}
                      className="border-2 border-r-0 rounded-l-md h-8 bg-emerald-300 border-emerald-300 text-black px-2 lg:w-36"
                    >
                      <option value="">Sort</option>
                      <option value="ASC">A-Z</option>
                      <option value="DESC">Z-A</option>
                    </select>
                    <input
                      placeholder="Search"
                      onChange={(e) => searchHandler(e.target.value)}
                      className="border-2 border-l-0 rounded-r-md h-8 p-2 border-emerald-300 w-full"
                    />
                  </div>
                  <TableContainer>
                    {categories.length > 0 ? (
                      <Table variant="simple">
                        <Thead>
                          <Tr>
                            <Th>No</Th>
                            <Th>Name</Th>
                            <Th>Action</Th>
                          </Tr>
                        </Thead>
                        <Tbody>{renderCategory()}</Tbody>
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
                  <div className="flex justify-center items-center">
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
                    {offset + 5 > countData ? (
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Categories;
