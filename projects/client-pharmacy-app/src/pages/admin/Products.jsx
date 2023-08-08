import CardProduct from "../../components/CardProduct";
import {
  fetchAllProductOnAdmin,
  fetchProduct,
  fetchProducts,
  setProducts,
} from "../../features/cart/productsSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import ProductsCard from "../../components/admin/products/ProductsCard";
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
} from "@chakra-ui/react";
import Swal from "sweetalert2";
import { AUTH_TOKEN } from "../../helpers/constant";
import { useNavigate } from "react-router-dom";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { currency } from "../../helpers/currency";
import AddNewProductModal from "../../components/admin/products/AddNewProductModal";
import { getAllCategory } from "../../features/cartegory/categorySlice";
import debounce from "lodash.debounce";

function Products() {
  const LIMIT = 5;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedFilter, setSelectedFilter] = useState({
    idcategory: undefined,
    name: "",
  });
  const [selectedSortBy, setSelectedSortBy] = useState({
    sort: undefined,
    key: undefined,
  });
  const countData = useSelector((state) => state.product.countProduct) || 0;
  const [page, setPage] = useState(1);
  const [modalAddNewProductOpen, setModalAddNewProductOpen] = useState(false);
  const products = useSelector((state) => state.product.products) || [];
  const categories = useSelector((state) => state.categories.categories) || [];
  const [searchTerm, setSearchTerm] = useState("");

  const handleDetailProductPage = (idproduct) => {
    try {
      navigate(`/admin/products/${idproduct}`);
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

  const sortBy = (key, sort) => {
    if (key === "name" && sort == "ASC") {
      return "A - Z";
    }
    if (key === "name" && sort == "DESC") {
      return "Z - A";
    }
    if (key === "price" && sort == "ASC") {
      return "Low - High";
    }
    if (key === "price" && sort == "DESC") {
      return "High - Low";
    }
  };

  const renderPagination = () => {
    const pages = Array(Math.ceil(countData / LIMIT)).fill(undefined);
    return (pages || []).map((el, i) => (
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

  useEffect(() => {
    dispatch(getAllCategory());
  }, []);

  useEffect(() => {
    dispatch(
      fetchAllProductOnAdmin(
        selectedFilter.idcategory,
        selectedSortBy.sort,
        selectedSortBy.key,
        page,
        searchTerm
      )
    );
  }, [selectedFilter.idcategory, selectedSortBy.sort, page, searchTerm]);

  return (
    <>
      <div className="w-screen h-full flex justify-between bg-slate-50">
        <div className="sidebar-width">
          <Sidebar />
        </div>
        <div className="min-h-screen h-full bg-dashboard-admin p-8 lg:p-28 flex flex-col gap-11 content-width">
          <p className="text-3xl font-bold">Product List</p>
          <div className="flex gap-3 flex-wrap lg:flex-nowrap">
            <button
              className=" bg-green-600 text-white  font-bold h-10 px-2 rounded-md hover:bg-emerald-500 hover:text-white "
              onClick={() => navigate("/admin/products/unit-conversion")}
            >
              Unit Conversion
            </button>
            <button
              className=" bg-green-600 text-white  font-bold h-10 px-2 rounded-md hover:bg-emerald-500 hover:text-white "
              onClick={() => navigate("/admin/products/categories")}
            >
              Categories
            </button>
          </div>
          <div className="bg-white px-6 pb-11 rounded-lg shadow-card-tagline">
            <div className="flex flex-wrap items-end my-11 gap-4 justify-between">
              <div className="flex flex-wrap gap-4 items-end">
                <div>
                  <p className="font-bold text-sm">Search product</p>
                  <input
                    placeholder="Search product"
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
                        {selectedFilter.name || "Filter All"}
                      </div>
                    </MenuButton>
                    <MenuList>
                      <MenuItem
                        onClick={() => {
                          setSelectedFilter({
                            idcategory: undefined,
                            name: "Filter All",
                          });
                          setPage(1);
                        }}
                      >
                        <p className="text-black">Filter All</p>
                      </MenuItem>

                      {categories.map((category) => {
                        return (
                          <MenuItem
                            onClick={() => {
                              setSelectedFilter({
                                idcategory: category.idcategory,
                                name: category.name,
                              });
                              setPage(1);
                            }}
                            key={category.idcategory}
                          >
                            <p className="text-black"> {category.name}</p>
                          </MenuItem>
                        );
                      })}
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
                        <p>
                          {sortBy(selectedSortBy.key, selectedSortBy.sort) ||
                            "No sort"}
                        </p>
                      </div>
                    </MenuButton>
                    <MenuList>
                      <MenuItem
                        onClick={() => setSelectedSortBy({ sort: "", key: "" })}
                      >
                        <p className="text-black">No sort</p>
                      </MenuItem>
                      <MenuItem
                        onClick={() =>
                          setSelectedSortBy({ sort: "DESC", key: "name" })
                        }
                      >
                        <p className="text-black">Name: Z - A</p>
                      </MenuItem>
                      <MenuItem
                        onClick={() =>
                          setSelectedSortBy({ sort: "ASC", key: "name" })
                        }
                      >
                        <p className="text-black">Name: A - Z</p>
                      </MenuItem>
                      <MenuItem
                        onClick={() =>
                          setSelectedSortBy({ sort: "ASC", key: "price" })
                        }
                      >
                        <p className="text-black">Price: low - high</p>
                      </MenuItem>
                      <MenuItem
                        onClick={() =>
                          setSelectedSortBy({ sort: "DESC", key: "price" })
                        }
                      >
                        <p className="text-black">Price: high - low</p>
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </div>
              </div>
              <div>
                <div>
                  <Button
                    className="button-primary"
                    onClick={() => setModalAddNewProductOpen(true)}
                  >
                    Add product
                  </Button>
                </div>
              </div>
            </div>
            <AddNewProductModal
              isOpen={modalAddNewProductOpen}
              onClose={() => setModalAddNewProductOpen(false)}
              className="mx-4 sm:mx-0"
            />
            <TableContainer className="rounded-lg bg-table-list-color">
              {products.length > 0 ? (
                <Table variant="striped" colorScheme="teal">
                  <Thead className="table-list-head">
                    <Tr>
                      <Th color="white" fontSize="base">
                        No
                      </Th>
                      <Th color="white" fontSize="base">
                        Image
                      </Th>
                      <Th color="white" fontSize="base">
                        Name
                      </Th>
                      <Th color="white" fontSize="base">
                        Stock
                      </Th>
                      <Th color="white" fontSize="base">
                        Unit
                      </Th>
                      <Th color="white" fontSize="base">
                        Category
                      </Th>
                      <Th color="white" fontSize="base">
                        Price
                      </Th>
                      <Th color="white" fontSize="base">
                        Action
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody className="">
                    {products.map((product, index) => (
                      <Tr key={product.idproduct}>
                        <Td>{LIMIT * (page - 1) + 1 + index}</Td>

                        <Td>
                          <img
                            src={
                              product.product_image
                                ? `${process.env.REACT_APP_API_BE}/uploads/${product.product_image}`
                                : "./assets/icon-medicine.png"
                            }
                            alt=""
                            width="44px"
                          />
                        </Td>

                        <Td>{getName(product.name)}</Td>
                        {/* <Td>{product.name}</Td> */}
                        <Td>
                          {product.stock === 0 ? (
                            <p className="text-red-600 font-bold">
                              out of stock
                            </p>
                          ) : (
                            product.stock
                          )}
                        </Td>
                        <Td>
                          {product.unit_product ? (
                            product.unit_product
                          ) : (
                            <p>-</p>
                          )}
                        </Td>
                        <Td>
                          {(product.categories || []).length > 0
                            ? product.categories.map((category) => (
                                <p key={category.idcategory}>{category.name}</p>
                              ))
                            : "-"}
                        </Td>
                        <Td>{currency(product.price)}</Td>
                        <Td>
                          <Button
                            className="border-button"
                            onClick={() =>
                              handleDetailProductPage(product.idproduct)
                            }
                          >
                            See detail
                          </Button>
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
            <div className="flex flex-wrap sm:flex-nowrap w-full gap-4 justify-center mt-11">
              {renderPagination()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Products;
