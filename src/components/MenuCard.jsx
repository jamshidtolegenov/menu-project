import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import './MenuCard.css';

const MenuCard = ({ item }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleCardClick = () => {
    navigate(`/dish/${item.id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(item);
  };

  return (
    <div className="menu-card" onClick={handleCardClick}>
      <div className="card-image-wrapper">
        <img src={item.image} alt={item.name} className="card-image" />
        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          🛒
        </button>
      </div>
      
      <div className="card-content">
        <div className="card-header">
          <h3 className="card-title">{item.name}</h3>
          <div className="card-rating">
            <span className="rating-value">{item.rating}</span>
            <span className="rating-star">⭐</span>
          </div>
        </div>
        
        <p className="card-description">{item.description}</p>
        
        <div className="card-footer">
          <span className="card-price">${item.price.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
