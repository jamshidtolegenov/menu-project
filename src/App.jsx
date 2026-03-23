import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext.jsx';
import { AppProvider } from './context/AppContext.jsx';
import Sidebar from './components/Sidebar.jsx';
import Menu from './pages/Menu.jsx';
import Cart from './pages/Cart.jsx';
import DishDetail from './pages/DishDetail.jsx';
import Success from './pages/Success.jsx';
import Profile from './pages/Profile.jsx';
import './App.css';

function App() {
  return (
    <AppProvider>
      <CartProvider>
        <Router>
          <div className="app">
            <Sidebar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Menu />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/dish/:id" element={<DishDetail />} />
                <Route path="/success" element={<Success />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </main>
          </div>
        </Router>
      </CartProvider>
    </AppProvider>
  );
}

export default App;
