import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import './ProductCard.css';

function Stars({ rating, count }) {
  return (
    <div className="stars-row">
      <div className="stars">
        {[1,2,3,4,5].map(i => (
          <span key={i} className={`star${i <= Math.round(rating) ? ' filled' : ''}`}>★</span>
        ))}
      </div>
      {count > 0 && <span className="rating-count">({count})</span>}
    </div>
  );
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to add items to cart'); return; }
    await addToCart(product._id, 1);
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to save items'); return; }
    try {
      const res = await api.post(`/auth/wishlist/${product._id}`);
      toast.success(res.data.message);
    } catch { toast.error('Failed to update wishlist'); }
  };

  const discount = product.comparePrice > product.price
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) : 0;

  return (
    <Link to={`/product/${product._id}`} className="product-card">
      <div className="product-image">
        <img
          src={product.images?.[0]?.url || 'https://via.placeholder.com/400x400?text=No+Image'}
          alt={product.name}
          loading="lazy"
        />
        {discount > 0 && <span className="discount-badge">-{discount}%</span>}
        {product.stock === 0 && <span className="out-of-stock-badge">Out of stock</span>}
        <div className="card-actions">
          <button className="action-btn wish-btn" onClick={handleWishlist} title="Save to wishlist">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
          </button>
        </div>
      </div>
      <div className="product-info">
        <p className="product-brand">{product.brand || product.category}</p>
        <h3 className="product-name">{product.name}</h3>
        <Stars rating={product.ratings?.average || 0} count={product.ratings?.count || 0} />
        <div className="product-footer">
          <div className="price-block">
            <span className="price">${product.price.toFixed(2)}</span>
            {discount > 0 && <span className="price-original">${product.comparePrice.toFixed(2)}</span>}
          </div>
          <button
            className="add-btn"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Sold out' : '+ Cart'}
          </button>
        </div>
      </div>
    </Link>
  );
}
