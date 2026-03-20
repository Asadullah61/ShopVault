import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './CartPage.css';

export default function CartPage() {
  const { cart, cartSubtotal, updateQuantity, removeItem, loading } = useCart();
  const { user } = useAuth();

  const shipping = cartSubtotal >= 50 ? 0 : 9.99;
  const tax      = parseFloat((cartSubtotal * 0.08).toFixed(2));
  const total    = parseFloat((cartSubtotal + shipping + tax).toFixed(2));

  if (loading) return <div className="loading-full"><div className="spinner" /></div>;

  return (
    <div className="cart-page">
      <div className="container">
        <div className="page-header">
          <h1>Your Cart</h1>
          <p>{cart.items?.length || 0} item{cart.items?.length !== 1 ? 's' : ''}</p>
        </div>

        {(!cart.items || cart.items.length === 0) ? (
          <div className="empty-state">
            <div className="empty-icon">🛒</div>
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added anything yet</p>
            <Link to="/shop" className="btn btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div className="cart-layout">
            {/* Items */}
            <div className="cart-items">
              {cart.items.map(item => (
                <div key={item.product?._id || item._id} className="cart-item animate-in">
                  <div className="item-image">
                    <img
                      src={item.product?.images?.[0]?.url || 'https://via.placeholder.com/80'}
                      alt={item.product?.name}
                    />
                  </div>
                  <div className="item-info">
                    <Link to={`/product/${item.product?._id}`} className="item-name">
                      {item.product?.name}
                    </Link>
                    <p className="item-price">${item.price?.toFixed(2)}</p>
                    {item.product?.stock < 5 && item.product?.stock > 0 && (
                      <p className="item-stock-warn">Only {item.product.stock} left!</p>
                    )}
                  </div>
                  <div className="item-qty">
                    <button onClick={() => updateQuantity(item.product?._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product?._id, item.quantity + 1)}
                      disabled={item.quantity >= (item.product?.stock || 99)}>+</button>
                  </div>
                  <div className="item-total">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                  <button className="item-remove" onClick={() => removeItem(item.product?._id)} aria-label="Remove">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="order-summary">
              <h2>Order Summary</h2>
              <div className="summary-lines">
                <div className="summary-line">
                  <span>Subtotal</span>
                  <span>${cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="summary-line">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <span className="free">Free</span> : `$${shipping.toFixed(2)}`}</span>
                </div>
                {cartSubtotal < 50 && (
                  <p className="free-ship-note">Add ${(50 - cartSubtotal).toFixed(2)} more for free shipping</p>
                )}
                <div className="summary-line">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              {user ? (
                <Link to="/checkout" className="btn btn-primary btn-full btn-lg">
                  Proceed to Checkout
                </Link>
              ) : (
                <div className="auth-prompt">
                  <Link to="/login" className="btn btn-primary btn-full">Login to Checkout</Link>
                  <p>or <Link to="/register">create an account</Link></p>
                </div>
              )}
              <Link to="/shop" className="btn btn-ghost btn-full" style={{ marginTop: 8 }}>← Continue Shopping</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
