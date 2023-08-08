import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import BarChart from "./BarChart";
import { currency } from "../../helpers/currency";
import {
  ascTransactionReport,
  descTransactionReport,
} from "../../features/report/reportSlice";

function Graph({ chartSalesReport, dateRange }) {
  const dispatch = useDispatch();
  const { startDate, endDate } = dateRange;
  const salesReport = useSelector((state) => state.report.salesReport);
  const [userData, setUserData] = useState({
    labels: chartSalesReport.map((report) => report.idtransaction),
    datasets: [
      {
        label: "User Spending Mwahahaha",
        data: chartSalesReport.map((report) => report.total),
      },
    ],
  });

  const onChangeSortingHandler = (e) => {
    if (e.target.value === "asc") {
      dispatch(ascTransactionReport());
    } else if (e.target.value === "desc") {
      dispatch(descTransactionReport());
    }
  };

  useEffect(() => {
    setUserData({
      labels: chartSalesReport.map((report) => report.idtransaction),
      datasets: [
        {
          label: "User Spending Mwahahaha",
          data: chartSalesReport.map((report) => report.total),
        },
      ],
    });
  }, [chartSalesReport, salesReport]);

  return (
    <div>
      <div className="relative mx-auto sm:h-[350px] h-[300px]">
        <BarChart chartData={userData} />
      </div>
      <div className="w-full text-center mt-4">ID Transaction</div>
      <hr className="my-4" />
      <div className="my-2 flex sm:flex-row flex-col justify-between sm:gap-10 gap-4 items-center">
        <select
          id="sorting"
          onChange={onChangeSortingHandler}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
        >
          <option value="">Sorting by user spending</option>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
        <div className="w-full">
          {!startDate && !endDate
            ? "All Time"
            : `From ${startDate} To ${endDate}`}
        </div>
      </div>
      <div className="flex flex-col">
        {salesReport.map((report, index) => {
          return (
            <div
              key={index}
              className="flex odd:bg-green-100 even:bg-gray-100 sm:flex-row flex-col shadow-xl justify-between bg-red-200 px-4 py-2"
            >
              <div className="font-bold">
                ID Transaction : {report.idtransaction}
              </div>
              <div className="flex sm:flex-row flex-col sm:gap-10 gap-2">
                <div>
                  {" "}
                  <span className="sm:inline-block hidden">User : </span>{" "}
                  {report.full_name || report.username}
                </div>
                <div>Spending : {currency(report.total)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Graph;
