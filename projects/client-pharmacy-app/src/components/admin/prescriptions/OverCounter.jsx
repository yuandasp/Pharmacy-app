import React, { useEffect,useState } from 'react'
import { fetchProducts } from '../../../features/cart/productsSlice'
import { useDispatch,useSelector } from 'react-redux'
import { setPrescriptionMedicine } from '../../../features/product/prescriptionSlice'
import { Select,Input } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'


function OverCounter({ prescription }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [order, setOrder] = useState('ASC')
    const [filter, setFilter] = useState('')
    const [search, setSearch] = useState('')
    const [offset, setOffset] = useState(0)
    const [quantity, setQuantity] = useState(0)
    const products = useSelector(state => state.product.products)
    const prescriptionMedicines = useSelector(state=>state.prescriptions.prescriptionMedicine)
    const limit = 0
    const selectedProduct = products.find((product) => product.name === search)
    const stockHabis = quantity > selectedProduct?.stock;
    const selectedMedicines = selectedProduct ? prescriptionMedicines.find((medicine) => medicine.idproduct === selectedProduct.idproduct) : null
    const updateStock = selectedMedicines?selectedProduct.stock - selectedMedicines.quantity: selectedProduct?.stock

    const searchHandler = (e) => {
    setSearch(e.target.value)
    }
    const addMedicineHandler = () => {
        const adminId = JSON.parse(localStorage.getItem("admin")).idadmin;
        let product = {
            idadmin:adminId,
            iduser :prescription.iduser,
            idprescription : prescription.idprescription,
            idproduct:selectedProduct.idproduct,
            name: selectedProduct.name,
            quantity: quantity,
            unit: selectedProduct.unit_product,
            price: selectedProduct.unit == selectedProduct.unitname ? (selectedProduct.price / selectedProduct.quantity) * quantity : (selectedProduct.price * quantity),
            weight : selectedProduct.unit == selectedProduct.unitname ?(selectedProduct.weight * quantity):(selectedProduct.weight/selectedProduct.quantity)* quantity,
            status:'default'
        }
        dispatch(setPrescriptionMedicine(product))
        
    }

    useEffect(() => {
        dispatch(fetchProducts(order,filter,search,offset,limit))

    },[search])
  return (
    <div className='flex flex-col gap-3 justify-center items-center'>    
    <div className=' relative inline-block'>   
        <input type="text" placeholder='Search Medicine' value={search} className='w-60  border-black relative z-10 h-8 bg-slate-100 rounded-md p-2'
       onChange={(e)=>searchHandler(e)} />
        <select name="" id="" className=' absolute w-72 h-8  left-0  border-black  bg-slate-100 rounded-md p-2' onChange={(e) => setSearch(e.target.value)}>
            <option value="">Select Medicine</option>
            {products.map((product) => {
                return <option value={product.name} >{product.name }</option>
            })}
    </select>
    </div>
    <div className='flex gap-4'>    
    <div className='flex flex-col  justify-center items-center gap-5'>    
                  {selectedProduct ? (selectedProduct.stock == 0 ? (
                      <div
  className="mb-4 rounded-lg bg-red-100 px-6 py-5 text-base text-danger-700"
  >
 <p> Stock is Unavailable, Please Check Product Page For Details</p>
  <a href='' onClick={()=>navigate('/admin/products')} className="font-bold text-danger-700">Product Page</a>
</div>
):
    <>
    <div>
        
    <button onClick={()=>setQuantity(quantity-1)} disabled={quantity==0}>-</button>
    <input type='number' value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className='w-10 px-2' />
            <button onClick={() => setQuantity(quantity + 1)} disabled={stockHabis}>+</button>
            
    </div>
                      <p>{`Available Stock : ${updateStock} ${selectedProduct.unit_product}`}</p>
                      <div>    
                  <button className=' border-2 border-green-300  font-bold h-10 px-2 rounded-md hover:bg-emerald-500 hover:text-white text-emerald-500 right-0'
                  onClick={() => addMedicineHandler()} >Add Medicine</button>
                  </div>
                  </>
    ): <></>                   
                }
                </div>
                </div>
   
</div>

  )
}

export default OverCounter