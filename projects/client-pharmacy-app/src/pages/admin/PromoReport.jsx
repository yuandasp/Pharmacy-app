import React, { useEffect, useRef, useState } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import { useDispatch } from 'react-redux';
import { fetchCount } from '../../features/promo/promoReportsSlice';
import { useSelector } from 'react-redux';
import BarChartPromo from '../../components/admin/promoReport/BarChartPromo';
import PromoTable from '../../components/admin/promoReport/PromoTable';

function PromoReport() {
  const dispatch = useDispatch();
  const shouldLog = useRef(true);
  const promosCount = useSelector(state => state.promoReports.promosData);
  const [promosData, setPromosData] = useState(null);
  const [activeButton, setActiveButton] = useState('Transaction Discount');
  const [order, setOrder] = useState("ASC");
  const [search, setSearch] = useState("");
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (shouldLog.current) {
      dispatch(fetchCount());
      shouldLog.current = false;
    }
  }, [order,search,offset]);

  useEffect(() => {
    if (promosCount) {
      const colors = {
        'Bonus Item': '#FFB6C1', // Color for "Bonus Item" type
        'Transaction Discount': '#87CEFA', // Color for "Transaction Discount" type
        'Product Discount': '#98FB98', // Color for "Product Discount" type
      };
      const backgroundColors = promosCount.map(promo => colors[promo.type] || '#CCCCCC'); // Assign colors based on promo type or use a default color

      setPromosData({
        labels: promosCount.map(promo => promo.description),
        datasets: [
          {
            label: 'Promo Used',
            data: promosCount.map(promo => promo.total_count),
            backgroundColor: backgroundColors,
          },
        ],
      });
    }
  }, [promosCount]);

  const handleButtonClick = (promoType) => {
    setActiveButton(promoType);
  };

  return (
    <div className="w-screen h-full flex justify-between bg-slate-50">
      <div className="sidebar-width">
        <Sidebar />
      </div>
      <div className="min-h-screen h-full bg-dashboard-admin p-8 lg:p-28 flex flex-col gap-11 content-width">
        <h1 className="text-3xl font-bold">Promos's Report</h1>
        <div className="bg-white px-6 py-2 pb-11 rounded-lg shadow-card-tagline">
          {promosData ? (
            <BarChartPromo promosData={promosData} />
          ) : (
            <div>Loading chart...</div>
          )}
          <div className="flex gap-5 justify-center items-center py-5">
            <button
              className={activeButton === "Transaction Discount" ? "text-emerald-500 font-semibold border-b-2" : ""}
              onClick={() => handleButtonClick("Transaction Discount")}
            >
              Transaction Discount's
            </button>
            <button
              className={activeButton === "Product Discount" ? "text-emerald-500 font-semibold border-b-2" : ""}
              onClick={() => handleButtonClick("Product Discount")}
            >
              Product Discount's
            </button>
            <button
              className={activeButton === "Bonus Item" ? "text-emerald-500 font-semibold border-b-2" : ""}
              onClick={() => handleButtonClick("Bonus Item")}
            >
              Bonus Item
            </button>
          </div>
          <PromoTable activeButton={activeButton} order={order } setOrder={setOrder} search={search} setSearch={setSearch} offset={offset} setOffset={setOffset} />
        </div>
      </div>
    </div>
  );
}

export default PromoReport;
