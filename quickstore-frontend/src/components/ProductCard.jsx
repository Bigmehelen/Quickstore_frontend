import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { getImageUrl } from '../utils/image';

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="product-card">
      {product.badge && <span className="product-badge">{product.badge}</span>}
      {discount > 0 && <span className="discount-badge">-{discount}%</span>}

      <Link to={`/product/${product.id}`} className="product-image-link">
        <img
          src={getImageUrl(product.images[0])}
          alt={product.name}
          className="product-img"
          loading="lazy"
        />
      </Link>

      <div className="product-info">
        <p className="product-category">{product.category}</p>
        <Link to={`/product/${product.id}`} className="product-name-link">
          <h3 className="product-name">{product.name}</h3>
        </Link>

        <div className="product-rating">
          <span className="stars">{'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}</span>
          <span className="review-count">({product.reviews.toLocaleString()})</span>
        </div>

        <div className="product-pricing">
          <span className="product-price">${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="product-original">${product.originalPrice.toFixed(2)}</span>
          )}
        </div>

        <button
          className="add-to-cart-btn"
          onClick={() => addItem(product)}
          id={`add-to-cart-${product.id}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          Add to Cart
        </button>
      </div>
    </div>
  );
}
