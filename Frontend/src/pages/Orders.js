import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import './Orders.css';

const STATUS_COLORS = {
  pending:    'gold', confirmed: 'gold', processing: 'gold',
  shipped:    'gold', delivered: 'green',
  cancelled:  'red',  refunded:  'red'
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my')
      .then(res => setOrders(res.data.orders))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-full"><div className="spinner" /></div>;

  return (
    <div className="orders-page">
      <div className="container">
        <div className="page-header">
          <h1>My Orders</h1>
          <p>{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
        </div>

        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>No orders yet</h3>
            <p>Your order history will appear here</p>
            <Link to="/shop" className="btn btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <Link key={order._id} to={`/orders/${order._id}`} className="order-card animate-in">
                <div className="order-top">
                  <div>
                    <p className="order-num">{order.orderNumber}</p>
                    <p className="order-date">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <span className={`badge badge-${STATUS_COLORS[order.status] || 'neutral'}`}>
                    {order.status}
                  </span>
                </div>
                <div className="order-items-row">
                  {order.items?.slice(0, 3).map((item, i) => (
                    <div key={i} className="order-thumb">
                      <img src={item.image || 'https://via.placeholder.com/48'} alt={item.name} />
                    </div>
                  ))}
                  {order.items?.length > 3 && (
                    <div className="order-thumb more">+{order.items.length - 3}</div>
                  )}
                </div>
                <div className="order-bottom">
                  <span className="order-count">{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</span>
                  <span className="order-total">${order.totalAmount?.toFixed(2)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
