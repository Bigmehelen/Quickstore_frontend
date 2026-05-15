import { useState, useMemo } from 'react';
import { useGetProductsQuery } from '../api/publicApi';
import ProductCard from '../components/ProductCard';

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Home & Living', 'Sports', 'Beauty'];

export default function ShopPage() {
  const { data: products = [], isLoading, isError } = useGetProductsQuery();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');

  const filtered = useMemo(() => {
    let list = [...products];
    if (activeCategory !== 'All') {
      list = list.filter(p => p.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      );
    }
    if (sortBy === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') list.sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [products, activeCategory, searchQuery, sortBy]);

  return (
    <div className="page home-page">

      <section className="hero-banner">
        <div className="hero-content">
          <div className="hero-tag"> Flash Sale — Up to 30% off</div>
          <h1 className="hero-title">
            Shop Smarter,<br />
            <span className="gradient-text">Live Better</span>
          </h1>
          <p className="hero-sub">
            Thousands of products. Instant checkout. Delivered to your door.
          </p>
          <div className="hero-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="What are you looking for?"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              id="hero-search-input"
            />
          </div>
          <div className="hero-stats">
            <div className="stat"><span>10K+</span><p>Products</p></div>
            <div className="stat-divider" />
            <div className="stat"><span>50K+</span><p>Customers</p></div>
            <div className="stat-divider" />
            <div className="stat"><span>4.9★</span><p>Rating</p></div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-blob" />
          <div className="floating-card card-1">
            <span>🎧</span>
            <div>
              <p>Headphones</p>
              <strong>$149.99</strong>
            </div>
          </div>
          <div className="floating-card card-2">
            <span>⌨️</span>
            <div>
              <p>Gaming Keyboard</p>
              <strong>$119.99</strong>
            </div>
          </div>
          <div className="floating-card card-3">
            <span>✅</span>
            <div>
              <p>Order placed!</p>
              <strong>2 mins ago</strong>
            </div>
          </div>
        </div>
      </section>


      <section className="catalog-section">
        <div className="catalog-header">
          <div className="category-tabs">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`cat-tab ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
                id={`cat-${cat.replace(/\s/g, '-').toLowerCase()}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <select
            className="sort-select"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            id="sort-select"
          >
            <option value="default">Sort: Featured</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        {isLoading ? (
          <div className="empty-state">
            <span className="spinner" />
            <h3>Loading products...</h3>
          </div>
        ) : isError ? (
          <div className="empty-state">
            <span>⚠️</span>
            <h3>Error loading products</h3>
            <p>Could not connect to the backend API.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <span>🔍</span>
            <h3>No products found</h3>
            <p>Try a different search or category.</p>
          </div>
        ) : (
          <div className="product-grid">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
