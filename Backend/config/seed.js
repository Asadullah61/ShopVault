const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

const User    = require('../models/User');
const Product = require('../models/Product');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/shopvault';

const products = [
  {
    name: 'Premium Wireless Headphones',
    description: 'Over-ear noise-cancelling headphones with 30hr battery life, Hi-Res audio, and premium leather cushions.',
    price: 149.99, comparePrice: 249.99,
    category: 'Electronics', brand: 'SoundElite',
    stock: 45, isFeatured: true,
    images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', public_id: 'headphones' }],
    tags: ['audio', 'wireless', 'noise-cancelling']
  },
  {
    name: 'Minimalist Leather Watch',
    description: 'Swiss-movement quartz watch with genuine leather strap and sapphire crystal glass. Water resistant to 50m.',
    price: 219.00, comparePrice: 320.00,
    category: 'Other', brand: 'Timecraft',
    stock: 22, isFeatured: true,
    images: [{ url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', public_id: 'watch' }],
    tags: ['watch', 'leather', 'minimalist']
  },
  {
    name: 'Ergonomic Office Chair',
    description: 'Lumbar support mesh chair with adjustable armrests, headrest, and 4D recline for all-day comfort.',
    price: 389.00, comparePrice: 549.00,
    category: 'Home & Garden', brand: 'ErgoSeat',
    stock: 13, isFeatured: true,
    images: [{ url: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500', public_id: 'chair' }],
    tags: ['office', 'ergonomic', 'furniture']
  },
  {
    name: 'Mechanical Keyboard TKL',
    description: 'Tenkeyless mechanical keyboard with Cherry MX Red switches, RGB per-key backlighting, and PBT keycaps.',
    price: 129.00, comparePrice: 179.00,
    category: 'Electronics', brand: 'KeyForge',
    stock: 60,
    images: [{ url: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500', public_id: 'keyboard' }],
    tags: ['keyboard', 'mechanical', 'rgb', 'gaming']
  },
  {
    name: 'Yoga Mat Premium',
    description: 'Non-slip natural rubber yoga mat, 6mm thick with carrying strap. Eco-certified and sweat-proof.',
    price: 59.99, comparePrice: 89.99,
    category: 'Sports', brand: 'ZenFlow',
    stock: 100, isFeatured: true,
    images: [{ url: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500', public_id: 'yoga' }],
    tags: ['yoga', 'fitness', 'mat']
  },
  {
    name: 'Stainless Steel Water Bottle',
    description: 'Double-wall vacuum insulated 32oz bottle. Keeps drinks cold 24hr, hot 12hr. BPA-free lid.',
    price: 34.99, comparePrice: 49.99,
    category: 'Sports', brand: 'HydroKeep',
    stock: 150,
    images: [{ url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500', public_id: 'bottle' }],
    tags: ['bottle', 'hydration', 'insulated']
  },
  {
    name: 'Scented Soy Candle Set',
    description: 'Set of 3 hand-poured soy candles: Vanilla Oak, Coastal Breeze, and Lavender Fields. 40hr burn each.',
    price: 44.95, comparePrice: 65.00,
    category: 'Home & Garden', brand: 'WickWell',
    stock: 80,
    images: [{ url: 'https://images.unsplash.com/photo-1602523961358-f9f03dd557db?w=500', public_id: 'candles' }],
    tags: ['candle', 'home', 'fragrance']
  },
  {
    name: 'Classic Denim Jacket',
    description: 'Medium-wash unisex denim jacket with button closure, chest pockets, and washed finish. 100% cotton.',
    price: 79.00, comparePrice: 120.00,
    category: 'Clothing', brand: 'UrbanThread',
    stock: 35, isFeatured: true,
    images: [{ url: 'https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=500', public_id: 'denim' }],
    tags: ['jacket', 'denim', 'casual']
  },
  {
    name: 'Portable Espresso Maker',
    description: 'Manual handheld espresso machine — no electricity required. 18 bar pressure, fits Nespresso capsules.',
    price: 69.99, comparePrice: 99.99,
    category: 'Home & Garden', brand: 'BrewGo',
    stock: 55,
    images: [{ url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500', public_id: 'espresso' }],
    tags: ['coffee', 'espresso', 'portable']
  },
  {
    name: 'Running Shoes Pro',
    description: 'Lightweight carbon-fibre plate running shoes with responsive foam midsole and breathable mesh upper.',
    price: 159.99, comparePrice: 220.00,
    category: 'Sports', brand: 'SwiftStride',
    stock: 28, isFeatured: true,
    images: [{ url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', public_id: 'shoes' }],
    tags: ['running', 'shoes', 'fitness']
  },
  {
    name: 'Skincare Essentials Kit',
    description: 'Complete 5-step routine: cleanser, toner, Vitamin C serum, moisturiser, and SPF 50 sunscreen.',
    price: 94.00, comparePrice: 140.00,
    category: 'Beauty', brand: 'GlowLab',
    stock: 40,
    images: [{ url: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500', public_id: 'skincare' }],
    tags: ['skincare', 'beauty', 'routine']
  },
  {
    name: 'Smart LED Desk Lamp',
    description: 'Tri-tone LED lamp with USB-C charging port, eye-care mode, touch dimmer, and memory function.',
    price: 49.99, comparePrice: 79.99,
    category: 'Electronics', brand: 'LumiDesk',
    stock: 75,
    images: [{ url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500', public_id: 'lamp' }],
    tags: ['lamp', 'desk', 'smart', 'led']
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing
    await Promise.all([User.deleteMany(), Product.deleteMany()]);
    console.log('🗑  Cleared existing data');

    // Create admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@shopvault.com',
      password: 'admin123',
      role: 'admin'
    });

    // Create demo user
    await User.create({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'password123'
    });

    // Create products
    const created = await Product.create(products.map(p => ({ ...p, seller: admin._id })));
    console.log(`✅ Seeded ${created.length} products`);
    console.log('\n👤 Admin:  admin@shopvault.com / admin123');
    console.log('👤 User:   jane@example.com / password123\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
