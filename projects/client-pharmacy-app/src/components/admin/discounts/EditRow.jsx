import React, { useState } from 'react';
import { Tr, Td, Button, Input } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { currency } from '../../../helpers/currency';
import { editDiscount } from '../../../features/promo/promoSlice';

function EditRow({ discount, count,setEdit }) {
  const dispatch = useDispatch();
  const [name, setName] = useState(discount.name);
  const [description, setDescription] = useState(discount.description);
  const [condition, setCondition] = useState(discount.condition);
  const [discountSum, setDiscountSum] = useState(discount.discount);

  const handleSave = () => {
    const editedData = {
        name: name,
        description: description,
        condition: condition,
        discount:discountSum
    }
    dispatch(editDiscount(discount.idpromo,editedData))
  setEdit(false); 
}; 

  return (
    <Tr>
      <Td>{count}</Td>
      <Td>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </Td>
      <Td>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Td>
      <Td>
        <Input
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
        />
      </Td>
      <Td>
        <Input
          value={discountSum}
          onChange={(e) => setDiscountSum(e.target.value)}
        />
      </Td>
      <Td>{discount.type}</Td>
      <Td className='flex gap-3'>
        <Button colorScheme="red" size="sm" onClick={()=>setEdit(false)}>
          cancel
        </Button>
        <Button colorScheme="teal" size="sm" onClick={()=>handleSave()}>
          Save
        </Button>
      </Td>
    </Tr>
  );
}

export default EditRow;
