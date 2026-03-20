const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Order = require('../models/Order');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/reviews/product/:productId
router.get('/product/:productId', async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;
    const [reviews, total] = await Promise.all([
      Review.find({ product: req.params.productId })
        .sort(sort).skip((page-1)*limit).limit(Number(limit))
        .populate('user', 'name avatar'),
      Review.countDocuments({ product: req.params.productId })
    ]);
    res.json({ reviews, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/reviews — create review (must have purchased product)
router.post('/', protect, async (req, res) => {
  try {
    const { productId, rating, title, body } = req.body;

    // Check if already reviewed
    const existing = await Review.findOne({ user: req.user._id, product: productId });
    if (existing) return res.status(409).json({ message: 'You have already reviewed this product' });

    // Check verified purchase
    const purchased = await Order.findOne({
      user: req.user._id,
      'items.product': productId,
      status: 'delivered'
    });

    const review = await Review.create({
      user: req.user._id,
      product: productId,
      rating, title, body,
      verified: !!purchased
    });

    await review.populate('user', 'name avatar');
    res.status(201).json({ message: 'Review posted', review });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: 'Already reviewed' });
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/reviews/:id — edit own review
router.put('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findOne({ _id: req.params.id, user: req.user._id });
    if (!review) return res.status(404).json({ message: 'Review not found' });
    const { rating, title, body } = req.body;
    if (rating) review.rating = rating;
    if (title)  review.title  = title;
    if (body)   review.body   = body;
    await review.save();
    res.json({ message: 'Review updated', review });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/reviews/:id — owner or admin
router.delete('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' });
    await review.deleteOne();
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/reviews/:id/helpful — toggle helpful vote
router.post('/:id/helpful', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    const idx = review.helpful.indexOf(req.user._id);
    if (idx > -1) review.helpful.splice(idx, 1);
    else review.helpful.push(req.user._id);
    await review.save();
    res.json({ helpfulCount: review.helpful.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
