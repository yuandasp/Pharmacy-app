import React from 'react';

function DiscountTypeCard({ discountType, handleDiscountTypeChange,setTitle,setDescription }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      {/* First Card */}
      <h2 className="text-lg font-bold">Discount Type</h2>
      {/* Card content */}
      <div className="flex items-center mt-4">
        <input
          type="radio"
          id="productDiscount"
          name="discountType"
          value="Product Discount"
          className="mr-2"
          checked={discountType === "Product Discount"}
          onChange={handleDiscountTypeChange}
        />
        <label htmlFor="productDiscount">Product Discount</label>
      </div>
      <div className="flex items-center mt-2">
        <input
          type="radio"
          id="transactionDiscount"
          name="discountType"
          value="Transaction Discount"
          className="mr-2"
          checked={discountType === "Transaction Discount"}
          onChange={handleDiscountTypeChange}
        />
        <label htmlFor="transactionDiscount">Transaction Discount</label>
      </div>
      <div className="flex items-center mt-2">
        <input
          type="radio"
          id="bonusItem"
          name="discountType"
          value="Bonus Item"
          className="mr-2"
          checked={discountType === "Bonus Item"}
          onChange={handleDiscountTypeChange}
        />
        <label htmlFor="transactionDiscount">Bonus Item</label>
      </div>
      <div className="mt-4">
        <label htmlFor="title" className="text-sm font-bold">
          Title:
        </label>
        <input
          type="text"
          id="title"
          name="title"
          className="w-full py-1 px-2 mt-1 border border-gray-300 rounded-md"
          placeholder="Enter a title"
          disabled={!discountType}
          onChange={(e)=>setTitle(e.target.value)}
        />
      </div>
      <div className="mt-4">
        <label htmlFor="description" className="text-sm font-bold">
          Description:
        </label>
        <textarea
          id="description"
          name="description"
          rows="4"
          className="w-full py-1 px-2 mt-1 border border-gray-300 rounded-md"
          placeholder="Enter a description"
          disabled={!discountType}
          onChange={(e)=>setDescription(e.target.value)}
        ></textarea>
      </div>
    </div>
  );
}

export default DiscountTypeCard;
