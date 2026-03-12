import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.jsx';
import './EditProfileModal.css';

const EditProfileModal = () => {
  const { isEditProfileOpen, setIsEditProfileOpen, userProfile, updateUserProfile } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  // Синхронизируем форму с актуальным профилем при открытии
  useEffect(() => {
    if (isEditProfileOpen) {
      setFormData({
        name: userProfile.name,
        email: userProfile.email,
        phone: userProfile.phone || '+998 94 585 88 33',
        address: userProfile.address || 'г. Ташкент, ул. Амира Темура, 15'
      });
    }
  }, [isEditProfileOpen, userProfile]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUserProfile(formData);
    setIsEditProfileOpen(false);
  };

  if (!isEditProfileOpen) return null;

  return (
    <div className="modal-overlay" onClick={() => setIsEditProfileOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Редактировать профиль</h2>
          <button 
            className="modal-close"
            onClick={() => setIsEditProfileOpen(false)}
          >
            ✕
          </button>
        </div>

        <form className="edit-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Имя</label>
            <input
              type="text"
              name="name"
              className="form-input"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Телефон</label>
            <input
              type="tel"
              name="phone"
              className="form-input"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Адрес доставки</label>
            <input
              type="text"
              name="address"
              className="form-input"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn-cancel"
              onClick={() => setIsEditProfileOpen(false)}
            >
              Отмена
            </button>
            <button type="submit" className="btn-save">
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
