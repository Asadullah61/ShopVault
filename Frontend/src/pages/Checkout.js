import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import './Checkout.css';

export default function Checkout() {
  const { cart, cartSubtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    street: '', city: '', state: '', zip: '', country: 'US',
    paymentMethod: 'card'
  });

  const shipping = cartSubtotal >= 50 ? 0 : 9.99;
  const tax      = parseFloat((cartSubtotal * 0.08).toFixed(2));
  const total    = parseFloat((cartSubtotal + shipping + tax).toFixed(2));

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.street || !form.city || !form.state || !form.zip)
      return toast.error('Please fill in all address fields');

    setLoading(true);
    try {
      const res = await api.post('/orders', {
        shippingAddress: { street: form.street, city: form.city, state: form.state, zip: form.zip, country: form.country },
        paymentMethod: form.paymentMethod
      });
      await clearCart();
      toast.success('Order placed! 🎉');
      navigate(`/order-success/${res.data.order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally { setLoading(false); }
  };

  if (!cart.items || cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="page-header">
          <h1>Checkout</h1>
        </div>
        <form onSubmit={handleSubmit} className="checkout-layout">
          {/* Left */}
          <div className="checkout-form">
            <section className="checkout-section">
              <h2>Shipping Address</h2>
              <div className="form-group">
                <label>Street Address</label>
                <input name="street" value={form.street} onChange={handleChange} placeholder="123 Main Street" required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input name="city" value={form.city} onChange={handleChange} placeholder="New York" required />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input name="state" value={form.state} onChange={handleChange} placeholder="NY" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>ZIP Code</label>
                  <input name="zip" value={form.zip} onChange={handleChange} placeholder="10001" required />
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <select name="country" value={form.country} onChange={handleChange}>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                    <option value="AU">Australia</option>
                  </select>
                </div>
              </div>
            </section>

            <section className="checkout-section">
              <h2>Payment Method</h2>
              <div className="payment-options">
                {[
                  { value: 'card', label: 'Credit/Debit Card', icon: '💳' },
                  { value: 'paypal', label: 'PayPal', icon: '🅿️' },
                  { value: 'cod', label: 'Cash on Delivery', icon: '💵' }
                ].map(opt => (
                  <label key={opt.value} className={`payment-option${form.paymentMethod === opt.value ? ' active' : ''}`}>
                    <input type="radio" name="paymentMethod" value={opt.value}
                      checked={form.paymentMethod === opt.value} onChange={handleChange} />
                    <span className="pay-icon">{opt.icon}</span>
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
              {form.paymentMethod === 'card' && (
                <div className="card-note">
                  🔒 Payments are processed securely. In this demo, no real charge occurs.
                </div>
              )}
            </section>
          </div>

          {/* Right — Order summary */}
          <div className="checkout-summary">
            <h2>Order Summary</h2>
            <div className="summary-items">
              {cart.items.map(item => (
                <div key={item.product?._id} className="summary-item">
                  <div className="s-item-img">
                    <img src={item.product?.images?.[0]?.url || ''} alt="" />
                    <span className="s-qty">{item.quantity}</span>
                  </div>
                  <span className="s-name">{item.product?.name}</span>
                  <span className="s-price">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <hr className="divider" />
            <div className="s-totals">
              <div className="s-line"><span>Subtotal</span><span>${cartSubtotal.toFixed(2)}</span></div>
              <div className="s-line"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span></div>
              <div className="s-line"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
            </div>
            <div className="s-total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? 'Placing Order…' : `Place Order · $${total.toFixed(2)}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
