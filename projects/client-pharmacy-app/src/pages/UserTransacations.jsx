import React from 'react'
import { useSelector } from 'react-redux'
import TransactionCard from '../components/transaction/TransactionCard'

function UserTransacations() {
    const myTransactions = useSelector(state => state.transactions.transactions)

    const renderTransaction = () => {
        return myTransactions.map((transaction) => {
            return <TransactionCard transaction={transaction} />
    
})
    }
    
    return (
        <div className='h-screen px-7 py-5'>
            <h1 className='text-3xl font-extrabold lg:text-5xl'>My Order</h1>
            
      <div className='flex flex-col max-w-sm lg:max-w-md gap-3'>
          {renderTransaction()}
    </div>
      </div>
  )
}

export default UserTransacations