import React from 'react'

function ConvertedUnitCard({product}) {
  return (
    <div className="flex flex-col justify center items-center max-w-sm rounded overflow-hidden shadow-lg py-4">
          <img
        src={
          product.product_image
            ? `${process.env.REACT_APP_API_BE}/${product.product_image}`
            : "../assets/icon-medicine.png"
        }
        alt=""
        width="72px"
      />
          <div className="px-6 py-4 text-center">
              <h1 className="font-bold text-xl mb-2">{product.name}</h1>
              <p className="text-gray-700 text-base">
              Stock: {product.stock} {product.unit_product}
            </p>
             
            
              </div>
      </div>
  )
}

export default ConvertedUnitCard