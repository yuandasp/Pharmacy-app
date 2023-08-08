import React, { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import axios from "axios";
import Swal from "sweetalert2";
import { useSelector, useDispatch } from "react-redux";
import { AUTH_TOKEN } from "../../../helpers/constant";
import { setproductStocks } from "../../../features/history/productStock";
import DatePicker from "react-datepicker";
import moment from "moment";

function TableHistoryStockByIdProduct({ idproduct, stock }) {
  const dispatch = useDispatch();
  const token = localStorage.getItem(AUTH_TOKEN);
  const stocks = useSelector((state) => state.history.productStocks);
  const [selectedDateStart, setSelectedDateStart] = useState(undefined);
  const [selectedDateEnd, setSelectedDateEnd] = useState(undefined);
  const [selectedSortBy, setSelectedSortBy] = useState({
    sort: undefined,
    key: undefined,
    startDate: undefined,
    endDate: undefined,
  });
  const [countData, setCountData] = useState(0);
  const [page, setPage] = useState(1);
  const LIMIT = 10;

  const handleStartDate = (date) => {
    setSelectedDateStart(new Date(date));
  };

  const handleStartEnd = (date) => {
    setSelectedDateEnd(new Date(date));
  };

  const resetDate = () => {
    setSelectedDateStart(undefined);
    setSelectedDateEnd(undefined);
    setSelectedSortBy({
      ...selectedSortBy,
      startDate: undefined,
      endDate: undefined,
    });
  };

  const onSearchDateRange = () => {
    setSelectedSortBy({
      ...selectedSortBy,
      startDate: selectedDateStart,
      endDate: selectedDateEnd,
    });
  };

  const renderPagination = () => {
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

  const fetchAllHistoryProductStockByIdProduct = async () => {
    try {
      let response = await axios.get(
        `${process.env.REACT_APP_API_BE}/admin/history/product-stock/${idproduct}`,
        {
          params: {
            start: selectedDateStart,
            end: selectedDateEnd,
            sort: selectedSortBy.sort,
            key: selectedSortBy.key,
            limit: LIMIT,
            page,
            idproduct: idproduct,
          },
          headers: { authorization: `Bearer ${token}` },
        }
      );
      dispatch(setproductStocks(response.data?.history || []));
      setCountData(response.data?.count[0]?.count);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message,
      });
    }
  };

  useEffect(() => {
    fetchAllHistoryProductStockByIdProduct();
  }, [
    selectedSortBy.sort,
    selectedSortBy.startDate,
    selectedSortBy.endDate,
    page,
    stock,
  ]);

  return (
    <>
      <div className="bg-white px-6 pb-11 rounded-lg shadow-card-tagline">
        <div className="flex flex-wrap gap-4 my-11 items-end pt-11">
          <div className="">
            <p className="font-bold text-sm">Start date</p>
            <DatePicker
              selected={selectedDateStart}
              onChange={(date) => handleStartDate(date)}
              peekNextMonth
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              placeholderText="MM/DD/YYYY"
              className="w-full bg-gray-50 rounded-md border-2 h-8 px-2"
            />
          </div>
          <div>
            <p className="font-bold text-sm">End date</p>
            <DatePicker
              selected={selectedDateEnd}
              onChange={(date) => handleStartEnd(date)}
              peekNextMonth
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              placeholderText="MM/DD/YYYY"
              className="w-full bg-gray-50 rounded-md border-2 h-8 px-2"
            />
          </div>
          <div className="">
            <div
              onClick={onSearchDateRange}
              className="cursor-pointer flex gap-1 button-primary py-2 rounded-md font-bold pl-2 pr-3"
            >
              <p>Search date</p>
            </div>
          </div>
          <div className="">
            <div
              onClick={resetDate}
              className="cursor-pointer flex gap-1 bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-md font-bold pl-2 pr-3"
            >
              <p>Reset date</p>
            </div>
          </div>
          <div>
            <Menu>
              <MenuButton>
                <div className="flex gap-1 bg-slate-800 text-white py-2 rounded-md font-bold pl-2 pr-3">
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
                  <p>{selectedSortBy.key}</p>
                  <p>{selectedSortBy.sort || "No sort"}</p>
                </div>
              </MenuButton>
              <MenuList label={selectedSortBy.sort}>
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
          {stocks.length > 0 ? (
            <Table variant="striped" colorScheme="teal">
              <Thead className="table-list-head">
                <Tr>
                  <Th color="white" fontSize="base">
                    No
                  </Th>
                  <Th color="white" fontSize="base">
                    Date
                  </Th>
                  <Th color="white" fontSize="base">
                    Product
                  </Th>
                  <Th color="white" fontSize="base">
                    Image
                  </Th>
                  <Th color="white" fontSize="base">
                    Unit
                  </Th>
                  <Th color="white" fontSize="base">
                    Quantity
                  </Th>
                  <Th color="white" fontSize="base">
                    Type
                  </Th>
                  <Th color="white" fontSize="base">
                    Status
                  </Th>
                </Tr>
              </Thead>

              <Tbody>
                {stocks.map((stock, index) => (
                  <Tr key={stock.idrestock}>
                    <Td>{LIMIT * (page - 1) + 1 + index}</Td>
                    <Td className="cursor-pointer">
                      {moment(stock.date).format("DD-MM-YYYY")}
                    </Td>
                    <Td className="cursor-pointer">
                      {stock.name ? stock.name : "-"}
                    </Td>
                    <Td className="cursor-pointer">
                      <img
                        src={
                          stock.image
                            ? `${process.env.REACT_APP_API_BE}/uploads/${stock.image}`
                            : "./assets/icon-medicine.png"
                        }
                        alt=""
                        width="36px"
                      />
                    </Td>
                    <Td className="cursor-pointer">{stock.unit}</Td>
                    <Td className="cursor-pointer">{stock.quantity}</Td>
                    <Td className="cursor-pointer">{stock.type}</Td>
                    <Td className="cursor-pointer">{stock.status}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          ) : (
            <div className="w-full flex flex-col items-center my-11">
              <p className="text-xl mb-11 font-bold text-slate-400">No Data</p>
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
    </>
  );
}

export default TableHistoryStockByIdProduct;
