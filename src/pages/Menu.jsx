import React, { useState, useEffect, useMemo } from 'react';
import ProductCard from '../components/ProductCard.jsx';
import Pagination from '../components/Pagination.jsx';
import './Menu.css';

const LIMIT = 20;

const SORT_OPTIONS = [
  { value: 'default',    label: 'Сортировать по' },
  { value: 'price-asc',  label: 'Цена: по возрастанию' },
  { value: 'price-desc', label: 'Цена: по убыванию' },
  { value: 'rating',     label: 'Рейтинг' },
];

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState('default');

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Категории — один раз
  useEffect(() => {
    fetch('https://dummyjson.com/products/categories')
      .then(res => res.json())
      .then(data => setCategories(data.map(c => (typeof c === 'string' ? c : c.slug))))
      .catch(() => {});
  }, []);

  // Товары — при смене страницы / категории / поиска
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    const fetchProducts = async () => {
      try {
        const skip = (currentPage - 1) * LIMIT;
        let url;

        if (searchQuery.trim()) {
          url = `https://dummyjson.com/products/search?q=${encodeURIComponent(searchQuery.trim())}&limit=${LIMIT}&skip=${skip}`;
        } else if (selectedCategory !== 'all') {
          url = `https://dummyjson.com/products/category/${encodeURIComponent(selectedCategory)}?limit=${LIMIT}&skip=${skip}`;
        } else {
          url = `https://dummyjson.com/products?limit=${LIMIT}&skip=${skip}`;
        }

        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error('Ошибка сети');
        const data = await res.json();

        setProducts(data.products);
        setTotal(data.total);
        setTotalPages(Math.ceil(data.total / LIMIT));
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError('Не удалось загрузить товары. Проверьте подключение к интернету.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    return () => controller.abort();
  }, [currentPage, selectedCategory, searchQuery]);

  // Клиентская сортировка текущей страницы
  const sortedProducts = useMemo(() => {
    const arr = [...products];
    if (sortBy === 'price-asc')  return arr.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') return arr.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating')     return arr.sort((a, b) => b.rating - a.rating);
    return arr;
  }, [products, sortBy]);

  const handleSearch = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleCategory = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleSort = (value) => {
    setSortBy(value);
    // Сортировка не сбрасывает страницу — применяется к текущей
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="menu-page">

      {/* ── Фиксированная панель управления ── */}
      <div className="menu-sticky-header">
        <h1 className="page-title">Меню</h1>

        <div className="menu-controls">
          {/* Поиск */}
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Поиск товара"
              className="search-input"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
            {searchQuery && (
              <button className="search-clear" onClick={() => handleSearch('')}>✕</button>
            )}
          </div>

          {/* Фильтр по категории */}
          {/* <div className="sort-wrapper">
            <select
              className="sort-select"
              value={selectedCategory}
              onChange={(e) => handleCategory(e.target.value)}
            >
              <option value="all">Все категории</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <span className="dropdown-arrow">▼</span>
          </div> */}

          {/* Сортировка */}
          <div className="sort-wrapper sort-wrapper--highlight">
            <select
              className={`sort-select ${sortBy !== 'default' ? 'sort-select--active' : ''}`}
              value={sortBy}
              onChange={(e) => handleSort(e.target.value)}
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <span className="dropdown-arrow">▼</span>
          </div>
        </div>

        {!loading && !error && (
          <p className="results-info">
            {total > 0
              ? `Найдено товаров: ${total} — страница ${currentPage} из ${totalPages}${sortBy !== 'default' ? ` · ${SORT_OPTIONS.find(o => o.value === sortBy)?.label}` : ''}`
              : 'Товары не найдены'}
          </p>
        )}
      </div>

      {/* ── Прокручиваемая область товаров ── */}
      <div className="menu-scrollable">

        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p className="loading-text">Загрузка товаров...</p>
          </div>
        )}

        {error && !loading && (
          <div className="error-state">
            <p className="error-emoji">😕</p>
            <p className="error-text">{error}</p>
            <button className="retry-btn" onClick={() => setCurrentPage(1)}>
              Попробовать снова
            </button>
          </div>
        )}

        {!loading && !error && sortedProducts.length > 0 && (
          <>
            <div className="menu-grid">
              {sortedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}

        {!loading && !error && sortedProducts.length === 0 && (
          <div className="no-results">
            <p className="no-results-emoji">🔍</p>
            <p className="no-results-text">Товары не найдены</p>
            <p className="no-results-hint">Попробуйте изменить поисковый запрос или категорию</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Menu;
