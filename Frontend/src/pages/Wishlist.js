import { useState, useEffect } from 'react';
import api from '../utils/api';
import ProductCard from '../components/ui/ProductCard';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function Wishlist() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    api.get('/auth/me')
      .then(async res => {
        const wishlist = res.data.user.wishlist || [];
        if (wishlist.length === 0) { setLoading(false); return; }
        const fetched = await Promise.all(
          wishlist.map(id => api.get(`/products/${id}`).then(r => r.data.product).catch(() => null))
        );
        setProducts(fetched.filter(Boolean));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-full"><div className="spinner" /></div>;

  return (
    <div style={{ padding: '40px 0 60px' }}>
      <div className="container">
        <div className="page-header">
          <h1>Wishlist</h1>
          <p>{products.length} saved item{products.length !== 1 ? 's' : ''}</p>
        </div>
        {products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">❤️</div>
            <h3>Your wishlist is empty</h3>
            <p>Save items you love for later</p>
            <Link to="/shop" className="btn btn-primary">Browse Products</Link>
          </div>
        ) : (
          <div className="products-grid">
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
