import React, { useState, useEffect } from 'react';
import { Tr, Td, Checkbox, Stack } from '@chakra-ui/react';

function ProductsDiscountRow({
  product,
  discount,
  onProductCheck,
  selectAll,
}) {
  const [promo, setPromo] = useState(product.idpromo === discount.idpromo);

  useEffect(() => {
  setPromo(product.idpromo === discount.idpromo);
}, [product.idpromo, discount.idpromo]);

const handleCheckboxChange = (isChecked) => {
    setPromo(isChecked);
    onProductCheck(product.idproduct, isChecked);
  };

  useEffect(() => {
    if (selectAll) {
      setPromo(true);
      onProductCheck(product.idproduct, true);
    } 
  }, [selectAll]);
  useEffect(() => {
    onProductCheck(product.idproduct, promo);
  }, [promo])
  return (
    <Tr>
      <Td>{product.name}</Td>
      <Td>{product.stock}</Td>
      <Td>{product.price}</Td>
      <Td>{promo ? 'Assigned' : 'Not Assigned'}</Td>
      <Td>
        <Stack pl={6} mt={1} spacing={1}>
          <Checkbox
            isChecked={promo || selectAll} // Update isChecked prop
            onChange={(e) => handleCheckboxChange(e.target.checked)}
          >
          </Checkbox>
          {/* Add more child checkboxes as needed */}
        </Stack>
      </Td>
    </Tr>
  );
}

export default ProductsDiscountRow;
