import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);         // процент скидки
  const [discountAmount, setDiscountAmount] = useState(0); // сумма скидки

  const addToCart = (item) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id);
      if (existingItem) {
        return prevItems.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const PROMO_CODES = {
    'PROMO10': 10,
    'PROMO20': 20,
  };

  const applyPromoCode = (code) => {
    const percent = PROMO_CODES[code.toUpperCase()];
    if (percent) {
      setPromoCode(code.toUpperCase());
      setDiscount(percent);
    } else {
      setPromoCode('');
      setDiscount(0);
    }
  };

  const getSubtotal = () =>
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const getTotalPrice = () => {
    const subtotal = getSubtotal();
    const amount = discount > 0 ? (subtotal * discount) / 100 : 0;
    setDiscountAmount(amount);
    return subtotal - amount;
  };

  const getItemsCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const clearCart = () => {
    setCartItems([]);
    setPromoCode('');
    setDiscount(0);
    setDiscountAmount(0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        applyPromoCode,
        getTotalPrice,
        getSubtotal,
        getItemsCount,
        clearCart,
        promoCode,
        discount,
        discountAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
