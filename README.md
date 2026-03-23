<div align="center">

# 🛒 ShopVault

### A Full-Stack E-Commerce Platform built with the MERN Stack

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-shop--vault--five.vercel.app-4f46e5?style=for-the-badge)](https://shop-vault-five.vercel.app)
[![Backend API](https://img.shields.io/badge/⚙️_Backend_API-shopvault33.vercel.app-10b981?style=for-the-badge)](https://shopvault33.vercel.app/api/products)
[![GitHub](https://img.shields.io/badge/GitHub-Asadullah61%2FShopVault-181717?style=for-the-badge&logo=github)](https://github.com/Asadullah61/ShopVault)

![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat-square&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=flat-square&logo=cloudinary&logoColor=white)

</div>

---

## 📌 Overview

**ShopVault** is a production-ready, full-stack e-commerce web application that allows users to browse products, manage a cart, and complete purchases — while admins can manage inventory, orders, and users through a dedicated dashboard.

Built with the **MERN Stack** and deployed on **Vercel**, ShopVault demonstrates real-world skills in REST API design, JWT authentication, cloud image uploads, and responsive UI development.

---

## 🚀 Live Demo

| Service | URL |
|---|---|
| 🌐 Frontend | [shop-vault-five.vercel.app](https://shop-vault-five.vercel.app) |
| ⚙️ Backend API | [shopvault33.vercel.app](https://shopvault33.vercel.app/api/products) |

> **Demo Credentials**
> - Email: `admin@shopvault.com`
> - Password: `admin123`

---

## ✨ Features

### 👤 User
- 🔐 Register & Login with JWT Authentication
- 🛍️ Browse products with search, filter & sort
- 🛒 Add to Cart & Checkout
- 📦 View Order History
- 👤 Profile Management

### 🛠️ Admin
- 📊 Admin Dashboard with stats
- ➕ Add / Edit / Delete Products
- 🖼️ Image Upload via Cloudinary
- 📋 Manage Orders & Users

---

## 🧰 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React.js (Vite) | UI Framework |
| React Router v6 | Client-side Routing |
| Context API | State Management |
| Axios | HTTP Requests |
| Tailwind CSS | Styling |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express.js | REST API Framework |
| MongoDB + Mongoose | Database & ODM |
| JWT | Authentication |
| Bcrypt.js | Password Hashing |
| Cloudinary | Image Storage |

### DevOps
| Technology | Purpose |
|---|---|
| Vercel | Frontend & Backend Deployment |
| MongoDB Atlas | Cloud Database |
| Git & GitHub | Version Control |

---

## 🗂️ Project Structure

```
ShopVault/
├── Frontend/               # React + Vite app
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route-level pages
│   │   ├── context/        # Global state (Auth, Cart)
│   │   └── utils/          # Axios instance & helpers
│   └── vercel.json
│
└── Backend/                # Node + Express API
    ├── config/             # DB connection
    ├── middleware/         # Auth middleware
    ├── models/             # Mongoose schemas
    ├── routes/             # API routes
    ├── server.js
    └── vercel.json
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Cloudinary account

### 1. Clone the repository
```bash
git clone https://github.com/Asadullah61/ShopVault.git
cd ShopVault
```

### 2. Backend setup
```bash
cd Backend
npm install
```

Create `.env` file:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development
```

```bash
npm start
```

### 3. Frontend setup
```bash
cd ../Frontend
npm install
```

Create `.env` file:
```env
VITE_API_URL=http://localhost:5000
```

```bash
npm run dev
```

### 4. Seed the database
```
GET http://localhost:5000/api/seed
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login & get token |

### Products
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Create product (Admin) |
| PUT | `/api/products/:id` | Update product (Admin) |
| DELETE | `/api/products/:id` | Delete product (Admin) |

### Orders
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/orders` | Place an order |
| GET | `/api/orders/my` | Get user orders |
| GET | `/api/orders` | Get all orders (Admin) |

---

## 🔐 Security

- Passwords hashed with **bcrypt**
- Auth protected via **JWT middleware**
- Environment variables via `.env` (never committed)
- CORS restricted to frontend origin

---

## 👨‍💻 Author

**Asadullah**
- 🌐 Portfolio: [shop-vault-five.vercel.app](https://shop-vault-five.vercel.app)
- 💼 LinkedIn: [linkedin.com/in/asad-ullah-6b9b44287](https://linkedin.com/in/asad-ullah-6b9b44287)
- 🐙 GitHub: [github.com/Asadullah61](https://github.com/Asadullah61)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  <sub>Built with ❤️ by Asadullah — Open to React / Full-Stack Developer roles 🚀</sub>
</div>
