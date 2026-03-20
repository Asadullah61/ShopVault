import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './ProductPage.css';

function Stars({ rating, size = 14 }) {
  return (
    <div className="stars" style={{ fontSize: size }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} className={`star${i <= Math.round(rating) ? ' filled' : ''}`}>★</span>
      ))}
    </div>
  );
}

function ReviewForm({ productId, onSubmit }) {
  const [rating, setRating] = useState(5);
  const [title,  setTitle]  = useState('');
  const [body,   setBody]   = useState('');
  const [hover,  setHover]  = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!body.trim()) return toast.error('Please write a review');
    setLoading(true);
    try {
      await api.post('/reviews', { productId, rating, title, body });
      toast.success('Review posted!');
      setTitle(''); setBody(''); setRating(5);
      onSubmit();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post review');
    } finally { setLoading(false); }
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h4>Write a Review</h4>
      <div className="star-picker">
        {[1,2,3,4,5].map(s => (
          <button type="button" key={s}
            className={`star-pick${s <= (hover || rating) ? ' on' : ''}`}
            onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)}
            onClick={() => setRating(s)}
          >★</button>
        ))}
      </div>
      <input placeholder="Review title (optional)" value={title}
        onChange={e => setTitle(e.target.value)} />
      <textarea rows={4} placeholder="Share your experience…" value={body}
        onChange={e => setBody(e.target.value)} required />
      <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
        {loading ? 'Posting…' : 'Post Review'}
      </button>
    </form>
  );
}

export default function ProductPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user }      = useAuth();
  const [product, setProduct]   = useState(null);
  const [reviews, setReviews]   = useState([]);
  const [qty, setQty]           = useState(1);
  const [loading, setLoading]   = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/products/${id}`),
      api.get(`/reviews/product/${id}`)
    ]).then(([pRes, rRes]) => {
      setProduct(pRes.data.product);
      setReviews(rRes.data.reviews);
    }).catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) { toast.error('Please login first'); return; }
    await addToCart(product._id, qty);
  };

  const handleWishlist = async () => {
    if (!user) { toast.error('Please login first'); return; }
    try {
      const res = await api.post(`/auth/wishlist/${product._id}`);
      toast.success(res.data.message);
    } catch { toast.error('Failed'); }
  };

  if (loading) return <div className="loading-full"><div className="spinner" /></div>;
  if (!product) return <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>Product not found</div>;

  const discount = product.comparePrice > product.price
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) : 0;

  return (
    <div className="product-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Home</Link> / <Link to="/shop">Shop</Link> / <Link to={`/shop?category=${product.category}`}>{product.category}</Link> / <span>{product.name}</span>
        </nav>

        <div className="product-layout">
          {/* Images */}
          <div className="product-images">
            <div className="main-image">
              <img src={product.images?.[activeImg]?.url || 'https://via.placeholder.com/600x600?text=No+Image'} alt={product.name} />
              {discount > 0 && <span className="img-badge">-{discount}%</span>}
            </div>
            {product.images?.length > 1 && (
              <div className="thumb-row">
                {product.images.map((img, i) => (
                  <button key={i} className={`thumb${activeImg === i ? ' active' : ''}`} onClick={() => setActiveImg(i)}>
                    <img src={img.url} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="product-details">
            <p className="detail-brand">{product.brand}</p>
            <h1 className="detail-name">{product.name}</h1>
            <div className="detail-ratings">
              <Stars rating={product.ratings?.average || 0} size={16} />
              <span>{product.ratings?.average?.toFixed(1) || '0.0'}</span>
              <span className="sep">·</span>
              <span>{product.ratings?.count || 0} reviews</span>
            </div>

            <div className="detail-price">
              <span className="price-big">${product.price.toFixed(2)}</span>
              {discount > 0 && (
                <>
                  <span className="price-was">${product.comparePrice.toFixed(2)}</span>
                  <span className="badge badge-green">Save {discount}%</span>
                </>
              )}
            </div>

            <p className="detail-desc">{product.description}</p>

            <div className="detail-stock">
              {product.stock > 10 ? (
                <span className="in-stock">✓ In stock ({product.stock} available)</span>
              ) : product.stock > 0 ? (
                <span className="low-stock">⚠ Only {product.stock} left!</span>
              ) : (
                <span className="out-stock">✗ Out of stock</span>
              )}
            </div>

            {product.stock > 0 && (
              <div className="qty-row">
                <div className="qty-ctrl">
                  <button onClick={() => setQty(q => Math.max(1, q-1))}>−</button>
                  <span>{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock, q+1))}>+</button>
                </div>
                <button className="btn btn-primary btn-lg flex-grow" onClick={handleAddToCart}>
                  Add to Cart
                </button>
                <button className="wish-action" onClick={handleWishlist} title="Save">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                  </svg>
                </button>
              </div>
            )}

            <div className="shipping-note">
              🚚 Free shipping on orders over $50 · 30-day returns
            </div>

            {product.tags?.length > 0 && (
              <div className="tags">
                {product.tags.map(t => <span key={t} className="tag">{t}</span>)}
              </div>
            )}
          </div>
        </div>

        {/* Reviews */}
        <section className="reviews-section">
          <h2 className="section-title">Customer Reviews</h2>
          <div className="reviews-layout">
            <div className="reviews-list">
              {reviews.length === 0 ? (
                <p className="no-reviews">No reviews yet. Be the first!</p>
              ) : (
                reviews.map(r => (
                  <div key={r._id} className="review-card">
                    <div className="review-header">
                      <div className="reviewer">
                        <div className="reviewer-avatar">{r.user?.name?.[0] || '?'}</div>
                        <div>
                          <p className="reviewer-name">{r.user?.name}</p>
                          <p className="review-date">{new Date(r.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="review-right">
                        <Stars rating={r.rating} size={13} />
                        {r.verified && <span className="verified-badge">✓ Verified</span>}
                      </div>
                    </div>
                    {r.title && <p className="review-title">{r.title}</p>}
                    <p className="review-body">{r.body}</p>
                  </div>
                ))
              )}
            </div>
            {user && (
              <ReviewForm productId={product._id} onSubmit={() =>
                api.get(`/reviews/product/${id}`).then(res => setReviews(res.data.reviews))
              } />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
