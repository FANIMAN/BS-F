import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Modal component
const BuyModal: React.FC<{ book: any; onClose: () => void; setUser: React.Dispatch<React.SetStateAction<{ id: number; name: string; email: string; points: number; role: string } | null>> }> = ({ book, onClose, setUser }) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [orderResponse, setOrderResponse] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [selectedBook, setSelectedBook] = useState<any | null>(null); // Define selectedBook state


  const handleBuy = async () => {
    try {
      // Fetch user information from localStorage
      const storedUser = localStorage.getItem('loggedInUser');
      if (!storedUser) {
        throw new Error('User information not found');
      }
      const user = JSON.parse(storedUser);
  
      // Fetch the book's price from the selected book
      const totalPrice = book.price * quantity;
  
      // Fetch user's points from the backend
      const response = await fetch(`http://localhost:4000/users/${user.id}`);
      const userData = await response.json();
      const userPoints = userData.points;
  
      // Check if the user has enough points to make the purchase
      if (userPoints < totalPrice) {
        throw new Error('Insufficient points to make the purchase');
      }
  
      // Create the order
      const data = {
        customerId: user.id,
        bookId: book.id,
        quantity: quantity,
      };
      const orderResponse = await fetch('http://localhost:4000/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!orderResponse.ok) {
        throw new Error('Failed to place order');
      }
  
      // Deduct points from the user's account
      const updatedPoints = userPoints - totalPrice;
      await fetch(`http://localhost:4000/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ points: updatedPoints }),
      });
  
      // Update the user's points in the local storage and state
      const updatedUser = { ...user, points: updatedPoints };
      localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
  
      setOrderResponse({ message: 'Order Placed Successfully', type: 'success' });
      onClose(); // Close modal
    } catch (error) {
      console.error('Error placing order:', error);
      setOrderResponse({ message: (error as Error).message, type: 'error' });
    }
  
    // Automatically clear the response message after 5 seconds
    setTimeout(() => {
      setOrderResponse(null);
    }, 5000);
  };
  
  


  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1000 }}>
      <div style={{ backgroundColor: '#fff', padding: 20, borderRadius: 8, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: 20 }}>{book.title}</h2>
        <p style={{ color: '#666', marginBottom: 20 }}>By {book.writer}</p>
        <p style={{ fontWeight: 'bold', marginBottom: 20 }}>${book.price}</p>
        <div style={{ marginBottom: 20 }}>
          <label htmlFor="quantity" style={{ display: 'block', fontWeight: 'bold', marginBottom: 10 }}>Quantity:</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            style={{ width: '100%', border: '1px solid #ccc', borderRadius: 4, padding: 8 }}
            min={1}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button onClick={handleBuy} style={{ backgroundColor: '#1a9ed6', color: '#fff', padding: '8px 16px', borderRadius: 4, cursor: 'pointer' }}>Order</button>
          <button onClick={onClose} style={{ backgroundColor: '#ccc', color: '#333', padding: '8px 16px', borderRadius: 4, cursor: 'pointer', marginLeft: 10 }}>Cancel</button>
        </div>
      </div>
      {orderResponse && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: 10, borderRadius: 5, backgroundColor: orderResponse.type === 'success' ? 'green' : 'red', color: '#fff', zIndex: 1001 }}>
          {orderResponse.message}
        </div>
      )}
    </div>
  );
};

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ id: number; name: string; email: string; points: number; role: string } | null>(null);
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedBook, setSelectedBook] = useState<any | null>(null); // New state to store selected book for modal

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    } else {
      navigate('/');
    }
    fetchBooks();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('token');
    navigate('/');
  };

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/books');
      const data = await response.json();
      setBooks(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching books:', error);
      setLoading(false);
    }
  };

  const handleUpdateBook = (book: any) => {
    setSelectedBook(book); // Set selected book when "Buy" button is clicked
  };

  const closeModal = () => {
    setSelectedBook(null); // Close modal
  };

  return (
    <div>

      <header className="flex justify-between items-center bg-gray-200 p-4">
        <h1 className="text-2xl font-bold">Book Store</h1>
        <div className="flex items-center">
          <span className="mr-4">Welcome, {user && user.name}!</span>
          {user && user.role === 'customer' && <span className="mr-4">Points: {user.points}</span>} {/* Display user's points only if role is customer */}
          <Link to="/orders" className="mr-4 text-blue-500 hover:text-blue-600">Orders</Link>
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">
            Logout
          </button>
        </div>
      </header>

      <div className="px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {books.map((book) => (
          <div key={book.id} className="bg-white p-4 rounded-lg shadow-md relative">
            <img src={book.image} alt={book.title} className="w-full h-48 object-cover mb-4" />
            <h3 className="text-xl font-semibold mb-2">{book.title}</h3>
            <p className="text-gray-600 mb-2">By {book.writer}</p>
            <p className="text-gray-800 font-bold">${book.price}</p>
            <div className="mt-2">
              {book.tags.map((tag: string, index: number) => (
                <span key={index} className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-2">{tag}</span>
              ))}
            </div>
            <button className="absolute bottom-4 right-4 bg-cyan-500 hover:bg-cyan-600 text-white py-2 px-3 rounded" onClick={() => handleUpdateBook(book)}>Buy</button>
          </div>
        ))}
      </div>

      {loading && <p>Loading...</p>}

      {/* Render modal when selectedBook is not null */}
      {selectedBook && <BuyModal book={selectedBook} onClose={closeModal} setUser={setUser} />}
    </div>
  );
};



export default HomePage;
