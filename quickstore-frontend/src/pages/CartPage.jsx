import { useCart } from '../contexts/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { getImageUrl } from '../utils/image';

export default function CartPage() {
  const { items, removeItem, updateQty, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const shipping = subtotal >= 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="page cart-page">
        <div className="empty-state">
          <span>🛒</span>
          <h2>Your cart is empty</h2>
          <p>Browse our products and add something you love!</p>
          <Link to="/" className="btn-primary" id="continue-shopping-empty">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page cart-page">
      <div className="cart-header">
        <h1>Your Cart</h1>
        <button className="clear-cart-btn" onClick={clearCart} id="clear-cart-btn">
          Clear all
        </button>
      </div>

      <div className="cart-layout">
        {/* Cart Items */}
        <div className="cart-items">
          {items.map(item => (
            <div key={item.id} className="cart-item">
              <img src={getImageUrl(item.images[0])} alt={item.name} className="cart-item-img" />
              <div className="cart-item-info">
                <p className="cart-item-category">{item.category}</p>
                <Link to={`/product/${item.id}`} className="cart-item-name">{item.name}</Link>
                <p className="cart-item-unit">${item.price.toFixed(2)} each</p>
              </div>
              <div className="cart-item-controls">
                <div className="qty-control">
                  <button
                    className="qty-btn"
                    onClick={() => updateQty(item.id, item.qty - 1)}
                    id={`cart-dec-${item.id}`}
                  >−</button>
                  <span className="qty-val">{item.qty}</span>
                  <button
                    className="qty-btn"
                    onClick={() => updateQty(item.id, item.qty + 1)}
                    id={`cart-inc-${item.id}`}
                  >+</button>
                </div>
                <p className="cart-item-total">${(item.price * item.qty).toFixed(2)}</p>
                <button
                  className="remove-btn"
                  onClick={() => removeItem(item.id)}
                  id={`remove-${item.id}`}
                  aria-label="Remove item"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6M14 11v6" />
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="order-summary">
          <h2>Order Summary</h2>

          <div className="summary-lines">
            <div className="summary-line">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-line">
              <span>Shipping</span>
              <span>{shipping === 0 ? <span className="free-tag">FREE</span> : `$${shipping.toFixed(2)}`}</span>
            </div>
            {shipping > 0 && (
              <p className="free-shipping-hint">
                Add ${(50 - subtotal).toFixed(2)} more for free shipping!
              </p>
            )}
            <div className="summary-line">
              <span>Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <hr className="summary-divider" />
            <div className="summary-line total-line">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            className="btn-primary btn-lg checkout-btn"
            onClick={() => navigate('/checkout')}
            id="proceed-to-checkout-btn"
          >
            Proceed to Checkout
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          <Link to="/" className="continue-link" id="continue-shopping-btn">
            ← Continue Shopping
          </Link>

          <div className="secure-badges">
            <span>🔒 Secure Payment</span>
            <span>↩️ Easy Returns</span>
          </div>
        </div>
      </div>
    </div>
  );
}
