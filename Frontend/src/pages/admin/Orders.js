import { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import './Admin.css';

const STATUS_OPTIONS = ['pending','confirmed','processing','shipped','delivered','cancelled','refunded'];
const STATUS_COLORS  = { pending:'gold', confirmed:'gold', processing:'gold', shipped:'gold', delivered:'green', cancelled:'red', refunded:'red' };

export default function AdminOrders() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('');

  const fetchOrders = () => {
    setLoading(true);
    api.get(`/orders${filter ? `?status=${filter}` : ''}`).then(res => setOrders(res.data.orders)).finally(() => setLoading(false));
  };
  useEffect(fetchOrders, [filter]);

  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      toast.success('Status updated');
      fetchOrders();
    } catch { toast.error('Failed to update'); }
  };

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <div className="page-header" style={{ padding: '40px 0 24px' }}>
            <h1>Orders</h1>
            <p>{orders.length} orders</p>
          </div>
          <select value={filter} onChange={e => setFilter(e.target.value)} className="sort-select">
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {loading ? <div className="loading-full"><div className="spinner" /></div> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>Order #</th><th>Customer</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th><th>Update</th></tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id}>
                    <td><span className="table-order-num">{order.orderNumber}</span></td>
                    <td>
                      <p className="table-name">{order.user?.name}</p>
                      <p className="table-brand">{order.user?.email}</p>
                    </td>
                    <td style={{ fontSize: 13, color: 'var(--text-3)' }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td>{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</td>
                    <td><strong>${order.totalAmount?.toFixed(2)}</strong></td>
                    <td><span className={`badge badge-${STATUS_COLORS[order.status] || 'neutral'}`}>{order.status}</span></td>
                    <td>
                      <select
                        value={order.status}
                        onChange={e => updateStatus(order._id, e.target.value)}
                        className="sort-select" style={{ fontSize: 12, padding: '5px 8px' }}
                      >
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && <p className="no-data">No orders found.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
