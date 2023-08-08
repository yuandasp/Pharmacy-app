import React, { useEffect,useState } from 'react'
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    TableContainer,
    Select,
  } from "@chakra-ui/react";
import { useDispatch } from 'react-redux';
import { fetchBonusItem, fetchProductDiscounts, fetchTransactionDiscounts } from '../../../features/promo/promoReportsSlice';
import { useSelector } from 'react-redux';
import ReportPromoRow from './ReportPromoRow';

function PromoTable({ activeButton }) {
    const dispatch = useDispatch()
    const promos = useSelector(state=>state.promoReports.promos)
    const [order, setOrder] = useState("ASC");
    const [search, setSearch] = useState("");
    const [offset, setOffset] = useState(0);
    
    const searchHandler = (e) => {
      setOffset(0);
      setSearch(e.target.value);
    };
    const sortHandler = (e) => {
      setOffset(0);
      setOrder(e.target.value);
  };
  const nextData = () => {
    let nextOffset = offset + 5;
    setOffset(nextOffset);
  };
  const prevData = () => {
    let prevOffset = offset - 5;
    setOffset(prevOffset);
  };

  
  
    useEffect(() => {
        if (activeButton === "Transaction Discount") {
            dispatch(fetchTransactionDiscounts(offset,search,order))  
        } else if (activeButton === "Bonus Item") {
            dispatch(fetchBonusItem(offset,search,order))
        } else {
            dispatch(fetchProductDiscounts(offset,search,order))
        }
        
    },[activeButton,offset,search,order])
  return (
    <div>
               
                <Select onChange={(e) => sortHandler(e)}>
                  <option value="DESC">Sort By : Date (latest-oldest)</option>
                  <option value="ASC">Sort By : Date (oldest-latest)</option>
                </Select>
              <div className='flex justify-center items-center py-3'>
                <input
                  type="text"
                  placeholder="Search Promo"
                  className="bg-gray-50 border border-green-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full lg:w-[28rem] h-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 "
                  onChange={(e) => searchHandler(e)}
                />
              </div>

    <TableContainer>
    <Table Table variant="simple">
      <Thead>
        <Tr>
          <Th>Product Name</Th>
          <Th>Promo Name</Th>
          <Th>Promo Description</Th>
          <Th>Date of Transaction</Th>
        </Tr>
      </Thead>
      <Tbody>
        {promos.map((promo)=>{
            return <ReportPromoRow promo={promo}/>
        })}
      </Tbody>
    </Table>
      </TableContainer>
      <div className='flex items-center justify-center py-3'>

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
              {offset  ? (
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
  )
}

export default PromoTable