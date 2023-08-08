import React from 'react'
import { currency } from '../../helpers/currency'
import { useDispatch } from 'react-redux'
import { setStatus } from '../../features/transaction/transactionSlice'
import Swal from 'sweetalert2'

function TransactionCard({ transaction }) {
    const dispatch = useDispatch()
    const confirmOrder = async(id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You want to Confirm Your Order",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!'
        })
        if (result.isConfirmed) {
            
            const status = 'Pesanan Telah Dikonfrimasi'
            dispatch(setStatus(id,status))
        }
    }
  return (
    <div className=" w-[90%] rounded-xl shadow-xl">
          <div className="text-xl ml-6 font-bold pt-6">{`ID#${transaction.idtransaction}` }</div>
      <div className="flex flex-col gap-4 justify-between mx-6 mt-4">
      <div className="flex flex-row justify-between ">
          <div>Total Payment</div>
          <div>{currency(transaction.total)}</div>
              </div>
              <div className='flex  border-2 border-emerald-600 py-2 rounded-lg px-3 '>
              <p className=''>{`Status Pesanan : ${transaction.status}`}</p> 
              </div>
              <div className='flex items-center justify-center w-full border-t-2 py-5'>
              {transaction.status == 'Dikirim' ?
                  <button 
                  className=' border-2 border-green-300  font-bold h-10 px-2 rounded-md hover:bg-emerald-500 hover:text-white text-emerald-500'
                  onClick={() => confirmOrder(transaction.idtransaction)}>Konfirmasi </button>
                  : <></>}
                  </div>  
          </div>
      </div>

  )
}

export default TransactionCard