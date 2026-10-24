# ShopMart Backend

Node.js + Express + MongoDB (Mongoose) REST API, ShopMart React frontend ke liye.

## Folder structure

```
Shopmart_backend/
├── server.js                  # entry point (DB connect + server start)
├── package.json
├── .env.example               # copy karke .env banao
└── src/
    ├── app.js                 # express app, middlewares, routes
    ├── config/
    │   ├── db.js              # MongoDB connection
    │   └── cloudinary.js      # image upload / delete
    ├── models/
    │   ├── User.js            # users + wishlist + reset token
    │   ├── Product.js         # products (3 images, colors, options, specs)
    │   └── Order.js           # orders + payment result
    ├── controllers/
    │   ├── authController.js
    │   ├── productController.js
    │   ├── wishlistController.js
    │   ├── orderController.js
    │   └── paymentController.js   # Razorpay
    ├── routes/
    │   ├── authRoutes.js
    │   ├── productRoutes.js
    │   ├── wishlistRoutes.js
    │   ├── orderRoutes.js
    │   └── paymentRoutes.js
    ├── middleware/
    │   ├── authMiddleware.js      # protect (JWT), adminOnly
    │   ├── errorMiddleware.js     # notFound, errorHandler
    │   └── uploadMiddleware.js    # multer (max 3 images)
    ├── utils/                     # asyncHandler, ApiError, generateToken
    └── seed/                      # demo products + admin user
```

## Setup

```bash
cd Shopmart_backend
npm install
cp .env.example .env     # phir .env mein MONGO_URI aur JWT_SECRET set karo
npm run seed             # 6 demo products (har ek ki 3 images) + admin user
npm run dev              # http://localhost:5000
```

Admin login (seed ke baad): `.env` ke `ADMIN_EMAIL` / `ADMIN_PASSWORD`
(default `admin@shopmart.com` / `Admin@12345`). Production mein password badal do.

## API endpoints

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Access | Kaam |
|---|---|---|---|
| GET | `/health` | public | server check |
| POST | `/auth/register` | public | naya account |
| POST | `/auth/login` | public | login, token milta hai |
| POST | `/auth/forgot-password` | public | reset token (dev mein response mein) |
| POST | `/auth/reset-password/:token` | public | naya password |
| GET / PUT | `/auth/me` | user | profile dekho / badlo |
| GET | `/products` | public | list: `?q=&category=&sort=&minPrice=&maxPrice=&page=&limit=` |
| GET | `/products/categories` | public | categories + count |
| GET | `/products/:id` | public | **product details** (3 images ke saath) |
| POST | `/products` | admin | product banao (multipart `images` x3 ya JSON `images: [url]`) |
| PUT | `/products/:id` | admin | update |
| DELETE | `/products/:id` | admin | delete |
| GET | `/wishlist` | user | wishlist |
| POST / DELETE | `/wishlist/:productId` | user | add / remove |
| POST | `/orders` | user | order banao |
| GET | `/orders/my` | user | meri orders |
| GET | `/orders/:id` | user/admin | order detail |
| PUT | `/orders/:id/cancel` | user | cancel (shipped se pehle) |
| GET | `/orders` | admin | saari orders |
| PUT | `/orders/:id/status` | admin | status badlo |
| POST | `/payment/create-order` | user | Razorpay order |
| POST | `/payment/verify` | user | payment signature verify |

Protected routes ke liye header: `Authorization: Bearer <token>`

`sort` values: `price-low`, `price-high`, `rating`, `name`, `newest`

## Product details ka response

```json
{
  "success": true,
  "product": {
    "id": "665f...",
    "title": "iPhone 14",
    "category": "smartphones",
    "price": 66999,
    "originalPrice": 79900,
    "discount": 16,
    "image": "https://.../front.jpg",
    "images": ["https://.../1.jpg", "https://.../2.jpg", "https://.../3.jpg"],
    "colors": [{ "name": "Midnight", "hex": "#3a3d42" }],
    "optionsLabel": "Storage",
    "options": [{ "label": "128 GB", "price": 66999 }],
    "specs": { "Display": "6.1-inch Super Retina XDR" },
    "rating": { "rate": 4.8, "count": 2341 },
    "stock": 25
  }
}
```

`image` pehli image hai, taaki purana frontend code (`product.image`) chalta rahe.

## Order create karne ka body

```json
{
  "items": [{ "productId": "665f...", "quantity": 2 }],
  "shippingAddress": {
    "fullName": "Kishor Sharma", "phone": "9999999999",
    "address": "12 MG Road", "city": "Delhi", "state": "Delhi", "pincode": "110001"
  },
  "paymentMethod": "COD"
}
```

Price server DB se leta hai, client ka bheja hua price ignore hota hai.
₹500 se upar shipping free, warna ₹40 (`orderController.js` mein badal sakte ho).

## Frontend se connect karna

Frontend repo mein `.env` banao: `VITE_API_URL=http://localhost:5000/api`, aur
`src/services/ProductService.js` ke `BASE_URL` ko `import.meta.env.VITE_API_URL` par
point karo. Response shape alag hai (`{ products }` / `{ product }`), isliye
`getAllProducts` ko `data.products` aur `getProductById` ko `data.product` return
karna hoga. Frontend ka `rating.rate`, `rating.count`, `title`, `image` pehle jaise hi hain.

## Dhyan rakho

- Images: Cloudinary keys `.env` mein daale bina file upload nahi chalega, par
  JSON body mein `images: [url, url, url]` bhej kar kaam chal jata hai.
- Forgot password mein email bhejna abhi TODO hai (`authController.js`);
  development mein token response mein aata hai, production mein nahi.
- Razorpay keys ke bina `/payment/*` 503 deta hai; COD orders par koi asar nahi.
- Rate limiting aur input-schema validation (jaise zod) abhi nahi hain, deploy
  se pehle add karna.
