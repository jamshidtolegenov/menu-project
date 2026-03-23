import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { sendOrderToTelegram } from '../utils/telegram.js';
import './Success.css';

const Success = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useCart();

  // const [telegramStatus, setTelegramStatus] = useState('sending'); доработаю

  const orderData = location.state || null;

  useEffect(() => {
    // Очищаем корзину
    clearCart();

    // Отправляем уведомление в Telegram
    if (orderData) {
      sendOrderToTelegram(orderData)
        .then(ok => setTelegramStatus(ok ? 'sent' : 'error'))
        .catch(() => setTelegramStatus('error'));
    } else {
      setTelegramStatus('error');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="success-page">
      <div className="success-container">

        {/* Анимация */}
        <div className="success-animation">
          <div className="checkmark-ring">
            <div className="checkmark">✓</div>
          </div>
        </div>

        <h1 className="success-title">Ваш заказ успешно оформлен!</h1>
        <p className="success-message">
          Спасибо за покупку! Мы уже обрабатываем ваш заказ.
        </p>

        {/* Состав заказа */}
        {orderData && (
          <div className="order-summary-block">
            <h3 className="order-summary-title">📦 Ваш заказ</h3>

            <div className="order-items-list">
              {orderData.items.map(item => (
                <div key={item.id} className="order-item-row">
                  <img src={item.image} alt={item.name} className="order-item-img" />
                  <div className="order-item-details">
                    <span className="order-item-name">{item.name}</span>
                    <span className="order-item-qty">× {item.quantity}</span>
                  </div>
                  <span className="order-item-total">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="order-totals">
              <div className="order-total-row">
                <span>Доставка</span>
                <span>${orderData.delivery.toFixed(2)}</span>
              </div>
              {orderData.discount > 0 && (
                <div className="order-total-row discount-line">
                  <span>Скидка</span>
                  <span>−${orderData.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="order-total-row final-line">
                <span>Итого</span>
                <span>${orderData.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Статус Telegram */}
        {/* <div className={`telegram-status tg-${telegramStatus}`}>
          {telegramStatus === 'sending' && (
            <>
              <span className="tg-spinner">⟳</span>
              Отправляем уведомление в Telegram...
            </>
          )}
          {telegramStatus === 'sent' && (
            <>
              <span>✈️</span>
              Уведомление отправлено в Telegram-бот
            </>
          )}
          {telegramStatus === 'error' && (
            <>
              <span>⚠️</span>
              Не удалось отправить в Telegram — проверьте Chat ID в <code>src/utils/telegram.js</code>
            </>
          )}
        </div> */}

        {/* Информационные карточки если нужно будет добавлю */}
        {/* <div className="success-details">
          <div className="detail-card">
            <span className="detail-icon">⏱️</span>
            <div className="detail-content">
              <span className="detail-label">Время доставки</span>
              <span className="detail-value">30–40 минут</span>
            </div>
          </div>
          <div className="detail-card">
            <span className="detail-icon">📍</span>
            <div className="detail-content">
              <span className="detail-label">Статус заказа</span>
              <span className="detail-value">В профиле</span>
            </div>
          </div>
        </div> */}

        <button className="new-order-btn" onClick={() => navigate('/')}>
          ВЕРНУТЬСЯ В МЕНЮ
        </button>

      </div>
    </div>
  );
};

export default Success;
