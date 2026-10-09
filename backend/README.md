# Godown Stock & Sales Manager - Backend API

Node.js & Express REST API for managing beverage godown operations, stock tracking, and sales transactions.

## Tech Stack
- Node.js & Express
- MongoDB / Mongoose (Atlas + In-Memory fallback for local offline testing)
- JWT Authentication
- Helmet, Compression, Express Rate Limit

## Environment Variables (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/godown_stock_db?retryWrites=true&w=majority
JWT_SECRET=super_secret_jwt_key_godown_2026
ADMIN_USER=admin
ADMIN_PASSWORD=admin123
CLIENT_URL=http://localhost:5173
```

## Setup & Run
```bash
npm install
npm run seed      # Populate sample flavors, products, customers & orders
npm run dev       # Run development server on port 5000
npm start         # Run production server
```

## API Endpoints Overview
- `GET /api/health` - Health check
- `POST /api/auth/login` - Owner login
- `GET /api/products` - List products
- `POST /api/products` - Add product variant
- `POST /api/stock/receive` - Receive stock intake
- `POST /api/stock/adjust` - Adjust damaged/corrected stock
- `POST /api/orders` - Record daily sale (strictly checks stock)
- `GET /api/customers` - List agencies & sales summaries
- `GET /api/reports/dashboard` - Today, Week, Month metrics & 7-day chart data
