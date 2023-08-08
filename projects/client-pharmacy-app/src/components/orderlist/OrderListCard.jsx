import React, { useState, useEffect, useCallback } from "react";
import WaitingOrderCard from "./WaitingOrderCard";
import PrescriptionOrderCard from "./PrescriptionOrderCard";
import SendOrderCard from "./SendOrderCard";
import OnProcessOrderCard from "./OnProcessOrderCard";
import FinishedOrderCard from "./FinishedOrderCard";
import ReviewOrderCard from "./ReviewOrderCard";
import { useDispatch } from "react-redux";
import {
  fetchAdminFinishedTransaction,
  fetchAdminOnProcessTransaction,
  fetchAdminPrescriptionTransaction,
  fetchAdminReviewTransaction,
  fetchAdminSendTransaction,
  fetchFinishedTransaction,
  fetchOnProcessTransaction,
  fetchPrescriptionTransaction,
  fetchReviewTransaction,
  fetchSendTransaction,
  fetchWaitingTransaction,
  resetPrescription,
  resetTransaction,
} from "../../features/order/orderSlice";
import { fetchAdminWaitingTransaction } from "../../features/order/orderSlice";
import ReactPaginate from "react-paginate";
import Datepicker from "react-tailwindcss-datepicker";

function OrderListCard() {
  //react datepicker state
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });

  //pagination state
  const [order, setOrder] = useState("desc");
  const [orderState, setOrderState] = useState("");
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(0);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    paginateFunctionHandler();
  }, [page, orderState, dateRange, order]);

  const pageChange = ({ selected }) => {
    setPage(selected);
  };

  const handleValueChange = (newValue) => {
    setPage(0);
    setDateRange(newValue);
  };

  //reset state when changing tab
  const resetState = () => {
    setDateRange({
      startDate: null,
      endDate: null,
    });
  };

  //function to set page, totalpage, and totalRows once upload payment image
  const changePageInfo = ({ page, totalPages, totalOfRows }) => {
    setPages(totalPages);
    setRows(totalOfRows);
  };

  const paginateFunctionHandler = async () => {
    if (localStorage.getItem("user")) {
      if (orderState === "waiting") {
        dispatch(resetTransaction());
        dispatch(resetPrescription());
        const waitingPageInfo = await dispatch(
          fetchWaitingTransaction(keyword, page, limit, order, dateRange)
        );
        setRows(waitingPageInfo.totalOfRows);
        setPages(waitingPageInfo.totalPages);
      } else if (orderState === "review") {
        dispatch(resetTransaction());
        dispatch(resetPrescription());
        const reviewPageInfo = await dispatch(
          fetchReviewTransaction(keyword, page, limit, order, dateRange)
        );
        setRows(reviewPageInfo.totalOfRows);
        setPages(reviewPageInfo.totalPages);
      } else if (orderState === "prescription") {
        dispatch(resetTransaction());
        const prescriptionPageInfo = await dispatch(
          fetchPrescriptionTransaction(keyword, page, limit, order, dateRange)
        );
        setRows(prescriptionPageInfo.totalOfRows);
        setPages(prescriptionPageInfo.totalPages);
      } else if (orderState === "onprocess") {
        dispatch(resetTransaction());
        dispatch(resetPrescription());
        const onProcessPageInfo = await dispatch(
          fetchOnProcessTransaction(keyword, page, limit, order, dateRange)
        );
        setRows(onProcessPageInfo.totalOfRows);
        setPages(onProcessPageInfo.totalPages);
      } else if (orderState === "send") {
        dispatch(resetTransaction());
        dispatch(resetPrescription());
        const sendPageInfo = await dispatch(
          fetchSendTransaction(keyword, page, limit, order, dateRange)
        );
        setRows(sendPageInfo.totalOfRows);
        setPages(sendPageInfo.totalPages);
      } else if (orderState === "finished") {
        dispatch(resetTransaction());
        dispatch(resetPrescription());
        const finishedPageInfo = await dispatch(
          fetchFinishedTransaction(keyword, page, limit, order, dateRange)
        );
        setRows(finishedPageInfo.totalOfRows);
        setPages(finishedPageInfo.totalPages);
      }
    } else if (localStorage.getItem("admin")) {
      if (orderState === "waiting") {
        dispatch(resetTransaction());
        dispatch(resetPrescription());
        const waitingPageInfo = await dispatch(
          fetchAdminWaitingTransaction(keyword, page, limit, order, dateRange)
        );
        setRows(waitingPageInfo.totalOfRows);
        setPages(waitingPageInfo.totalPages);
      } else if (orderState === "prescription") {
        dispatch(resetPrescription());
        dispatch(resetTransaction());
        const prescriptionPageInfo = await dispatch(
          fetchAdminPrescriptionTransaction(
            keyword,
            page,
            limit,
            order,
            dateRange
          )
        );
        setRows(prescriptionPageInfo.totalOfRows);
        setPages(prescriptionPageInfo.totalPages);
      } else if (orderState === "review") {
        dispatch(resetPrescription());
        dispatch(resetTransaction());
        const reviewPageInfo = await dispatch(
          fetchAdminReviewTransaction(keyword, page, limit, order, dateRange)
        );
        setRows(reviewPageInfo.totalOfRows);
        setPages(reviewPageInfo.totalPages);
      } else if (orderState === "onprocess") {
        dispatch(resetTransaction());
        dispatch(resetPrescription());
        const onProcessPageInfo = await dispatch(
          fetchAdminOnProcessTransaction(keyword, page, limit, order, dateRange)
        );
        setRows(onProcessPageInfo.totalOfRows);
        setPages(onProcessPageInfo.totalPages);
      } else if (orderState === "send") {
        dispatch(resetTransaction());
        dispatch(resetPrescription());
        const sendPageInfo = await dispatch(
          fetchAdminSendTransaction(keyword, page, limit, order, dateRange)
        );
        setRows(sendPageInfo.totalOfRows);
        setPages(sendPageInfo.totalPages);
      } else if (orderState === "finished") {
        dispatch(resetTransaction());
        dispatch(resetPrescription());
        const sendPageInfo = await dispatch(
          fetchAdminFinishedTransaction(keyword, page, limit, order, dateRange)
        );
        setRows(sendPageInfo.totalOfRows);
        setPages(sendPageInfo.totalPages);
      }
    }
  };

  //when user click submit to search
  const onClickSubmitHandler = useCallback((e) => {
    e.preventDefault();
    paginateFunctionHandler();
  });

  const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);
  const [isWaitingOpen, setIsWaitingOpen] = useState(false);
  const [isOnProcessOpen, setIsOnProcessOpen] = useState(false);
  const [isSendOpen, setIsSendOpen] = useState(false);
  const [isFinishedOpen, setIsFinishedOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const dispatch = useDispatch();

  //when prescription is clicked by user, turn the other component off
  const onClickPrescriptionHandler = (e) => {
    setPage(0);
    setOrderState(e.target.id);
    setIsPrescriptionOpen(true);
    setIsWaitingOpen(false);
    setIsOnProcessOpen(false);
    setIsSendOpen(false);
    setIsFinishedOpen(false);
    setIsReviewOpen(false);
  };

  // when waiting is clicked by user, turn the other component off
  const onClickWaitingHandler = (e) => {
    setPage(0);
    setOrderState(e.target.id);
    setIsWaitingOpen(true);
    setIsPrescriptionOpen(false);
    setIsOnProcessOpen(false);
    setIsSendOpen(false);
    setIsFinishedOpen(false);
    setIsReviewOpen(false);
  };

  // when waiting is clicked by user, turn the other component off
  const onClickOnProcessHandler = (e) => {
    setPage(0);
    setOrderState(e.target.id);
    setIsOnProcessOpen(true);
    setIsWaitingOpen(false);
    setIsPrescriptionOpen(false);
    setIsSendOpen(false);
    setIsFinishedOpen(false);
    setIsReviewOpen(false);
  };

  // when send is clicked by user, turn the other component off
  const onClickSendHandler = (e) => {
    setPage(0);
    setOrderState(e.target.id);
    setIsSendOpen(true);
    setIsPrescriptionOpen(false);
    setIsWaitingOpen(false);
    setIsOnProcessOpen(false);
    setIsFinishedOpen(false);
    setIsReviewOpen(false);
  };

  const onClickFinishedHandler = (e) => {
    setPage(0);
    setOrderState(e.target.id);
    setIsFinishedOpen(true);
    setIsSendOpen(false);
    setIsPrescriptionOpen(false);
    setIsWaitingOpen(false);
    setIsOnProcessOpen(false);
    setIsReviewOpen(false);
  };

  const onClickReviewHandler = (e) => {
    setPage(0);
    setOrderState(e.target.id);
    setIsReviewOpen(true);
    setIsFinishedOpen(false);
    setIsSendOpen(false);
    setIsPrescriptionOpen(false);
    setIsWaitingOpen(false);
    setIsOnProcessOpen(false);
  };

  useEffect(() => {
    setDateRange({
      startDate: null,
      endDate: null,
    });
    setPage(0);
    setOrderState("prescription");
    setIsPrescriptionOpen(true);
  }, []);

  return (
    <div>
      <div className="flex sm:flex-row flex-col justify-between py-5 items-center">
        <div
          id="prescription"
          onClick={onClickPrescriptionHandler}
          className={`hover:cursor-pointer transition duration-300 ease-out hover:ease-in hover:border-b-4 h-[50px] hover:border-b-green-600 pb-4 text-center w-full ${
            isPrescriptionOpen &&
            "border-b-4 border-b-green-600 font-bold bg-green-50 sm:bg-transparent rounded-t-md"
          }`}
        >
          Prescription
        </div>
        <div
          id="waiting"
          onClick={onClickWaitingHandler}
          className={`hover:cursor-pointer transition duration-300 ease-out hover:ease-in hover:border-b-4 h-[50px] hover:border-b-green-600 pb-4 text-center w-full ${
            isWaitingOpen &&
            "border-b-4 border-b-green-600 font-bold bg-green-50 sm:bg-transparent rounded-t-md"
          }`}
        >
          Waiting
        </div>
        <div
          id="review"
          onClick={onClickReviewHandler}
          className={`hover:cursor-pointer transition duration-300 ease-out hover:ease-in hover:border-b-4 h-[50px] hover:border-b-green-600 pb-4 text-center w-full ${
            isReviewOpen &&
            "border-b-4 border-b-green-600 font-bold bg-green-50 sm:bg-transparent rounded-t-md"
          }`}
        >
          Review
        </div>
        <div
          id="onprocess"
          onClick={onClickOnProcessHandler}
          className={`hover:cursor-pointer transition duration-300 ease-out hover:ease-in hover:border-b-4 h-[50px] hover:border-b-green-600 pb-4 text-center w-full ${
            isOnProcessOpen &&
            "border-b-4 border-b-green-600 font-bold bg-green-50 sm:bg-transparent rounded-t-md"
          }`}
        >
          On Process
        </div>
        <div
          id="send"
          onClick={onClickSendHandler}
          className={`hover:cursor-pointer transition duration-300 ease-out hover:ease-in hover:border-b-4 h-[50px] hover:border-b-green-600 pb-4 text-center w-full ${
            isSendOpen &&
            "border-b-4 border-b-green-600 font-bold bg-green-50 sm:bg-transparent rounded-t-md"
          }`}
        >
          Send
        </div>
        <div
          id="finished"
          onClick={onClickFinishedHandler}
          className={`hover:cursor-pointer transition duration-300 ease-out hover:ease-in hover:border-b-4 h-[50px] hover:border-b-green-600 pb-4 text-center w-full ${
            isFinishedOpen &&
            "border-b-4 border-b-green-600 font-bold bg-green-50 sm:bg-transparent rounded-t-md"
          }`}
        >
          Finished
        </div>
      </div>
      <div className="w-[100%] justify-start mb-4">
        <div className="flex items-center sm:flex-row-reverse flex-col gap-4">
          <div className="sm:w-[50%] w-full my-4">
            <Datepicker
              primaryColor="teal"
              value={dateRange}
              onChange={handleValueChange}
              showShortcuts={true}
              popoverDirection="down"
            />
          </div>
          <form className="w-full">
            <div className=" relative flex flex-col sm:flex-row sm:gap-0">
              <select
                id="selector"
                onClick={(e) => {
                  e.preventDefault();
                  setOrder(e.target.value);
                }}
                className="flex-shrink-2 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 sm:rounded-l-lg rounded-lg sm:rounded-r-none rounded-b-none hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100"
              >
                <option
                  id="sort-default"
                  value=""
                  className="inline-flex pl-10 w-full px-4 py-2 hover:bg-gray-100"
                >
                  Sorting
                </option>

                <option
                  id="sort-asc"
                  value="asc"
                  className="inline-flex pl-10 w-full px-4 py-2 hover:bg-gray-100"
                >
                  Ascending
                </option>
                <option
                  id="sort-desc"
                  value="desc"
                  className="inline-flex w-full px-4 py-2 hover:bg-gray-100"
                >
                  Descending
                </option>
              </select>

              <div className="relative w-full">
                <input
                  onChange={(e) => setKeyword(e.target.value)}
                  type="search"
                  id="search-dropdown"
                  value={keyword}
                  className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg rounded-b-lg sm:border-l-gray-50 sm:border-l-2 sm:rounded-bl-none border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "
                  placeholder="Search Transaction ID"
                  required
                />
                <button
                  onClick={onClickSubmitHandler}
                  type="submit"
                  className="absolute top-0 right-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 sm:rounded-r-lg rounded-br-lg rounded-t-none border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none"
                >
                  <svg
                    className="w-4 h-4"
                    aria-hidden="true"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      {isWaitingOpen ? (
        <WaitingOrderCard
          changePageInfo={changePageInfo}
          keyword={keyword}
          page={page}
          limit={limit}
          order={order}
          dateRange={dateRange}
        />
      ) : null}
      {isPrescriptionOpen ? <PrescriptionOrderCard /> : null}
      {isSendOpen ? (
        <SendOrderCard
          changePageInfo={changePageInfo}
          keyword={keyword}
          page={page}
          limit={limit}
          order={order}
          dateRange={dateRange}
        />
      ) : null}
      {isOnProcessOpen ? (
        <OnProcessOrderCard
          changePageInfo={changePageInfo}
          keyword={keyword}
          page={page}
          limit={limit}
          order={order}
          dateRange={dateRange}
        />
      ) : null}
      {isFinishedOpen ? <FinishedOrderCard /> : null}
      {isReviewOpen ? (
        <ReviewOrderCard
          changePageInfo={changePageInfo}
          keyword={keyword}
          page={page}
          limit={limit}
          order={order}
          dateRange={dateRange}
        />
      ) : null}
      <div>
        Total Transactions: {rows}, Page: {rows ? page + 1 : 0} of {pages}
      </div>
      <nav className="mt-4" key={rows} role="navigation">
        <ReactPaginate
          breakLabel="..."
          previousLabel={"<< Prev"}
          nextLabel={"Next >>"}
          pageCount={pages}
          onPageChange={pageChange}
          containerClassName="flex items-center flex-row justify-center gap-2 text-xs sm:text-base"
          pageClassName="sm:p-1 sm:w-[5%] w-[10%] items-center hover:bg-blue-600 hover:text-white bg-blue-200 rounded text-center rounded"
          activeLinkClassName="font-bold"
          previousLinkClassName="w-[10%] bg-blue-200 rounded sm:p-1 hover:bg-blue-600 hover:text-white"
          nextLinkClassName="w-[10%] bg-blue-200 rounded sm:p-1 hover:bg-blue-600 hover:text-white"
        />
      </nav>
    </div>
  );
}

export default OrderListCard;
