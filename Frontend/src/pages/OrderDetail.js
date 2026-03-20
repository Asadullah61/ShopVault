import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import './OrderDetail.css';

const STEPS = ['pending','confirmed','processing','shipped','delivered'];

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then(res => setOrder(res.data.order))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Cancel this order?')) return;
    setCancelling(true);
    try {
      const res = await api.put(`/orders/${id}/cancel`);
      setOrder(res.data.order);
      toast.success('Order cancelled');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot cancel order');
    } finally { setCancelling(false); }
  };

  if (loading) return <div className="loading-full"><div className="spinner" /></div>;
  if (!order)  return <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>Order not found</div>;

  const stepIdx = STEPS.indexOf(order.status);
  const isCancelled = ['cancelled','refunded'].includes(order.status);

  return (
    <div className="order-detail-page">
      <div className="container">
        <nav className="breadcrumb" style={{ marginBottom: 28 }}>
          <Link to="/orders">Orders</Link> / <span>{order.orderNumber}</span>
        </nav>

        <div className="od-header">
          <div>
            <h1 className="od-num">{order.orderNumber}</h1>
            <p className="od-date">{new Date(order.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          {!isCancelled && ['pending','confirmed'].includes(order.status) && (
            <button className="btn btn-danger btn-sm" onClick={handleCancel} disabled={cancelling}>
              {cancelling ? 'Cancelling…' : 'Cancel Order'}
            </button>
          )}
        </div>

        {/* Progress */}
        {!isCancelled && (
          <div className="progress-bar-section">
            {STEPS.map((step, i) => (
              <div key={step} className={`progress-step${i <= stepIdx ? ' done' : ''}${i === stepIdx ? ' active' : ''}`}>
                <div className="step-dot">{i < stepIdx ? '✓' : i + 1}</div>
                <span>{step}</span>
                {i < STEPS.length - 1 && <div className={`step-line${i < stepIdx ? ' done' : ''}`} />}
              </div>
            ))}
          </div>
        )}
        {isCancelled && (
          <div className="cancelled-banner">
            <span>❌ This order was {order.status}</span>
            {order.cancelReason && <span>Reason: {order.cancelReason}</span>}
          </div>
        )}

        <div className="od-layout">
          {/* Items */}
          <div className="od-items">
            <h2>Items</h2>
            {order.items?.map((item, i) => (
              <div key={i} className="od-item">
                <img src={item.image || 'https://via.placeholder.com/64'} alt={item.name} />
                <div className="od-item-info">
                  <p className="od-item-name">{item.name}</p>
                  <p className="od-item-price">${item.price?.toFixed(2)} each</p>
                </div>
                <div className="od-item-right">
                  <span className="od-item-qty">×{item.quantity}</span>
                  <span className="od-item-total">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="od-sidebar">
            <div className="od-block">
              <h3>Order Summary</h3>
              <div className="od-lines">
                <div className="od-line"><span>Subtotal</span><span>${order.itemsTotal?.toFixed(2)}</span></div>
                <div className="od-line"><span>Shipping</span><span>{order.shippingCost === 0 ? 'Free' : `$${order.shippingCost?.toFixed(2)}`}</span></div>
                <div className="od-line"><span>Tax</span><span>${order.tax?.toFixed(2)}</span></div>
              </div>
              <div className="od-total"><span>Total</span><strong>${order.totalAmount?.toFixed(2)}</strong></div>
            </div>

            <div className="od-block">
              <h3>Shipping Address</h3>
              <address className="od-address">
                {order.shippingAddress?.street}<br />
                {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}<br />
                {order.shippingAddress?.country}
              </address>
            </div>

            <div className="od-block">
              <h3>Payment</h3>
              <div className="od-line"><span>Method</span><span style={{ textTransform: 'capitalize' }}>{order.payment?.method}</span></div>
              <div className="od-line"><span>Status</span>
                <span className={`badge badge-${order.payment?.status === 'paid' ? 'green' : 'gold'}`}>
                  {order.payment?.status}
                </span>
              </div>
            </div>

            {order.trackingNumber && (
              <div className="od-block">
                <h3>Tracking</h3>
                <code className="tracking-num">{order.trackingNumber}</code>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
