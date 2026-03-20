import { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import './Admin.css';

const CATEGORIES = ['Electronics','Clothing','Home & Garden','Sports','Books','Beauty','Toys','Automotive','Other'];
const EMPTY_FORM = { name:'', description:'', price:'', comparePrice:'', category:'Electronics', brand:'', stock:'', isFeatured: false, images: [{ url: '' }] };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchProducts = () => {
    setLoading(true);
    api.get('/products?limit=50').then(res => setProducts(res.data.products)).finally(() => setLoading(false));
  };
  useEffect(fetchProducts, []);

  const openCreate = () => { setEditProduct(null); setForm(EMPTY_FORM); setShowModal(true); };
  const openEdit   = (p) => {
    setEditProduct(p);
    setForm({ ...p, images: p.images?.length ? p.images : [{ url: '' }] });
    setShowModal(true);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), comparePrice: Number(form.comparePrice) || 0, stock: Number(form.stock) };
      if (editProduct) {
        await api.put(`/products/${editProduct._id}`, payload);
        toast.success('Product updated');
      } else {
        await api.post('/products', payload);
        toast.success('Product created');
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      fetchProducts();
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <div className="page-header" style={{ padding: '40px 0 24px' }}>
            <h1>Products</h1>
            <p>{products.length} products</p>
          </div>
          <button className="btn btn-primary" onClick={openCreate}>+ Add Product</button>
        </div>

        {loading ? <div className="loading-full"><div className="spinner" /></div> : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Featured</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id}>
                    <td><img className="table-img" src={p.images?.[0]?.url || 'https://via.placeholder.com/48'} alt="" /></td>
                    <td><p className="table-name">{p.name}</p><p className="table-brand">{p.brand}</p></td>
                    <td><span className="badge badge-neutral">{p.category}</span></td>
                    <td>${p.price.toFixed(2)}</td>
                    <td><span className={`badge badge-${p.stock > 10 ? 'green' : p.stock > 0 ? 'gold' : 'red'}`}>{p.stock}</span></td>
                    <td>{p.isFeatured ? '⭐' : '—'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-outline btn-sm" onClick={() => openEdit(p)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
            <div className="modal animate-up">
              <div className="modal-header">
                <h2>{editProduct ? 'Edit Product' : 'Add Product'}</h2>
                <button onClick={() => setShowModal(false)} className="modal-close">×</button>
              </div>
              <form onSubmit={handleSubmit} className="modal-body">
                <div className="form-group">
                  <label>Name</label>
                  <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} required />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea rows={3} value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Price</label>
                    <input type="number" step="0.01" value={form.price} onChange={e => setForm(f => ({...f, price: e.target.value}))} required min="0" />
                  </div>
                  <div className="form-group">
                    <label>Compare Price</label>
                    <input type="number" step="0.01" value={form.comparePrice} onChange={e => setForm(f => ({...f, comparePrice: e.target.value}))} min="0" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Category</label>
                    <select value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))}>
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Brand</label>
                    <input value={form.brand} onChange={e => setForm(f => ({...f, brand: e.target.value}))} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Stock</label>
                    <input type="number" value={form.stock} onChange={e => setForm(f => ({...f, stock: e.target.value}))} required min="0" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Image URL</label>
                  <input value={form.images?.[0]?.url || ''} onChange={e => setForm(f => ({...f, images: [{ url: e.target.value }]}))} placeholder="https://..." />
                </div>
                <label className="toggle-label" style={{ marginTop: 4 }}>
                  <input type="checkbox" checked={form.isFeatured} onChange={e => setForm(f => ({...f, isFeatured: e.target.checked}))} />
                  <span>Featured product</span>
                </label>
                <div className="modal-footer">
                  <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Saving…' : editProduct ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
