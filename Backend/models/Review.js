const mongoose = require('mongoose');
const Product = require('./Product');

const reviewSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  rating:  { type: Number, required: true, min: 1, max: 5 },
  title:   { type: String, trim: true, maxlength: 100 },
  body:    { type: String, required: true, maxlength: 1000 },
  images:  [String],
  verified:{ type: Boolean, default: false }, // verified purchase
  helpful: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

// One review per user per product
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// After save/delete — recalculate product rating
async function recalcRating(productId) {
  const stats = await mongoose.model('Review').aggregate([
    { $match: { product: productId } },
    { $group: { _id: '$product', avg: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);
  const average = stats[0]?.avg ? Math.round(stats[0].avg * 10) / 10 : 0;
  const count   = stats[0]?.count || 0;
  await Product.findByIdAndUpdate(productId, { 'ratings.average': average, 'ratings.count': count });
}

reviewSchema.post('save', function () { recalcRating(this.product); });
reviewSchema.post('remove', function () { recalcRating(this.product); });
reviewSchema.post('findOneAndDelete', function (doc) { if (doc) recalcRating(doc.product); });

module.exports = mongoose.model('Review', reviewSchema);
