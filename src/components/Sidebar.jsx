import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useApp } from '../context/AppContext.jsx';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const { getItemsCount } = useCart();
  const { userProfile } = useApp();
  const cartCount = getItemsCount();

  return (
    <aside className="sidebar">
      <div className="user-profile">
        <div className="avatar">
          <img src={userProfile.avatar} alt={userProfile.name} />
        </div>
        <h2 className="user-name">{userProfile.name}</h2>
        <p className="user-email">{userProfile.email}</p>
      </div>

      <nav className="sidebar-nav">
        <Link 
          to="/" 
          className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
        >
          <span className="nav-icon">📋</span>
          <span className="nav-text">Меню</span>
        </Link>

        <Link 
          to="/cart" 
          className={`nav-item ${location.pathname === '/cart' ? 'active' : ''}`}
        >
          <span className="nav-icon">🛒</span>
          <span className="nav-text">Корзина</span>
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>

        <Link 
          to="/profile" 
          className={`nav-item ${location.pathname === '/profile' ? 'active' : ''}`}
        >
          <span className="nav-icon">👤</span>
          <span className="nav-text">Профиль</span>
        </Link>
      </nav>

      <button className="logout-btn">
        <span className="logout-icon">🚪</span>
        Выйти
      </button>
    </aside>
  );
};

export default Sidebar;
