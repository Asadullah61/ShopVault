import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../utils/api';
import './OrderSuccess.css';

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(res => setOrder(res.data.order))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading-full"><div className="spinner" /></div>;

  return (
    <div className="success-page">
      <div className="container-sm">
        <div className="success-card animate-up">
          <div className="success-icon">🎉</div>
          <h1>Order Confirmed!</h1>
          <p className="success-sub">Thank you for your purchase. Your order has been placed successfully.</p>

          {order && (
            <div className="order-details">
              <div className="order-meta">
                <div className="meta-item">
                  <span>Order Number</span>
                  <strong>{order.orderNumber}</strong>
                </div>
                <div className="meta-item">
                  <span>Total</span>
                  <strong>${order.totalAmount?.toFixed(2)}</strong>
                </div>
                <div className="meta-item">
                  <span>Payment</span>
                  <span className={`badge badge-${order.payment?.status === 'paid' ? 'green' : 'gold'}`}>
                    {order.payment?.status}
                  </span>
                </div>
                <div className="meta-item">
                  <span>Status</span>
                  <span className="badge badge-neutral">{order.status}</span>
                </div>
              </div>
              <div className="order-items-preview">
                {order.items?.map((item, i) => (
                  <div key={i} className="preview-item">
                    <img src={item.image || 'https://via.placeholder.com/48'} alt={item.name} />
                    <div>
                      <p>{item.name}</p>
                      <p className="preview-qty">Qty: {item.quantity} · ${item.price?.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="success-actions">
            <Link to={`/orders/${id}`} className="btn btn-outline">View Order Details</Link>
            <Link to="/shop" className="btn btn-primary">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
