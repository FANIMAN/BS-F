import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface Book {
  id: string;
  title: string;
  writer: string;
  image: string;
  price: number;
  tags: string[];
}

const BookList: React.FC = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
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

    fetchBooks();
  }, []);

  const handleUpdateBook = (id: string) => {
    // Handle update logic here
    navigate('/login');
    console.log(`Updating book with ID: ${id}`);
  };

  return (
    <div>
      {/* Header with Login button */}
      <header className="flex justify-between items-center p-4 bg-gray-800 text-white border-b border-gray-600">
        <h1 className="text-2xl font-bold">Book Store</h1>
        <Link to="/login" className="text-white bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded">
          Login
        </Link>
      </header>

      <div className="px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {books.map((book) => (
          <div key={book.id} className="bg-white p-4 rounded-lg shadow-md relative">
            <img src={book.image} alt={book.title} className="w-full h-48 object-cover mb-4" />
            <h3 className="text-xl font-semibold mb-2">{book.title}</h3>
            <p className="text-gray-600 mb-2">By {book.writer}</p>
            <p className="text-gray-800 font-bold">${book.price}</p>
            <div className="mt-2">
              {book.tags.map((tag, index) => (
                <span key={index} className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-2">{tag}</span>
              ))}
            </div>
            {/* Update button */}
            <button className="absolute bottom-4 right-4 bg-cyan-500 hover:bg-cyan-600 text-white py-2 px-3 rounded" onClick={() => handleUpdateBook(book.id)}>Buy</button>
          </div>
        ))}
      </div>

      {loading && <p>Loading...</p>}
    </div>
  );
};

export default BookList;
