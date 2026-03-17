import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import EditProfileModal from '../components/EditProfileModal.jsx';
import './Profile.css';

const Profile = () => {
  const { 
    userProfile,
    isDarkTheme, 
    toggleDarkTheme,
    notificationsEnabled,
    toggleNotifications,
    getTotalOrders,
    getTotalSpent,
    setIsEditProfileOpen
  } = useApp();

  return (
    <div className="profile-page">
      <h1 className="page-title">Профиль</h1>

      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-avatar-large">
            <img src={userProfile.avatar} alt={userProfile.name} />
          </div>

          <h2 className="profile-name">{userProfile.name}</h2>
          <p className="profile-email">{userProfile.email}</p>

          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-value">{getTotalOrders()}</span>
              <span className="stat-label">Заказов</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-value">${getTotalSpent().toFixed(2)}</span>
              <span className="stat-label">Потрачено</span>
            </div>
          </div>
        </div>

        <div className="profile-info-card">
          <h3 className="card-title">Личная информация</h3>
          
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Телефон</span>
              <span className="info-value">{userProfile.phone || '+998 94 585 88 33'}</span>
            </div>
            
            <div className="info-item">
              <span className="info-label">Email</span>
              <span className="info-value">{userProfile.email}</span>
            </div>
            
            <div className="info-item">
              <span className="info-label">Адрес доставки</span>
              <span className="info-value">{userProfile.address || 'г. Ташкент, ул. Амира Темура, 15'}</span>
            </div>
            
            <div className="info-item">
              <span className="info-label">Дата регистрации</span>
              <span className="info-value">10 март 2026</span>
            </div>
          </div>

          <button 
            className="edit-profile-btn"
            onClick={() => setIsEditProfileOpen(true)}
          >
            Редактировать профиль
          </button>
        </div>

        <div className="profile-preferences-card">
          <h3 className="card-title">Настройки</h3>
          
          <div className="preference-list">
            <div className="preference-item">
              <div className="preference-info">
                <span className="preference-icon">🔔</span>
                <div>
                  <p className="preference-name">Уведомления</p>
                  <p className="preference-desc">Получать уведомления о заказах</p>
                </div>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={notificationsEnabled}
                  onChange={toggleNotifications}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="preference-item">
              <div className="preference-info">
                <span className="preference-icon">🌙</span>
                <div>
                  <p className="preference-name">Темная тема</p> 
                  <p className="preference-desc">Включить темный режим</p>
                </div>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox"
                  checked={isDarkTheme}
                  onChange={toggleDarkTheme}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <EditProfileModal />
    </div>
  );
};

export default Profile;
