import React, { useState, useEffect } from 'react';

// Modal component
const BuyModal: React.FC<{ book: any; onClose: () => void }> = ({ book, onClose }) => {
    const [quantity, setQuantity] = useState<number>(1);
  
    const handleBuy = () => {
      // Handle buy logic here
      console.log(`Buying ${quantity} copies of ${book.title}`);
      onClose(); // Close modal
    };
  
    return (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
        <div className="bg-white p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">{book.title}</h2>
          <p className="text-gray-600 mb-4">By {book.writer}</p>
          <p className="text-gray-800 font-bold mb-4">${book.price}</p>
          <div className="mb-4">
            <label htmlFor="quantity" className="block text-sm font-semibold mb-2">Quantity:</label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-full border rounded-md px-3 py-2"
              min={1}
            />
          </div>
          <button onClick={handleBuy} className="bg-cyan-500 hover:bg-cyan-600 text-white py-2 px-4 rounded">Buy</button>
          <button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded ml-4">Cancel</button>
        </div>
      </div>
    );
  };
  

  export default BuyModal;
