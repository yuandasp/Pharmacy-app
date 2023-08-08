import React from "react";
import TransactionCard from "./TransactionCard";

function WaitingOrderCard({
  changePageInfo,
  keyword,
  page,
  limit,
  order,
  dateRange,
}) {
  return (
    <>
      <TransactionCard
        changePageInfo={changePageInfo}
        keyword={keyword}
        page={page}
        limit={limit}
        order={order}
        dateRange={dateRange}
      />
    </>
  );
}

export default WaitingOrderCard;
