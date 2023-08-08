import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Sidebar from "../../components/admin/Sidebar";
import Graph from "../../components/report/Graph";
import UserGraph from "../../components/report/UserGraph";
import ProductGraph from "../../components/report/ProductGraph";
import {
  getSalesReport,
  resetReport,
  getUserSalesReport,
  resetChartReport,
  getProductSalesReport,
} from "../../features/report/reportSlice";
import ReactPaginate from "react-paginate";
import Datepicker from "react-tailwindcss-datepicker";

function Report() {
  const chartSalesReport = useSelector((state) => state.report.chartReport);
  const [state, setState] = useState("");
  const [isIdTransaction, setIsIdTransaction] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [isProduct, setIsProduct] = useState(false);

  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(0);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  //fetch reporting data
  const reportData = useSelector((state) => state.order.prescriptions);

  useEffect(() => {
    paginateFunctionHandler();
  }, [page, dateRange, state]);

  useEffect(() => {
    setState("idtransaction");
    setIsIdTransaction(true);
  }, []);

  const paginateFunctionHandler = async () => {
    if (state === "idtransaction") {
      // dispatch(resetChartReport());
      const reportInfo = await dispatch(getSalesReport(page, dateRange));
      setRows(reportInfo.totalOfRows);
      setPages(reportInfo.totalPages);
    } else if (state === "user") {
      // dispatch(resetChartReport());
      const reportInfo = await dispatch(getUserSalesReport(page, dateRange));
      setRows(reportInfo.totalOfRows);
      setPages(reportInfo.totalPages);
    } else if (state === "product") {
      // dispatch(resetChartReport());
      const reportInfo = await dispatch(getProductSalesReport(page, dateRange));
      setRows(reportInfo.totalOfRows);
      setPages(reportInfo.totalPages);
    }
  };

  const onClickIdTransactionHandler = (e) => {
    setPage(0);
    dispatch(resetChartReport());
    setState(e.target.value);
    setIsIdTransaction(true);
    setIsUser(false);
    setIsProduct(false);
  };

  const onClickUserHandler = (e) => {
    setPage(0);
    dispatch(resetChartReport());
    setState(e.target.value);
    setIsUser(true);
    setIsIdTransaction(false);
    setIsProduct(false);
  };

  const onClickProductHandler = (e) => {
    setPage(0);
    dispatch(resetChartReport());
    setState(e.target.value);
    setIsProduct(true);
    setIsUser(false);
    setIsIdTransaction(false);
  };

  const dispatch = useDispatch();
  const pageChange = ({ selected }) => {
    setPage(selected);
  };

  const handleValueChange = (newValue) => {
    setPage(0);
    setDateRange(newValue);
  };

  useEffect(() => {
    setDateRange({
      startDate: null,
      endDate: null,
    });
    setPage(0);
  }, []);
  return (
    <>
      <div className="w-screen h-full flex justify-between bg-slate-50">
        <div className="sidebar-width">
          <Sidebar />
        </div>
        <div className="min-h-screen h-full bg-dashboard-admin p-8 lg:p-28 flex flex-col gap-11 content-width">
          <p className="text-3xl font-bold">Sales Report</p>
          <div className="bg-white px-6 pb-11 rounded-lg shadow-card-tagline">
            <div className="flex md:flex-row mt-4 flex-col gap-4 items-center">
              <div className="font-bold">Categories :</div>
              <button
                value="idtransaction"
                onClick={onClickIdTransactionHandler}
                className="bg-green-500 sm:w-[25%] w-full hover:bg-green-700 text-white font-bold py-2 rounded-full px-4"
              >
                ID Transaction
              </button>
              <button
                value="user"
                onClick={onClickUserHandler}
                className="bg-green-500 sm:w-[10%] w-full hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
              >
                User
              </button>
              <button
                value="product"
                onClick={onClickProductHandler}
                className="bg-green-500 sm:w-[15%] w-full hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
              >
                Product
              </button>
            </div>
            <hr className="my-4" />
            {isIdTransaction ? (
              <>
                <div className="flex sm:flex-row flex-col w-full items-center">
                  <div className="text-md md:w-[25%] w-full font-bold">
                    Search by date :
                  </div>
                  <div className="w-full my-2">
                    <Datepicker
                      primaryColor="teal"
                      value={dateRange}
                      onChange={handleValueChange}
                      showShortcuts={true}
                      popoverDirection="down"
                    />
                  </div>
                </div>
                <Graph
                  chartSalesReport={chartSalesReport}
                  dateRange={dateRange}
                />
                <div className="mt-6">
                  Total Transactions: {rows}, Page: {rows ? page + 1 : 0} of{" "}
                  {pages}
                </div>
                <nav className="mt-4" key={rows} role="navigation">
                  <ReactPaginate
                    breakLabel="..."
                    previousLabel={"<< Prev"}
                    nextLabel={"Next >>"}
                    pageCount={pages}
                    onPageChange={pageChange}
                    containerClassName="flex items-center flex-row justify-center gap-2 text-2xs"
                    pageClassName="sm:p-1 sm:w-[5%] w-[10%] items-center hover:bg-blue-600 hover:text-white bg-blue-200 rounded text-center rounded"
                    activeLinkClassName="font-bold"
                    previousLinkClassName="w-[10%] bg-blue-200 rounded sm:p-1 hover:bg-blue-600 hover:text-white"
                    nextLinkClassName="w-[10%] bg-blue-200 rounded sm:p-1 hover:bg-blue-600 hover:text-white"
                  />
                </nav>
              </>
            ) : null}
            {isUser ? (
              <>
                <div className="flex sm:flex-row flex-col w-full items-center">
                  <div className="text-md md:w-[25%] w-full font-bold">
                    Search by date :
                  </div>
                  <div className="w-full my-2">
                    <Datepicker
                      primaryColor="teal"
                      value={dateRange}
                      onChange={handleValueChange}
                      showShortcuts={true}
                      popoverDirection="down"
                    />
                  </div>
                </div>
                <UserGraph
                  chartSalesReport={chartSalesReport}
                  dateRange={dateRange}
                />
                <div className="mt-6">
                  Total Transactions: {rows}, Page: {rows ? page + 1 : 0} of{" "}
                  {pages}
                </div>
                <nav className="mt-4" key={rows} role="navigation">
                  <ReactPaginate
                    breakLabel="..."
                    previousLabel={"<< Prev"}
                    nextLabel={"Next >>"}
                    pageCount={pages}
                    onPageChange={pageChange}
                    containerClassName="flex items-center flex-row justify-center gap-2 text-2xs"
                    pageClassName="sm:p-1 sm:w-[5%] w-[10%] items-center hover:bg-blue-600 hover:text-white bg-blue-200 rounded text-center rounded"
                    activeLinkClassName="font-bold"
                    previousLinkClassName="w-[10%] bg-blue-200 rounded sm:p-1 hover:bg-blue-600 hover:text-white"
                    nextLinkClassName="w-[10%] bg-blue-200 rounded sm:p-1 hover:bg-blue-600 hover:text-white"
                  />
                </nav>
              </>
            ) : null}
            {isProduct ? (
              <>
                <div className="flex sm:flex-row flex-col w-full items-center">
                  <div className="text-md md:w-[25%] w-full font-bold">
                    Search by my head :
                  </div>
                  <div className="w-full my-2">
                    <Datepicker
                      primaryColor="teal"
                      value={dateRange}
                      onChange={handleValueChange}
                      showShortcuts={true}
                      popoverDirection="down"
                    />
                  </div>
                </div>
                <ProductGraph
                  chartSalesReport={chartSalesReport}
                  dateRange={dateRange}
                />
                <div className="mt-6">
                  Total Transactions: {rows}, Page: {rows ? page + 1 : 0} of{" "}
                  {pages}
                </div>
                <nav className="mt-4" key={rows} role="navigation">
                  <ReactPaginate
                    breakLabel="..."
                    previousLabel={"<< Prev"}
                    nextLabel={"Next >>"}
                    pageCount={pages}
                    onPageChange={pageChange}
                    containerClassName="flex items-center flex-row justify-center gap-2 text-2xs"
                    pageClassName="sm:p-1 sm:w-[5%] w-[10%] items-center hover:bg-blue-600 hover:text-white bg-blue-200 rounded text-center rounded"
                    activeLinkClassName="font-bold"
                    previousLinkClassName="w-[10%] bg-blue-200 rounded sm:p-1 hover:bg-blue-600 hover:text-white"
                    nextLinkClassName="w-[10%] bg-blue-200 rounded sm:p-1 hover:bg-blue-600 hover:text-white"
                  />
                </nav>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

export default Report;
