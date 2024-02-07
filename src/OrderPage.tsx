import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ id: number; name: string; email: string; points: number; role: string } | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchOrders(parsedUser.id);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchOrders = async (userId: number) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:4000/orders/customer/${userId}`);
      const data = await response.json();
      console.log(data);
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleCancelOrder = async (orderId: number) => {
    try {
      const response = await fetch(`http://localhost:4000/orders/${orderId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setMessage('Order cancelled successfully');
        setTimeout(() => {
          setMessage(null);
        }, 5000);
        // Fetch the updated list of orders after successful cancellation
        fetchOrders(user?.id || 0); // Assuming user is not null here, and passing userId to fetchOrders
      } else {
        throw new Error('Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      setMessage('Failed to cancel order');
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  return (
    <div>
      <header className="flex justify-between items-center bg-gray-200 p-4">
        <h1 className="text-2xl font-bold">Book Store</h1>
        <div className="flex items-center">
          <span className="mr-4">Welcome, {user && user.name}!</span>
          {user && user.role === 'customer' && <span className="mr-4">Points: {user.points}</span>} {/* Display user's points only if role is customer */}
          <Link to="/home" className="mr-4 text-blue-500 hover:text-blue-600">Home</Link>
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">
            Logout
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Orders</h2>
        {loading && <p>Loading...</p>}
        {!loading && orders.length === 0 && <p>No orders found.</p>}
        {!loading && orders.length > 0 && (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3"></th> {/* Empty column for cancel button */}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.book_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{order.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button onClick={() => handleCancelOrder(order.id)} className="text-red-600 hover:text-red-800">Cancel Order</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Display message if any */}
      {message && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white py-2 px-4 rounded shadow-md">
          {message}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
