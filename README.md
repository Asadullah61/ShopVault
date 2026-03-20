# 🛍️ ShopVault — Full-Stack MERN E-Commerce

A complete, production-ready e-commerce platform built with the **MERN stack** (MongoDB, Express, React, Node.js).

---

## 🚀 Live Demo

| Service  | URL |
|----------|-----|
| Frontend | `https://shopvault.vercel.app` *(after deployment)* |
| Backend  | `https://shopvault-api.railway.app` *(after deployment)* |

**Demo Credentials:**
- Admin: `admin@shopvault.com` / `admin123`
- User: `jane@example.com` / `password123`

---

## ✨ Features

### 🔐 Authentication
- JWT-based register / login / logout
- Protected routes (frontend + backend)
- Role-based access (user / admin)
- Profile update & password change

### 🛒 Shopping
- Browse & search 12+ products
- Filter by category, price, availability
- Sort by newest, price, rating
- Product detail page with image gallery
- Add to cart / update quantity / remove
- Wishlist (save for later)

### 📦 Orders (Full CRUD)
- Place orders from cart
- Auto shipping cost + tax calculation
- Order history with status tracking
- Cancel orders (pending/confirmed)
- Visual progress tracker

### ⭐ Reviews (Full CRUD)
- Write / edit / delete reviews
- 1–5 star ratings
- Verified purchase badge
- Auto-recalculate product rating

### 🔧 Admin Panel
- Dashboard with revenue & order stats
- Create / edit / delete products
- Update order status
- Manage all orders with filters

---

## 🏗️ Architecture

```
shopvault/
├── backend/                  ← Node.js + Express REST API
│   ├── models/               ← Mongoose schemas
│   │   ├── User.js           ← Auth, wishlist, addresses
│   │   ├── Product.js        ← Full product schema
│   │   ├── Order.js          ← Order lifecycle
│   │   ├── Cart.js           ← Per-user cart
│   │   └── Review.js         ← Ratings & reviews
│   ├── routes/               ← REST endpoints
│   │   ├── auth.js           ← /api/auth/*
│   │   ├── products.js       ← /api/products/*
│   │   ├── cart.js           ← /api/cart/*
│   │   ├── orders.js         ← /api/orders/*
│   │   ├── reviews.js        ← /api/reviews/*
│   │   └── users.js          ← /api/users/* (admin)
│   ├── middleware/
│   │   └── auth.js           ← JWT protect / adminOnly
│   ├── config/
│   │   └── seed.js           ← Database seeder
│   └── server.js             ← Express app entry
│
└── frontend/                 ← React 18 SPA
    └── src/
        ├── context/          ← AuthContext, CartContext
        ├── pages/            ← All page components
        ├── components/       ← Navbar, Footer, ProductCard
        └── utils/
            └── api.js        ← Axios instance + interceptors
```

---

## ⚡ Quick Start (Local)

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier)

### 1. Clone & install
```bash
git clone https://github.com/yourusername/shopvault.git
cd shopvault

# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 2. Configure environment

**backend/.env**
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/shopvault
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

**frontend/.env**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Seed database & run
```bash
# Seed sample products + users
cd backend && node config/seed.js

# Start backend (port 5000)
npm run dev

# Start frontend (port 3000) — new terminal
cd frontend && npm start
```

---

## 🚢 Deployment

### Backend → Railway
1. Push code to GitHub
2. railway.app → New Project → Deploy from GitHub
3. Set Root Directory: `backend`
4. Add environment variables (same as .env)
5. Deploy → copy your Railway URL

### Frontend → Vercel
1. vercel.com → New Project → Import GitHub repo
2. Set Root Directory: `frontend`
3. Add environment variable:
   ```
   REACT_APP_API_URL=https://your-railway-url.railway.app/api
   ```
4. Deploy → your app is live!

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Register |
| POST | `/api/auth/login` | — | Login |
| GET | `/api/auth/me` | ✅ | Get profile |
| PUT | `/api/auth/profile` | ✅ | Update profile |
| GET | `/api/products` | — | List products |
| POST | `/api/products` | 🔒 Admin | Create product |
| PUT | `/api/products/:id` | 🔒 Admin | Update product |
| DELETE | `/api/products/:id` | 🔒 Admin | Delete product |
| GET | `/api/cart` | ✅ | Get cart |
| POST | `/api/cart/add` | ✅ | Add to cart |
| PUT | `/api/cart/item/:id` | ✅ | Update quantity |
| DELETE | `/api/cart/item/:id` | ✅ | Remove item |
| POST | `/api/orders` | ✅ | Place order |
| GET | `/api/orders/my` | ✅ | My orders |
| PUT | `/api/orders/:id/cancel` | ✅ | Cancel order |
| GET | `/api/reviews/product/:id` | — | Get reviews |
| POST | `/api/reviews` | ✅ | Post review |
| DELETE | `/api/reviews/:id` | ✅ | Delete review |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, React Router v6, Axios |
| Styling | Custom CSS with CSS variables |
| State | React Context API |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Deployment | Railway (backend), Vercel (frontend) |

---

## 📄 License

MIT — free to use for learning and projects.
