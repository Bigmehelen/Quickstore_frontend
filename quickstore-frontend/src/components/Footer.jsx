import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="brand-icon">⚡</span>
          <span className="brand-name">QuickStore</span>
          <p>The fastest way to shop online.</p>
        </div>
        <div className="footer-links">
          <div className="footer-col">
            <h4>Shop</h4>
            <Link to="/">All Products</Link>
            <Link to="/">Electronics</Link>
            <Link to="/">Fashion</Link>
            <Link to="/">Home &amp; Living</Link>
          </div>
          <div className="footer-col">
            <h4>Account</h4>
            <Link to="/login">Login</Link>
            <Link to="/register">Sign Up</Link>
            <Link to="/cart">My Cart</Link>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <a href="#">Help Center</a>
            <a href="#">Returns</a>
            <a href="#">Track Order</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} QuickStore. All rights reserved.</p>
      </div>
    </footer>
  );
}
