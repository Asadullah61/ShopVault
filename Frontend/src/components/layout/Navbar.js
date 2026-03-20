import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [dropOpen, setDropOpen]   = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropOpen(false);
  };

  return (
    <header className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="navbar-inner container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-mark">SV</span>
          <span className="logo-text">ShopVault</span>
        </Link>

        {/* Nav Links */}
        <nav className={`navbar-links${menuOpen ? ' open' : ''}`}>
          <NavLink to="/"    end onClick={() => setMenuOpen(false)}>Home</NavLink>
          <NavLink to="/shop"    onClick={() => setMenuOpen(false)}>Shop</NavLink>
          {user && <NavLink to="/orders"  onClick={() => setMenuOpen(false)}>Orders</NavLink>}
          {user && <NavLink to="/wishlist" onClick={() => setMenuOpen(false)}>Wishlist</NavLink>}
          {isAdmin && <NavLink to="/admin" onClick={() => setMenuOpen(false)} className="admin-link">Admin</NavLink>}
        </nav>

        {/* Right actions */}
        <div className="navbar-actions">
          {/* Cart */}
          <Link to="/cart" className="cart-btn" aria-label="Cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {cartCount > 0 && <span className="cart-count">{cartCount > 99 ? '99+' : cartCount}</span>}
          </Link>

          {/* User */}
          {user ? (
            <div className="user-dropdown" onBlur={() => setTimeout(() => setDropOpen(false), 150)}>
              <button className="user-btn" onClick={() => setDropOpen(!dropOpen)}>
                <div className="avatar">{user.name[0].toUpperCase()}</div>
                <span className="user-name">{user.name.split(' ')[0]}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {dropOpen && (
                <div className="dropdown-menu animate-in">
                  <Link to="/profile"  onClick={() => setDropOpen(false)}>Profile</Link>
                  <Link to="/orders"   onClick={() => setDropOpen(false)}>My Orders</Link>
                  <Link to="/wishlist" onClick={() => setDropOpen(false)}>Wishlist</Link>
                  {isAdmin && <Link to="/admin" onClick={() => setDropOpen(false)} className="admin-item">Admin Panel</Link>}
                  <hr />
                  <button onClick={handleLogout}>Sign out</button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login"    className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign up</Link>
            </div>
          )}

          {/* Mobile toggle */}
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  );
}
