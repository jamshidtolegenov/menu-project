import React, { createContext, useState, useContext, useEffect } from 'react';
import { userProfile as defaultProfile } from '../utils/mockData.jsx';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // Профиль пользователя
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : defaultProfile;
  });

  const updateUserProfile = (newData) => {
    const updated = { ...userProfile, ...newData };
    setUserProfile(updated);
    localStorage.setItem('userProfile', JSON.stringify(updated));
  };

  // Темная тема
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    const saved = localStorage.getItem('darkTheme');
    return saved ? JSON.parse(saved) : false;
  });

  // Настройки уведомлений
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    const saved = localStorage.getItem('notifications');
    return saved ? JSON.parse(saved) : true;
  });

  // История заказов и статистика
  const [orderHistory, setOrderHistory] = useState(() => {
    const saved = localStorage.getItem('orderHistory');
    return saved ? JSON.parse(saved) : [];
  });

  // Модальное окно редактирования профиля
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  useEffect(() => {
    if (isDarkTheme) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    localStorage.setItem('darkTheme', JSON.stringify(isDarkTheme));
  }, [isDarkTheme]);

  // Сохранение настроек уведомлений
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notificationsEnabled));
  }, [notificationsEnabled]);

  // Сохранение истории заказов
  useEffect(() => {
    localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
  }, [orderHistory]);

  // Добавление заказа
  const addOrder = (orderData) => {
    const newOrder = {
      id: Date.now(),
      date: new Date().toISOString(),
      items: orderData.items,
      total: orderData.total,
      status: 'completed'
    };
    
    setOrderHistory(prev => [newOrder, ...prev]);
    
    // Показать уведомление
    if (notificationsEnabled) {
      showNotification('Заказ оформлен!', 'Ваш заказ успешно принят в обработку');
      playNotificationSound();
    }
  };

  // Звуковое уведомление
  const playNotificationSound = () => {
    // Создаем простой звуковой сигнал используя Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  // Показать браузерное уведомление
  const showNotification = (title, body) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/favicon.ico' });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(title, { body, icon: '/favicon.ico' });
        }
      });
    }
  };

  // Статистика
  const getTotalOrders = () => orderHistory.length;
  
  const getTotalSpent = () => {
    return orderHistory.reduce((sum, order) => sum + order.total, 0);
  };

  const toggleDarkTheme = () => setIsDarkTheme(prev => !prev);
  const toggleNotifications = () => setNotificationsEnabled(prev => !prev);

  return (
    <AppContext.Provider
      value={{
        userProfile,
        updateUserProfile,
        isDarkTheme,
        toggleDarkTheme,
        notificationsEnabled,
        toggleNotifications,
        orderHistory,
        addOrder,
        getTotalOrders,
        getTotalSpent,
        isEditProfileOpen,
        setIsEditProfileOpen,
        playNotificationSound,
        showNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
