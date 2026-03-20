const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart  = require('../models/Cart');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

// POST /api/orders — place order from cart
router.post('/', protect, async (req, res) => {
  try {
    const { shippingAddress, paymentMethod = 'card' } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) return res.status(400).json({ message: 'Cart is empty' });

    // Validate stock
    for (const item of cart.items) {
      if (!item.product || !item.product.isActive)
        return res.status(400).json({ message: `Product "${item.product?.name}" is no longer available` });
      if (item.product.stock < item.quantity)
        return res.status(400).json({ message: `Insufficient stock for "${item.product.name}"` });
    }

    const itemsTotal = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shippingCost = itemsTotal >= 50 ? 0 : 9.99;
    const tax = parseFloat((itemsTotal * 0.08).toFixed(2));
    const totalAmount = parseFloat((itemsTotal + shippingCost + tax).toFixed(2));

    const order = await Order.create({
      user: req.user._id,
      items: cart.items.map(i => ({
        product:  i.product._id,
        name:     i.product.name,
        image:    i.product.images[0]?.url || '',
        price:    i.price,
        quantity: i.quantity
      })),
      shippingAddress,
      payment: { method: paymentMethod, status: paymentMethod === 'cod' ? 'pending' : 'paid', paidAt: paymentMethod !== 'cod' ? new Date() : undefined },
      itemsTotal,
      shippingCost,
      tax,
      totalAmount
    });

    // Deduct stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, { $inc: { stock: -item.quantity } });
    }

    // Clear cart
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/my — user's orders
router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/:id — order details
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' });
    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/orders/:id/cancel — user cancel
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (!['pending', 'confirmed'].includes(order.status))
      return res.status(400).json({ message: 'Order cannot be cancelled at this stage' });

    order.status = 'cancelled';
    order.cancelledAt = new Date();
    order.cancelReason = req.body.reason || 'Cancelled by customer';
    await order.save();

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
    }

    res.json({ message: 'Order cancelled', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── Admin routes ─────────────────────────────────────────────────────────────

// GET /api/orders — all orders (admin)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { status } : {};
    const [orders, total] = await Promise.all([
      Order.find(query).sort('-createdAt').skip((page-1)*limit).limit(Number(limit)).populate('user', 'name email'),
      Order.countDocuments(query)
    ]);
    res.json({ orders, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/orders/:id/status — admin update status
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status, trackingNumber } = req.body;
    const updates = { status };
    if (trackingNumber) updates.trackingNumber = trackingNumber;
    if (status === 'delivered') updates.deliveredAt = new Date();
    const order = await Order.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order status updated', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
