import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="logo-mark">SV</span>
              <span>ShopVault</span>
            </div>
            <p>A curated marketplace built with the MERN stack. Premium products, seamless shopping.</p>
          </div>
          <div className="footer-col">
            <h4>Shop</h4>
            <Link to="/shop">All Products</Link>
            <Link to="/shop?category=Electronics">Electronics</Link>
            <Link to="/shop?category=Clothing">Clothing</Link>
            <Link to="/shop?category=Sports">Sports</Link>
          </div>
          <div className="footer-col">
            <h4>Account</h4>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <Link to="/orders">Orders</Link>
            <Link to="/wishlist">Wishlist</Link>
          </div>
          <div className="footer-col">
            <h4>Stack</h4>
            <span>MongoDB + Mongoose</span>
            <span>Express.js REST API</span>
            <span>React 18 + Router v6</span>
            <span>Node.js + JWT Auth</span>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2024 ShopVault — Full-Stack MERN E-Commerce</span>
        </div>
      </div>
    </footer>
  );
}
