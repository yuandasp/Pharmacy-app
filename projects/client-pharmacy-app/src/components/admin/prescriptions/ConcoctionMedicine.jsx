import React, { useEffect,useState } from 'react'
import { fetchProducts } from '../../../features/cart/productsSlice'
import { useDispatch,useSelector } from 'react-redux'
import ConversionModal from './ConversionModal'
import { setPrescriptionMedicine } from '../../../features/product/prescriptionSlice'
import { useNavigate } from 'react-router-dom'
function ConcoctionMedicine({ prescription }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [order, setOrder] = useState('ASC')
    const [filter, setFilter] = useState('')
    const [search, setSearch] = useState('')
    const [offset, setOffset] = useState(0)
    const [quantity, setQuantity] = useState(0)
    const [open, setOpen] = useState(false)
    const [unit,setUnit]= useState('')
    const products = useSelector(state=>state.product.products)
    const prescriptionMedicines = useSelector(state=>state.prescriptions.prescriptionMedicine)
    const limit = 0
    const searchHandler = (e) => {
        setSearch(e.target.value)
  }
  const selectedProduct = products.find((product) => product.name === search)
  const stockHabis = quantity == selectedProduct?.retail_remain;
    const selectedMedicines = selectedProduct ? prescriptionMedicines.find((medicine) => medicine.idproduct === selectedProduct.idproduct) : null
    const updateStock = selectedMedicines?selectedProduct.retail_remain - selectedMedicines.quantity: selectedProduct?.retail_remain
  const addMedicineHandler = () => {  
      const adminId = JSON.parse(localStorage.getItem("admin")).idadmin;
      let product = {
        idadmin:adminId,
        iduser :prescription.iduser,
        idprescription : prescription.idprescription,
        idproduct:selectedProduct.idproduct,
        name: selectedProduct.name,
        quantity: quantity,
        unit: unit,
        price: unit == selectedProduct.unitname ? (selectedProduct.price / selectedProduct.quantity) * quantity : (selectedProduct.price * quantity),
        weight : unit == selectedProduct.unitname ?(selectedProduct.weight * quantity):(selectedProduct.weight/selectedProduct.quantity)* quantity,
        status: selectedProduct.unitname == unit?'converted':'default'
      }
      dispatch(setPrescriptionMedicine(product))
        
    }

    useEffect(() => {
        dispatch(fetchProducts(order,filter,search,offset,limit))
    },[search,unit,selectedProduct])
  return (
    <div className='flex flex-col gap-3 justify-center items-center'> 
      <div className='flex flex-col gap-2'>
    <div className=' relative inline-block  '>   
        <input type="text" placeholder='Search Medicine' value={search} className={`lg:w-60 w-30  border-black relative ${open?'':'z-10'} h-8 bg-slate-100 rounded-md p-2`}
       onChange={(e)=>searchHandler(e)} />
        <select name="" id="" className=' absolute lg:w-72 w-56 h-8  left-0  border-black  bg-slate-100 rounded-md p-2'
          onChange={(e) => setSearch(e.target.value)}>
            <option value="">Select Medicine</option>
            {products.map((product) => {
              return <option value={product.name} >{product.name }</option>
            })}
    </select>
            </div>  
      <select className=' lg:w-72 w-52 h-8 bg-slate-100 rounded-md'
        onChange={(e) => setUnit(e.target.value)}>
        <option value=''>Select Unit</option>
        <option value={selectedProduct?.unit_product }>{selectedProduct?.unit_product }</option>
        <option value={selectedProduct?.unitname}>{selectedProduct?.unitname }</option>
      </select>
      </div>
    <div className='flex gap-4'>    
    <div className='flex flex-col  justify-center items-center gap-5'>   
    {selectedProduct && unit ? (
  selectedProduct.unitname == selectedProduct.unit_product || selectedProduct.unitname == null ? (
<div
  className="mb-4 rounded-lg bg-red-100 px-6 py-5 text-base text-danger-700"
  >
 <p> You Can't Make Conversion, Please Check Unit Conversion Page</p>
 <p> To Access This Medicine</p>
  <a href='' onClick={()=>navigate('/admin/products/unit-conversion')} className="font-bold text-danger-700">Unit Conversion Page</a>
</div>
                      ) :
  <>
<div className='flex items-center justify-center'>
  <button
    onClick={() => setQuantity(quantity - 1)}
    disabled={quantity === 0}
    className='bg-red-100 text-gray-500 hover:bg-red-200 hover:text-gray-600 px-3 py-2 rounded-l-lg'
  >
    -
  </button>
  <input
    type='number'
    value={quantity}
    onChange={(e) => setQuantity(Number(e.target.value))}
    className='w-16 px-3 py-2 border-t border-b border-gray-300  text-center focus:outline-none focus:ring focus:border-blue-300'
  />
  <button
    onClick={() => setQuantity(quantity + 1)}
    disabled={stockHabis}
    className='bg-emerald-300 text-gray-500 hover:bg-emerald-400 hover:text-gray-600 px-3 py-2 rounded-r-lg'
  >
    +
  </button>
</div>
      <p>{`Available Stock: ${ unit == selectedProduct.unitname ? updateStock : selectedProduct.stock} ${unit}`}</p>
      <div className='flex justify-end gap-5'>
        <ConversionModal product={selectedProduct} order={order} filter={filter} search={search} offset={offset} open={open} setOpen = {setOpen} />
        <button className='border-2 border-green-300 font-bold h-10 px-2 rounded-md hover:bg-emerald-500 hover:text-white text-emerald-500 right-0'
          onClick={() => addMedicineHandler()}>Add Medicine</button>
      </div>
    </>
) : null}
        </div>
    </div>
</div>

  )

}

export default ConcoctionMedicine