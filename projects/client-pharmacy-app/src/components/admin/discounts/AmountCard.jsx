import React from 'react';

function AmountCard({ discountType, setPercentage, setMinimum, setMinimumItem, setBonusItem }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      {/* Second Card */}
      <h2 className="text-lg font-bold">Amount</h2>
      {/* Card content */}
      {discountType === 'Transaction Discount' ? (
        <div className="flex gap-4 mt-4">
          <div>
            <label htmlFor="minimumTransaction" className="text-sm font-bold">
              Minimum Transaction:
            </label>
            <input
              type="number"
              id="minimumTransaction"
              name="minimumTransaction"
              className="w-full py-1 px-2 mt-1 border border-gray-300 rounded-md"
              placeholder="Enter minimum transaction amount"
              onChange={(e) => setMinimum(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="percentage" className="text-sm font-bold">
              Percentage:
            </label>
            <input
              type="number"
              id="percentage"
              name="percentage"
              className="w-full py-1 px-2 mt-1 border border-gray-300 rounded-md"
              placeholder="Enter percentage"
              onChange={(e) => setPercentage(e.target.value)}
            />
          </div>
        </div>
      ) : discountType === 'Bonus Item' ? (
        <div className="flex gap-4 mt-4">
          <div>
            <label htmlFor="minimumItem" className="text-sm font-bold">
              Minimum Item:
            </label>
            <input
              type="number"
              id="minimumItem"
              name="minimumItem"
              className="w-full py-1 px-2 mt-1 border border-gray-300 rounded-md"
              placeholder="Enter minimum item quantity"
              onChange={(e) => setMinimumItem(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="bonusItem" className="text-sm font-bold">
              Bonus Item:
            </label>
            <input
              type="number"
              id="bonusItem"
              name="bonusItem"
              className="w-full py-1 px-2 mt-1 border border-gray-300 rounded-md"
              placeholder="Enter bonus item quantity"
              onChange={(e) => setBonusItem(e.target.value)}
            />
          </div>
        </div>
      ) : (
        <div className="mt-4">
          <label htmlFor="percentage" className="text-sm font-bold">
            Percentage:
          </label>
          <input
            type="number"
            id="percentage"
            name="percentage"
            className="w-full py-1 px-2 mt-1 border border-gray-300 rounded-md"
            placeholder="Enter percentage"
            onChange={(e) => setPercentage(e.target.value)}
          />
        </div>
      )}
    </div>
  );
}

export default AmountCard;
