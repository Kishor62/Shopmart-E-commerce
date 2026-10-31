# Shopmart Backend

REST API for the Shopmart e-commerce app.
**Stack:** Node.js 20+ · Express 5 · MongoDB (Mongoose 8) · JWT (httpOnly cookie + Bearer) · Zod validation · Razorpay payments · Helmet / CORS / rate limiting.

## Setup

```bash
npm install
cp .env.example .env      # then fill MONGO_URI, JWT_SECRET, Razorpay keys
npm run seed              # sample categories, products + admin user
npm run dev               # http://localhost:5000
```

Seed admin: `admin@shopmart.com` / `Admin@1234` (change it!)

## Folder structure

```
src/
  config/        env.js (validated env), db.js
  models/        User, Product, Category, Order
  middleware/    auth, validate, error, rateLimit
  validators/    zod schemas
  controllers/   auth, product, wishlist, order, payment
  services/      razorpay.js, orderService.js (pricing, stock)
  routes/        index.js
  scripts/       seed.js
  app.js         express app
  server.js      boot + graceful shutdown + stale-order cleanup job
```

## API

| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/api/auth/register` | – | name, email, password, phone? |
| POST | `/api/auth/login` | – | sets cookie + returns `token` |
| POST | `/api/auth/logout` | – | |
| GET/PATCH | `/api/auth/me` | user | |
| PATCH | `/api/auth/change-password` | user | |
| POST/DELETE | `/api/auth/addresses[/:id]` | user | saved addresses |
| GET | `/api/products` | – | `q, category, brand, minPrice, maxPrice, inStock, sort, page, limit` |
| GET | `/api/products/search?q=` | – | DummyJSON-compatible |
| GET | `/api/products/categories` | – | `[{name, slug}]` |
| GET | `/api/products/category/:slug` | – | |
| GET | `/api/products/:id` | – | returns `product` + `related` |
| POST/PATCH/DELETE | `/api/products[/:id]` | admin | delete = soft delete |
| GET/POST | `/api/categories` | GET public / POST admin | |
| GET | `/api/wishlist` | user | |
| POST | `/api/wishlist/toggle` | user | `{ productId }` |
| DELETE | `/api/wishlist` | user | clear |
| POST | `/api/orders` | user | `{ items:[{productId,quantity}], shippingAddress, paymentMethod: "razorpay"｜"cod" }` |
| GET | `/api/orders/mine` | user | |
| GET | `/api/orders/:id` | user/admin | |
| PATCH | `/api/orders/:id/cancel` | user | restores stock |
| GET | `/api/orders` | admin | all orders |
| PATCH | `/api/orders/:id/status` | admin | |
| POST | `/api/payment/create-order` | user | `{ orderId }` -> Razorpay order |
| POST | `/api/payment/verify` | user | checkout signature verify |
| POST | `/api/payment/webhook` | Razorpay | raw body + signature |

Product list responses look like `{ products, total, skip, limit, page, pages }`, so the
React `Categories.jsx` page works by just changing `const API` (see below).

## Payment flow (Razorpay)

1. Frontend: `POST /api/orders` (creates order, price is computed from DB, stock reserved).
2. Frontend: `POST /api/payment/create-order { orderId }` -> `{ key, razorpayOrderId, amount, currency }`.
3. Frontend opens Razorpay Checkout; its `handler` gets `razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature`.
4. Frontend: `POST /api/payment/verify` with those 3 values -> order becomes `paid` + `confirmed`.
5. Razorpay also calls `POST /api/payment/webhook` (events `payment.captured`, `order.paid`, `payment.failed`) as a safety net.
   Dashboard -> Webhooks -> URL `https://YOUR_DOMAIN/api/payment/webhook`, secret = `RAZORPAY_WEBHOOK_SECRET`.
   For local testing expose your server with ngrok.
6. Unpaid online orders are auto-cancelled after 30 min and their stock is released.

### Frontend snippet (Checkout.jsx)

```jsx
const placeOrder = async () => {
  const { data: o } = await api.post("/orders", { items, shippingAddress, paymentMethod: "razorpay" });
  const { data: p } = await api.post("/payment/create-order", { orderId: o.order.id });

  new window.Razorpay({
    key: p.key,
    amount: p.amount,
    currency: p.currency,
    order_id: p.razorpayOrderId,
    name: "Shopmart",
    prefill: p.prefill,
    handler: async (resp) => {
      await api.post("/payment/verify", resp);
      navigate(`/order-success/${o.order.id}`);
    },
  }).open();
};
```
Add `<script src="https://checkout.razorpay.com/v1/checkout.js"></script>` to `index.html`.

## Connecting the React app

Axios instance (cookie auth needs `withCredentials`):

```js
import axios from "axios";
export const api = axios.create({ baseURL: "http://localhost:5000/api", withCredentials: true });
```

In `Categories.jsx` change `const API = "https://dummyjson.com";` to `"http://localhost:5000/api"`.
(Endpoints `/products/categories`, `/products/category/:slug`, `/products/search?q=` match.)

## Security notes

- Prices and totals are always computed on the server; client prices are ignored.
- Passwords hashed with bcrypt (cost 12); `role` can never be set from the client.
- Razorpay signatures are checked with timing-safe comparison; payment marking is idempotent.
- Helmet, CORS allow-list, rate limiting (stricter on auth), body size limit, input validation on every route.
- Keep `.env` out of git; use Live Razorpay keys only after KYC.

## Deploy

Set the same env vars on Render / Railway / any VPS, `NODE_ENV=production`, and use MongoDB Atlas for `MONGO_URI`.
Set `CLIENT_URL` to your deployed frontend URL (cookies use `SameSite=None; Secure` in production, so use HTTPS).
