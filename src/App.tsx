import React, { FC } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BookList from './BookList';
import Login from './LoginPage';
import Home from './HomePage';
import Order from './OrderPage';



const App: FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BookList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/orders" element={<Order />} />
      </Routes>
    </Router>
  );
};

export default App;
