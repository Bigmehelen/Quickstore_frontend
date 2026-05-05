import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetProductQuery, useGetProductsQuery } from '../api/api';
import { useCart } from '../contexts/CartContext';
import { getImageUrl } from '../utils/image';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  
  const { data: product, isLoading, isError } = useGetProductQuery(id);
  const { data: allProducts = [] } = useGetProductsQuery();
  
  const [qty, setQty] = useState(1);
  const [selectedImg, setSelectedImg] = useState(0);
  const [added, setAdded] = useState(false);

  if (isLoading) return <div className="page"><div className="empty-state"><span className="spinner" /><h3>Loading product...</h3></div></div>;
  if (isError || !product) {
    return (
      <div className="page not-found-page">
        <div className="empty-state">
          <span>😕</span>
          <h2>Product not found</h2>
          <button className="btn-primary" onClick={() => navigate('/')}>Back to Shop</button>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const related = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="page product-detail-page">
      <button className="back-btn" onClick={() => navigate(-1)} id="back-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back
      </button>

      <div className="product-detail-grid">
        {/* Images */}
        <div className="product-images">
          <img
            src={getImageUrl(product.images[selectedImg])}
            alt={product.name}
            className="main-image"
            id="product-main-img"
          />
          <div className="image-thumbs">
            {product.images.map((img, i) => (
              <img
                key={i}
                src={getImageUrl(img)}
                alt={`${product.name} ${i + 1}`}
                className={`thumb ${selectedImg === i ? 'active' : ''}`}
                onClick={() => setSelectedImg(i)}
              />
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="product-detail-info">
          <p className="detail-category">{product.category}</p>
          <h1 className="detail-name">{product.name}</h1>

          <div className="detail-rating">
            <span className="stars">{'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}</span>
            <span>{product.rating} · {product.reviews.toLocaleString()} reviews</span>
          </div>

          <div className="detail-pricing">
            <span className="detail-price">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <>
                <span className="detail-original">${product.originalPrice.toFixed(2)}</span>
                <span className="detail-discount">-{discount}% off</span>
              </>
            )}
          </div>

          <p className="detail-stock">
            {product.stock <= 5
              ? `⚠️ Only ${product.stock} left in stock!`
              : `✅ In stock (${product.stock} available)`}
          </p>

          <p className="detail-description">{product.description}</p>

          <ul className="detail-features">
            {product.features.map((f, i) => (
              <li key={i}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {f}
              </li>
            ))}
          </ul>

          <div className="detail-qty">
            <button
              className="qty-btn"
              onClick={() => setQty(q => Math.max(1, q - 1))}
              id="qty-dec"
            >−</button>
            <span className="qty-val">{qty}</span>
            <button
              className="qty-btn"
              onClick={() => setQty(q => Math.min(product.stock, q + 1))}
              id="qty-inc"
            >+</button>
          </div>

          <div className="detail-actions">
            <button
              className={`btn-primary btn-lg add-cart-lg ${added ? 'added' : ''}`}
              onClick={handleAddToCart}
              id="detail-add-to-cart"
            >
              {added ? '✓ Added to Cart!' : 'Add to Cart'}
            </button>
            <button
              className="btn-secondary btn-lg"
              onClick={() => { addItem(product, qty); navigate('/cart'); }}
              id="buy-now-btn"
            >
              Buy Now
            </button>
          </div>

          <div className="detail-badges">
            <span>🚚 Free shipping over $50</span>
            <span>↩️ 30-day returns</span>
            <span>🔒 Secure checkout</span>
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="related-section">
          <h2>You might also like</h2>
          <div className="product-grid related-grid">
            {related.map(p => (
              <div key={p.id} className="product-card" onClick={() => navigate(`/product/${p.id}`)} style={{ cursor: 'pointer' }}>
                <img src={getImageUrl(p.images[0])} alt={p.name} className="product-img" />
                <div className="product-info">
                  <p className="product-category">{p.category}</p>
                  <h3 className="product-name">{p.name}</h3>
                  <span className="product-price">${p.price.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
