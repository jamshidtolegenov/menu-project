import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useApp } from '../context/AppContext.jsx';
import './DishDetail.css';

const DishDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useApp();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`https://dummyjson.com/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Товар не найден');
        return res.json();
      })
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      name: product.title,
      price: product.price,
      image: product.thumbnail,
      description: product.description,
      rating: product.rating,
    };
    addToCart(cartItem);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleFavorite = () => {
    toggleFavorite(product.id);
  };

  if (loading) {
    return (
      <div className="dish-detail-page">
        <div className="detail-loading">
          <div className="spinner"></div>
          <p>Загрузка товара...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="dish-detail-page">
        <div className="not-found">
          <p>😕 {error || 'Товар не найден'}</p>
          <button onClick={() => navigate('/')}>Вернуться в меню</button>
        </div>
      </div>
    );
  }

  const favorite = isFavorite(product.id);

  const discountedPrice = product.discountPercentage
    ? Math.round(product.price * (1 - product.discountPercentage / 100))
    : null;

  return (
    <div className="dish-detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Назад
      </button>

      <div className="dish-detail-container">
        {/* Галерея изображений */}
        <div className="dish-image-section">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="dish-detail-image"
          />
          {product.images && product.images.length > 1 && (
            <div className="image-thumbnails">
              {product.images.slice(0, 4).map((img, i) => (
                <img key={i} src={img} alt={`${product.title} ${i + 1}`} className="thumb-img" />
              ))}
            </div>
          )}
        </div>

        {/* Информация */}
        <div className="dish-info-section">
          <div className="dish-top-row">
            <span className="detail-category-badge">{product.category}</span>
            <button
              className={`detail-favorite-btn ${favorite ? 'active' : ''}`}
              onClick={handleFavorite}
            >
              {favorite ? '❤️' : '🤍'}
            </button>
          </div>

          <h1 className="dish-title">{product.title}</h1>
          <p className="dish-brand">Бренд: <strong>{product.brand || '—'}</strong></p>

          <div className="dish-meta">
            <div className="meta-item">
              <span className="meta-label">Цена</span>
              <div className="price-block">
                <span className="meta-value price-value">${product.price}</span>
                {product.discountPercentage > 0 && (
                  <span className="discount-badge">−{Math.round(product.discountPercentage)}%</span>
                )}
              </div>
            </div>
            <div className="meta-item">
              <span className="meta-label">Рейтинг</span>
              <span className="meta-value rating-value">{product.rating} ⭐</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">В наличии</span>
              <span className={`meta-value stock-value ${product.stock > 0 ? 'in-stock' : 'out-stock'}`}>
                {product.stock > 0 ? `${product.stock} шт.` : 'Нет'}
              </span>
            </div>
          </div>

          <div className="description-section">
            <h3 className="section-title">Описание</h3>
            <p className="dish-description">{product.description}</p>
          </div>

          {product.tags && product.tags.length > 0 && (
            <div className="tags-section">
              {product.tags.map(tag => (
                <span key={tag} className="tag-chip">{tag}</span>
              ))}
            </div>
          )}

          <div className="detail-actions">
            <button
              className={`add-to-cart-header-btn ${addedToCart ? 'added' : ''}`}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              {addedToCart ? '✓ Добавлено!' : '🛒 В корзину'}
            </button>
            <button className="go-cart-btn" onClick={() => navigate('/cart')}>
              Перейти в корзину
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DishDetail;
