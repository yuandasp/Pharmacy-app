import React from 'react'
import Sidebar from '../../components/admin/Sidebar'
import DiscountModal from '../../components/admin/discounts/DiscountModal'
import { useEffect,useState } from 'react'
import { fetchDiscounts } from '../../features/promo/promoSlice'
import { useDispatch } from 'react-redux'
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
  Select,
} from "@chakra-ui/react";
import { useSelector } from 'react-redux'
import DiscountTableRow from '../../components/admin/discounts/DiscountTableRow'
import {useNavigate}from 'react-router-dom'

function Discount() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [order, setOrder] = useState("ASC");
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [offset, setOffset] = useState(0);
  const discounts = useSelector(state => state.promo.discounts)
  let countData = useSelector((state) => state.promo.count[0]?.count);
  countData = parseInt(countData);
  const pages = Math.floor(countData / 5)

  const searchHandler = (e) => {
    setOffset(0);
    setSearch(e.target.value);
  };
  const filterHandler = (e) => {
    setOffset(0);
    setFilter(e.target.value);
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
  
  const renderDiscount = () => {
    let count = offset
    return discounts.map((discount) => {
      count += 1
      return <DiscountTableRow key={discount.idpromo} discount={discount} count={count} order={order} filter={filter} search={search} offset={offset} />
    })
  }
  useEffect(() => {
    dispatch(fetchDiscounts(order,filter,search,offset))
  },[order,filter,search,offset])
  return (
    <div className="w-screen h-full flex justify-between bg-slate-50">
      <div className="sidebar-width">
        <Sidebar />
      </div>
      <div className="min-h-screen h-full bg-dashboard-admin p-8 lg:p-28 flex flex-col gap-11 content-width">
        <h1 className="text-3xl font-bold">Promo's</h1>
        <div className='flex  gap-5'>

        <DiscountModal />
        <button           className="bg-green-600 text-white font-bold h-full lg:h-10 py-2 px-2 rounded-md hover:bg-emerald-500 hover:text-white"
 onClick={()=>navigate('/admin/reports/promos')}>Promo Report</button>
 </div>
        <div className="bg-white px-6 pb-11 rounded-lg shadow-card-tagline">
            <div className="flex flex-col items-center my-11 gap-4">
              <div className="flex flex-wrap lg:flex-nowrap gap-4">
                <Select onChange={(e) => filterHandler(e)}>
                  <option value="">Filter : -</option>
                  <option value='1'>Filter : Disable Only</option>
                  <option value='0'>
                    Filter : Enable Only
                  </option>
                </Select>
                <Select onChange={(e) => sortHandler(e)}>
                  <option value="ASC">Sort By : Name (A-Z)</option>
                  <option value="DESC">Sort By : Name (Z-A)</option>
                </Select>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Search Products"
                  className="bg-gray-50 border border-green-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full lg:w-[28rem] h-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 "
                  onChange={(e) => searchHandler(e)}
                />
              </div>
        <TableContainer>
                <Table Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>N0</Th>
                      <Th>Title</Th>
                      <Th>Description</Th>
                      <Th>Minimum Transaction</Th>
                      <Th>Discount/Bonus</Th>
                      <Th>Type</Th>
                      <Th>Action</Th>
                    </Tr>
                  </Thead>
              <Tbody>
                {renderDiscount()}
                  </Tbody>
                </Table>
              </TableContainer>
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
              {offset / 5 == pages ? (
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
  )
}

export default Discount