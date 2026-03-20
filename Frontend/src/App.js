import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

import Home        from './pages/Home';
import Shop        from './pages/Shop';
import ProductPage from './pages/ProductPage';
import CartPage    from './pages/CartPage';
import Checkout    from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Orders      from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Login       from './pages/Login';
import Register    from './pages/Register';
import Profile     from './pages/Profile';
import Wishlist    from './pages/Wishlist';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts  from './pages/admin/Products';
import AdminOrders    from './pages/admin/Orders';

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-full"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="app">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/"            element={<Home />} />
                <Route path="/shop"        element={<Shop />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/cart"        element={<CartPage />} />
                <Route path="/login"       element={<Login />} />
                <Route path="/register"    element={<Register />} />

                <Route path="/checkout" element={
                  <ProtectedRoute><Checkout /></ProtectedRoute>
                } />
                <Route path="/order-success/:id" element={
                  <ProtectedRoute><OrderSuccess /></ProtectedRoute>
                } />
                <Route path="/orders" element={
                  <ProtectedRoute><Orders /></ProtectedRoute>
                } />
                <Route path="/orders/:id" element={
                  <ProtectedRoute><OrderDetail /></ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute><Profile /></ProtectedRoute>
                } />
                <Route path="/wishlist" element={
                  <ProtectedRoute><Wishlist /></ProtectedRoute>
                } />

                {/* Admin */}
                <Route path="/admin" element={
                  <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>
                } />
                <Route path="/admin/products" element={
                  <ProtectedRoute adminOnly><AdminProducts /></ProtectedRoute>
                } />
                <Route path="/admin/orders" element={
                  <ProtectedRoute adminOnly><AdminOrders /></ProtectedRoute>
                } />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <Toaster position="top-right" toastOptions={{ style: { fontFamily: 'var(--font-body)', borderRadius: '8px' } }} />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
