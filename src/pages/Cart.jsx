import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useApp } from '../context/AppContext.jsx';
import { deliveryPrice } from '../utils/mockData.jsx';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    getTotalPrice,
    getSubtotal,
    applyPromoCode,
    promoCode,
    discount,
    discountAmount,
  } = useCart();

  const { addOrder } = useApp();

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');

  const subtotal = getSubtotal();
  const discounted = getTotalPrice();
  const total = discounted + deliveryPrice;

  const handleApplyPromo = () => {
    applyPromoCode(promoInput);
    if (!['PROMO10', 'PROMO20'].includes(promoInput.toUpperCase())) {
      setPromoError('Промокод не найден');
    } else {
      setPromoError('');
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    addOrder({ items: cartItems, total });

    navigate('/success', {
      state: {
        items: cartItems,
        subtotal,
        delivery: deliveryPrice,
        discount: discountAmount,
        total,
      },
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <h1 className="page-title">Корзина</h1>
        <div className="empty-cart">
          <p className="empty-cart-emoji">🛒</p>
          <p className="empty-cart-text">Ваша корзина пуста</p>
          <p className="empty-cart-hint">Добавьте блюда из меню</p>
          <button className="back-to-menu-btn" onClick={() => navigate('/')}>
            Вернуться в меню
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1 className="page-title">Корзина</h1>

      <div className="cart-items">
        {cartItems.map(item => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.name} className="cart-item-image" />
            
            <div className="cart-item-info">
              <h3 className="cart-item-name">{item.name}</h3>
              <p className="cart-item-price">${item.price.toFixed(2)}</p>
            </div>

            <div className="quantity-controls">
              <button 
                className="quantity-btn"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
              >
                −
              </button>
              <span className="quantity-value">{item.quantity}</span>
              <button 
                className="quantity-btn"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
              >
                +
              </button>
            </div>

            <button 
              className="remove-btn"
              onClick={() => removeFromCart(item.id)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="promo-section">
        <input
          type="text"
          placeholder="Промокод"
          className="promo-input"
          value={promoInput}
          onChange={(e) => { setPromoInput(e.target.value); setPromoError(''); }}
        />
        <button className="promo-btn" onClick={handleApplyPromo}>
          Применить
        </button>
      </div>

      {promoError && (
        <div className="promo-error">✕ {promoError}</div>
      )}

      {discount > 0 && (
        <div className="discount-applied">
          ✓ Промокод {promoCode} применён! Скидка {discount}%
        </div>
      )}

      <div className="cart-summary">
        <div className="summary-row">
          <span className="summary-label">Промежуточный итог</span>
          <span className="summary-value">${subtotal.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span className="summary-label">Доставка</span>
          <span className="summary-value">${deliveryPrice.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="summary-row discount-row">
            <span className="summary-label">Скидка ({promoCode}, {discount}%)</span>
            <span className="summary-value discount-value">−${discountAmount.toFixed(2)}</span>
          </div>
        )}
        <div className="summary-row total-row">
          <span className="summary-label">Итого</span>
          <span className="summary-value total-value">${total.toFixed(2)}</span>
        </div>
      </div>

      <button className="checkout-btn" onClick={handleCheckout}>
        ОФОРМИТЬ
      </button>
    </div>
  );
};

export default Cart;
