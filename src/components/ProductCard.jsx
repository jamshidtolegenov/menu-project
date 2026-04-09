import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { Heart, ShoppingCart } from 'lucide-react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [isFavorite, setIsFavorite] = useState(false);

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

  const handleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(prev => !prev);
  };

  return (
    <div className="product-card" onClick={handleCardClick}>
      <div className="product-image-wrapper">

        <img
          src={product.thumbnail}
          alt={product.title}
          className="product-image"
          loading="lazy"
        />

        {/* Кнопка избранного */}
        <button
          className={`product-favorite ${isFavorite ? 'product-favorite--active' : ''}`}
          onClick={handleFavorite}
          aria-label="Добавить в избранное"
        >
          <Heart
            size={18}
            fill={isFavorite ? '#ff6b6b' : 'none'}
            color={isFavorite ? '#ff6b6b' : '#fff'}
          />
        </button>

        {/* Оверлей с градиентом и инфо */}
        <div className="product-overlay">
          <div className="product-info">
            <h3 className="product-title">{product.title}</h3>
            <p className="product-category">{product.category}</p>
            <div className="product-meta">
              <span className="product-price">
                <span className="price-icon">🏷️</span>
                ${product.price}
              </span>
              <span className="product-rating">
                <span className="rating-icon">⭐</span>
                {product.rating}
              </span>
            </div>
          </div>

          <button className="product-cart-btn" onClick={handleAddToCart}>
            <ShoppingCart size={16} />
            В корзину
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProductCard;
