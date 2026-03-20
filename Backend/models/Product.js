const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String, required: [true, 'Product name is required'],
    trim: true, maxlength: [200, 'Name too long']
  },
  slug: { type: String, unique: true, lowercase: true },
  description: { type: String, required: true, maxlength: [2000, 'Description too long'] },
  price: { type: Number, required: true, min: [0, 'Price cannot be negative'] },
  comparePrice: { type: Number, default: 0 }, // original price for showing discount
  category: {
    type: String, required: true,
    enum: ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Beauty', 'Toys', 'Automotive', 'Other']
  },
  brand:  { type: String, trim: true },
  images: [{ url: String, public_id: String }],
  stock:  { type: Number, required: true, default: 0, min: 0 },
  sku:    { type: String, unique: true, sparse: true },
  tags:   [String],
  ratings: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count:   { type: Number, default: 0 }
  },
  isFeatured: { type: Boolean, default: false },
  isActive:   { type: Boolean, default: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  specifications: { type: Map, of: String }
}, { timestamps: true });

// Auto-generate slug from name
productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now();
  }
  next();
});

// Virtual: discount percentage
productSchema.virtual('discountPercent').get(function () {
  if (this.comparePrice && this.comparePrice > this.price) {
    return Math.round(((this.comparePrice - this.price) / this.comparePrice) * 100);
  }
  return 0;
});

productSchema.set('toJSON', { virtuals: true });

// Text search index
productSchema.index({ name: 'text', description: 'text', tags: 'text', brand: 'text' });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ 'ratings.average': -1 });

module.exports = mongoose.model('Product', productSchema);
