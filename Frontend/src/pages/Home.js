import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ui/ProductCard';
import './Home.css';

const CATEGORIES = [
  { name: 'Electronics', icon: '💻', color: '#3b82f6' },
  { name: 'Clothing',    icon: '👔', color: '#8b5cf6' },
  { name: 'Home & Garden', icon: '🏡', color: '#22c55e' },
  { name: 'Sports',     icon: '⚡', color: '#f59e0b' },
  { name: 'Beauty',     icon: '✨', color: '#ec4899' },
  { name: 'Books',      icon: '📚', color: '#06b6d4' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    api.get('/products/featured')
      .then(res => setFeatured(res.data.products))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb orb-1" />
          <div className="hero-orb orb-2" />
          <div className="hero-grid" />
        </div>
        <div className="container hero-content animate-up">
          <div className="hero-eyebrow">
            <span className="badge badge-gold">New arrivals weekly</span>
          </div>
          <h1 className="hero-title">
            Shop with<br />
            <span className="hero-accent">Confidence</span>
          </h1>
          <p className="hero-subtitle">
            Premium products, curated for modern living.<br />
            Free shipping on orders over $50.
          </p>
          <div className="hero-ctas">
            <Link to="/shop" className="btn btn-primary btn-lg">Browse Shop</Link>
            <Link to="/shop?featured=true" className="btn btn-outline btn-lg">Featured Items</Link>
          </div>
          <div className="hero-stats">
            <div className="stat"><strong>12+</strong><span>Products</span></div>
            <div className="stat-divider" />
            <div className="stat"><strong>6</strong><span>Categories</span></div>
            <div className="stat-divider" />
            <div className="stat"><strong>Free</strong><span>Shipping $50+</span></div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Shop by Category</h2>
            <Link to="/shop" className="see-all">See all →</Link>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.name}
                to={`/shop?category=${encodeURIComponent(cat.name)}`}
                className="category-card"
                style={{ '--cat-color': cat.color }}
              >
                <span className="cat-icon">{cat.icon}</span>
                <span className="cat-name">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Products</h2>
            <Link to="/shop" className="see-all">View all →</Link>
          </div>
          {loading ? (
            <div className="loading-full"><div className="spinner" /></div>
          ) : (
            <div className="products-grid">
              {featured.map((p, i) => (
                <div key={p._id} className="animate-up" style={{ animationDelay: `${i * 0.07}s` }}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Banner */}
      <section className="section">
        <div className="container">
          <div className="promo-banner">
            <div className="promo-content">
              <p className="promo-eyebrow">Limited offer</p>
              <h2>Free Shipping on Orders <span>Over $50</span></h2>
              <p className="promo-sub">Plus 8% off your first order when you create an account</p>
              <Link to="/register" className="btn btn-primary">Create Account</Link>
            </div>
            <div className="promo-visual">🛍️</div>
          </div>
        </div>
      </section>
    </div>
  );
}
