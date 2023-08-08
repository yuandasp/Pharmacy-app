import React from 'react'
import { Tr, Td, Button } from '@chakra-ui/react';
import { parse, format } from "date-fns";



function ReportPromoRow({promo}) {
  return (
      <Tr>
          <Td>{promo.product_name }</Td>
          <Td>{promo.promo_name }</Td>
          <Td>{promo.description }</Td>
          <Td> {
                 format(
                        Date.parse(promo.waiting_date),
                        " dd-MMMM-yyyy, HH:mm:ss"
                      )
                    }</Td>
    </Tr>
  )
}

export default ReportPromoRow