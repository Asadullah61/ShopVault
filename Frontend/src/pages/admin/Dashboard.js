import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import './Admin.css';

function StatCard({ label, value, icon, color }) {
  return (
    <div className="stat-card" style={{ '--stat-color': color }}>
      <div className="stat-icon">{icon}</div>
      <div>
        <p className="stat-label">{label}</p>
        <p className="stat-value">{value}</p>
      </div>
    </div>
  );
}

const STATUS_COLORS = {
  pending:'gold', confirmed:'gold', processing:'gold',
  shipped:'gold', delivered:'green', cancelled:'red', refunded:'red'
};

export default function AdminDashboard() {
  const [stats,  setStats]  = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/stats')
      .then(res => setStats(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-full"><div className="spinner" /></div>;

  return (
    <div className="admin-page">
      <div className="container">
        <div className="page-header">
          <h1>Admin Dashboard</h1>
          <p>Overview of your store</p>
        </div>

        <div className="stats-grid">
          <StatCard label="Total Revenue"  value={`$${stats?.totalRevenue?.toFixed(2) || '0.00'}`} icon="💰" color="#c9a96e" />
          <StatCard label="Total Orders"   value={stats?.totalOrders || 0} icon="📦" color="#6366f1" />
          <StatCard label="Total Customers" value={stats?.totalUsers || 0} icon="👥" color="#22c55e" />
        </div>

        <div className="admin-actions-bar">
          <Link to="/admin/products" className="btn btn-primary">Manage Products</Link>
          <Link to="/admin/orders"   className="btn btn-outline">Manage Orders</Link>
        </div>

        <div className="recent-section">
          <h2>Recent Orders</h2>
          <div className="recent-orders">
            {stats?.recentOrders?.length === 0 && <p className="no-data">No orders yet.</p>}
            {stats?.recentOrders?.map(order => (
              <Link key={order._id} to={`/orders/${order._id}`} className="recent-order-row">
                <span className="ro-num">{order.orderNumber}</span>
                <span className="ro-user">{order.user?.name}</span>
                <span className="ro-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                <span className={`badge badge-${STATUS_COLORS[order.status] || 'neutral'}`}>{order.status}</span>
                <span className="ro-total">${order.totalAmount?.toFixed(2)}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
