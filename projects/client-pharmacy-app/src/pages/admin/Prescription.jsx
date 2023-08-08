import React, { useEffect } from 'react'
import Sidebar from '../../components/admin/Sidebar'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { fetchUserPrescription, preparePrescription, setEmpty } from '../../features/product/prescriptionSlice'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import OverCounter from '../../components/admin/prescriptions/OverCounter'
import { currency } from '../../helpers/currency'
import Swal from 'sweetalert2'
import ConcoctionMedicine from '../../components/admin/prescriptions/ConcoctionMedicine'
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    TableContainer,
    Tfoot,Input,Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
  } from '@chakra-ui/react'
import PrescriptionMedicineRow from '../../components/admin/prescriptions/PrescriptionMedicineRow'
  


function Prescription() {
    const [obatBebas, setObatBebas] = useState(true)
    const { idprescription } = useParams()
    const [doctor,setDoctor] = useState('')
    const [patient,setPatient]= useState('')
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const prescription = useSelector(state => state.prescriptions.prescription)
    const prescriptionPic = `${process.env.REACT_APP_API_PIC}/prescription/${prescription.prescription_image}`
    const prescriptionMedicine = useSelector(state => state.prescriptions.prescriptionMedicine );
    let totalPrice = 0
    
    const renderTotalPrice = () => {
        prescriptionMedicine.map((medicine) => {
            totalPrice = totalPrice + medicine.price
        })
        return (currency(totalPrice))
  }
  const calculateWeight = () => {
    let weight = 0
    prescriptionMedicine.map((medicine) => {
      weight = weight + medicine.weight
    })
    return weight
  }
  const sendPrescriptionHandler = async () => {
    const totalWeight = Math.ceil(calculateWeight())
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Want To Prepare Prescription `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Do it!'
  }) 
  if (result.isConfirmed) { 
    dispatch(preparePrescription(prescriptionMedicine, totalPrice,totalWeight,doctor,patient))
    dispatch(setEmpty())
    navigate('/admin/transactions')
  }
    }

    useEffect(() => {
        dispatch(fetchUserPrescription(idprescription))
    }, [])
   
  return (
    <div className="w-screen h-full flex justify-between bg-slate-50">
    <div className="sidebar-width">
      <Sidebar />
    </div>
    <div className="min-h-screen h-full bg-dashboard-admin  p-8 flex flex-col gap-11 content-width">
    <h1 className='text-3xl font-bold lg:text-5xl'>Prescription</h1>
    <div className="bg-white px-6 pb-11 rounded-lg shadow-card-tagline">
                  <div className="flex flex-col lg:flex-row  my-11 gap-8 ">
                      <img src={prescriptionPic} alt="" className=' w-52 ' />
                      <div className='flex flex-col border-b-2 border-slate-300'>
                          <div className=' p-2 flex flex-col gap-4'>
                            <h1>Prescription Info's :</h1>
                            <div className='flex flex-row gap-2 max-h-10'>
                              <Input variant='filled' focusBorderColor='teal' placeholder='Doctor Name' onChange={(e)=>setDoctor(e.target.value)}/>
                              <Input variant='filled' focusBorderColor='teal' placeholder='Patient Name' onChange={(e)=>setPatient(e.target.value)}/>
                            </div>
                              <div className='flex gap-8 items-center justify-center'>    
                              <button  className={`${obatBebas?'border-b-2 border-emerald-300':''}  hover:bg-emerald-300 p-2 rounded-md hover:text-white`} onClick={()=>setObatBebas(true)}>Over-Counter Medicine</button>
                              <button  className={`${obatBebas?'':'border-b-2 border-emerald-300'} hover:bg-emerald-300 p-2 rounded-md hover:text-white`} onClick={()=>setObatBebas(false)}>Concoction Medicine</button>
                              </div>
                              {obatBebas ?
                                  <OverCounter prescription={prescription }  />
                                  :
                                  <ConcoctionMedicine prescription={prescription } />}
                          </div>

                      </div>
            {doctor && patient ?
                          <TableContainer>
  <Table Table variant='simple'>
    <Thead>
      <Tr>
        <Th>Name</Th>
        <Th >Quantity</Th>
        <Th>Unit</Th>
        <Th >Price</Th>
      </Tr>
    </Thead>
     <Tbody>
        {prescriptionMedicine.map((medicine)=>{
            return <PrescriptionMedicineRow medicine={medicine}/>
        })}
    </Tbody>
    <Tfoot>
      <Tr>
        <Th>Total Price</Th>
        <Th>{renderTotalPrice()}</Th>
        <Th>
        <button onClick={()=>sendPrescriptionHandler()}>Prepare Prescription</button>
        </Th>
      </Tr>
    </Tfoot>
    </Table>
    </TableContainer>
              : <div className=' lg:pt-10 lg:pl-5' >

              <Alert status='error' className=' rounded-md'>
  <AlertIcon />
  <AlertTitle>Please fill Prescription Info's</AlertTitle>
              </Alert>
              </div>
            }
                  </div>
                  </div>
                  
                  </div>          
                  </div>
                  )
}

export default Prescription