import React, { useEffect, useState } from 'react'
import {
    Tr,
    Td,
} from '@chakra-ui/react'
import { Button,Select } from '@chakra-ui/react'
import { useDispatch } from 'react-redux'
import { changeDefaultUnit, fetchUnitConversionRules, removeRuleProduct, setConversionRules } from '../../../features/cart/productsSlice'
import { useSelector } from 'react-redux'
import Swal from 'sweetalert2'

function ProductsConversionRow({ product,order,filter,search }) {
    const dispatch = useDispatch()
    const[idUnit,setIdUnit]=useState(0)
    const rules = useSelector(state => state.product.convertedUnit)
    const sisaEceran = product.unit_product == product.unitname ?(product.stock % product.quantity)+product.retail_remain:product.retail_remain
    const setRulesHandler = async() => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `You want to Assign Rules to ${product.name}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, assign it!'
        })
        if (result.isConfirmed) {
            dispatch(setConversionRules(product.idproduct,idUnit,order,filter,search))
            
        }
    }
    const calculateConvertedStock = () => {
        if (product.quantity) {
            if (product.unitname == product.unit_product) {
                return (Math.floor(product.stock / product.quantity))
            } else {
                return (product.stock * product.quantity)
            }
            
        }
    }
    const changeDefaultHandler = async() => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `You want to Change ${product.name} Default Unit`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Change it!'
        }) 
        if (result.isConfirmed) {
            const unit = product.unit_product == product.unitname ? product.unit_set : product.unitname
            const stock = calculateConvertedStock()
            dispatch(changeDefaultUnit(product.idproduct,unit,stock,order,filter,search))
            
        }
    }
    const deleteHandler = async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `You want to Remove Conversion Rule From ${product.name}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Remove it!'
        }) 
        if (result.isConfirmed) { 
            dispatch(removeRuleProduct(product.idproduct,order,filter,search))
        }
        
    }
    useEffect(() => {
      dispatch(fetchUnitConversionRules())  
    },[])
  return (
      <Tr>
          <Td>{product.name }</Td>
          <Td>{product.unit_product }</Td>
          <Td>{product.stock }</Td>
          <Td>{product.unitname ? ( product.unitname == product.unit_product ?product.unit_set:product.unitname) :""}</Td>
          <Td>{calculateConvertedStock()}</Td>
          <Td>{sisaEceran}</Td>
          <Td className='flex gap-2'>
             
              {product.unitname?
                  <>
                  <Button colorScheme='teal' size='sm' onClick={()=>deleteHandler()} >
            Remove Rules
                  </Button>
                  <Button colorScheme='teal' size='sm'  onClick={()=>changeDefaultHandler()}>
            Change Default Unit
                  </Button>
                  </>
                  :
                  <>
                   <Select placeholder='Select option'
                   onChange={(e)=>setIdUnit(e.target.value)}>
                       {rules.map((rule) => {
                           if (rule.unit_set == product.unit_product ||rule.unitname == product.unit_product) {
                               
                               return <option key={rule.idunit} value={rule.idunit}>{`1 ${rule.unit_set} = ${rule.quantity} ${rule.unitname}`}</option>
                            }
                        })}
                   </Select>
                  <Button colorScheme='teal' size='sm' onClick={()=>setRulesHandler()}>
            Save
          </Button>
                        </>
            }
          </Td>
      </Tr>
  )
}

export default ProductsConversionRow