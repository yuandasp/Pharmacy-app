import React from 'react'
import { Tr, Td, Button, Input } from '@chakra-ui/react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { deleteCategory, updateCategory } from '../../../features/cartegory/categorySlice'
import Swal from 'sweetalert2'

function CategoryRow({ category, count }) {
  const [update, setUpdate] = useState(false)
  const [name, setName] = useState(category.name)
  const dispatch = useDispatch()
    const updateHandler = () => {
      dispatch(updateCategory(category.idcategory,name))
      setUpdate(false)
    }
    const deleteHandler = async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `You want to Remove  ${category.name} From Categories`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Remove it!'
        }) 
        if (result.isConfirmed) { 
            dispatch(deleteCategory(category.idcategory))
        }    }
  

  return (
    <Tr>
      <Td>{count}</Td>
      <Td>
        {update ? (
          <Input variant='filled' placeholder={category.name} onChange={(e) => setName(e.target.value)} />
        ) : (
          <>{category.name}</>
        )}
      </Td>
      <Td className='flex gap-3'>
        {update ? (
          <>
            <Button colorScheme='red' size='sm' onClick={() => setUpdate(false)}>
              Cancel
            </Button>
            <Button colorScheme='teal' size='sm' onClick={()=>updateHandler()}>
              Save
            </Button>
          </>
        ) : (
          <>
            <Button colorScheme='red' size='sm' onClick={()=>deleteHandler()}>
              Delete 
            </Button>
            <Button colorScheme='teal' size='sm' onClick={() => setUpdate(true)}>
              Update 
            </Button>
          </>
        )}
      </Td>
    </Tr>
  )
}

export default CategoryRow
