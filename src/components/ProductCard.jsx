import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleCardClick = () => {
    navigate(`/dish/${product.id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    const cartItem = {
      id: product.id,
      name: product.title,
      price: product.price,
      image: product.thumbnail,
      description: product.description,
      rating: product.rating,
    };
    addToCart(cartItem);
  };

  return (
    <div className="product-card" onClick={handleCardClick}>
      <div className="product-image-wrapper">
        <img src={product.thumbnail} alt={product.title} className="product-image" />
        {/* <span className="product-category-badge">{product.category}</span> */}
      </div>

      <div className="product-content">
        <h3 className="product-title">{product.title}</h3>
        {/* <p className="product-description">{product.description}</p> */}

        {/* <div className="product-rating">
          <span className="rating-star">⭐</span>
          <span className="rating-value">{product.rating}</span>
        </div> */}

        <div className="product-footer">
          {/* <span className="product-price">${product.price}</span> */}
          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            🛒 В корзину
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
