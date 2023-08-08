import React, { useEffect, useState }  from 'react'
import AddressModal from './AddressModal'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { fetchAddresses, fetchPrimaryAddress } from '../../features/users/addressSlice'
import { getCity } from '../../features/rajaongkir/rajaongkirSlice'
import ManageAddressModal from './ManageAddressModal'
import MyAddressCard from './MyAddressCard'

function AddressCard() {
  const dispatch = useDispatch()
  const primaryAddress = useSelector(state=>state.address.primaryAddress[0])

  
  useEffect(() => {
    dispatch(fetchPrimaryAddress())
  },[])
  return (
    <div className="flex flex-col ">
          <h1 className=" px-4 font-bold text-xl mb-2 lg:text-2xl">
      Address
    </h1>
    
    {primaryAddress ? (
      <div className="px-4">
        <MyAddressCard address={primaryAddress}/> 
      </div>
    ) : (
      <h1 className=' font-extrabold px-4'>Please Add Address or Set Your Primary Addres</h1>
    )}
    
    <div className="flex items-center justify-center py-2 gap-3">
      <ManageAddressModal/>
      <AddressModal/>
    </div>
  </div>

  )
}

export default AddressCard