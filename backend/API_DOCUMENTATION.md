# Backend Setup & API Documentation

## Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Set Up Environment
Create `.env` file in the backend directory (already included):
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/event-platform
JWT_SECRET=your_secret_key
CORS_ORIGIN=http://localhost:5173
```

### 3. Start MongoDB
**Option A: Local MongoDB**
```bash
# Windows (if installed as service)
net start MongoDB

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Update `.env`: `MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/event-platform`

### 4. Start Backend Server
```bash
npm run dev
```

Server runs on `http://localhost:5000`

---

## Complete API Reference

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"  // "user" | "vendor" | "admin"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

### User Routes (`/api/user`)
*Requires: `Authorization: Bearer <token>`*

#### Get Profile
```http
GET /api/user/profile
```

#### Update Profile
```http
PUT /api/user/profile
Content-Type: application/json

{
  "phone": "1234567890",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001"
}
```

#### Get Cart
```http
GET /api/user/cart
```

#### Get User Orders
```http
GET /api/user/orders
```

#### Get Single Order
```http
GET /api/user/orders/{orderId}
```

---

### Cart Routes (`/api/cart`)
*Requires: `Authorization: Bearer <token>`*

#### Add Item to Cart
```http
POST /api/cart/add
Content-Type: application/json

{
  "itemId": "507f1f77bcf86cd799439011",
  "vendorId": "507f1f77bcf86cd799439012",
  "quantity": 2
}
```

#### Update Cart Item Quantity
```http
PUT /api/cart/{itemId}
Content-Type: application/json

{
  "quantity": 5
}
```

#### Remove Item from Cart
```http
POST /api/cart/remove/{itemId}
```

#### Clear Cart
```http
DELETE /api/cart
```

#### Checkout (Create Order)
```http
POST /api/cart/checkout
Content-Type: application/json

{
  "deliveryAddress": "123 Main St, New York, NY 10001",
  "paymentMethod": "card"
}
```

**Response (201):**
```json
{
  "message": "Orders created successfully",
  "orders": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "userId": "507f1f77bcf86cd799439011",
      "vendorId": "507f1f77bcf86cd799439012",
      "items": [
        {
          "itemId": "507f1f77bcf86cd799439014",
          "quantity": 2,
          "price": 49.99
        }
      ],
      "totalAmount": 99.98,
      "status": "pending",
      "deliveryAddress": "123 Main St, New York, NY 10001",
      "paymentMethod": "card",
      "createdAt": "2024-02-27T15:40:00Z"
    }
  ]
}
```

---

### Items Routes (`/api/items`)
*Public routes - No authentication required*

#### Get All Items (with pagination & search)
```http
GET /api/items?category=electronics&search=laptop&limit=20&page=1
```

**Response:**
```json
{
  "items": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "vendorId": {
        "_id": "507f1f77bcf86cd799439012",
        "businessName": "TechStore"
      },
      "name": "Laptop",
      "description": "High performance laptop",
      "price": 999.99,
      "category": "electronics",
      "image": "https://...",
      "quantity": 50,
      "rating": 4.5,
      "totalReviews": 120,
      "createdAt": "2024-02-27T15:40:00Z"
    }
  ],
  "pagination": {
    "total": 250,
    "page": 1,
    "limit": 20,
    "pages": 13
  }
}
```

#### Get Items by Category
```http
GET /api/items/category/electronics
```

#### Get Single Item
```http
GET /api/items/{itemId}
```

---

### Vendor Routes (`/api/vendor`)
*Some require: `Authorization: Bearer <token>` with role "vendor"*

#### Get All Vendors (public)
```http
GET /api/vendor
```

#### Get Vendor Profile (public)
```http
GET /api/vendor/{vendorId}
```

#### Get My Vendor Profile (vendor only)
```http
GET /api/vendor/me/profile
Authorization: Bearer <token>
```

#### Add Item (vendor only)
```http
POST /api/vendor/items
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "iPhone 15",
  "description": "Latest iPhone model",
  "price": 999.99,
  "category": "electronics",
  "image": "https://...",
  "quantity": 100
}
```

#### Update Item (vendor only)
```http
PUT /api/vendor/items/{itemId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "price": 899.99,
  "quantity": 80
}
```

#### Delete Item (vendor only)
```http
DELETE /api/vendor/items/{itemId}
Authorization: Bearer <token>
```

#### Get Vendor Transactions (vendor only)
```http
GET /api/vendor/me/transactions
Authorization: Bearer <token>
```

---

### Admin Routes (`/api/admin`)
*All require: `Authorization: Bearer <token>` with role "admin"*

#### Get All Users
```http
GET /api/admin/users
Authorization: Bearer <token>
```

#### Get Single User
```http
GET /api/admin/users/{userId}
Authorization: Bearer <token>
```

#### Update User Role
```http
PUT /api/admin/users/{userId}/role
Authorization: Bearer <token>
Content-Type: application/json

{
  "role": "vendor"  // "user" | "vendor" | "admin"
}
```

#### Delete User
```http
DELETE /api/admin/users/{userId}
Authorization: Bearer <token>
```

#### Get All Vendors
```http
GET /api/admin/vendors
Authorization: Bearer <token>
```

#### Verify Vendor
```http
PUT /api/admin/vendors/{vendorId}/verify
Authorization: Bearer <token>
```

#### Get All Orders
```http
GET /api/admin/orders
Authorization: Bearer <token>
```

#### Get Dashboard Statistics
```http
GET /api/admin/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "totalUsers": 150,
  "totalVendors": 25,
  "totalOrders": 450,
  "totalRevenue": 125000.50
}
```

---

## Testing with Postman

1. **Register User:**
   - POST `http://localhost:5000/api/auth/register`
   - Save the returned token

2. **Add to Cart:**
   - POST `http://localhost:5000/api/cart/add`
   - Add Bearer token to Authorization header

3. **Checkout:**
   - POST `http://localhost:5000/api/cart/checkout`
   - Add Bearer token

---

## Database Collections

### Users Collection
- name (string)
- email (string, unique)
- password (string, hashed)
- role (admin | vendor | user)
- avatar, phone, address, city, state, zipCode
- timestamps

### Vendors Collection
- userId (reference to User)
- businessName (string)
- businessDescription
- category
- rating (0-5)
- totalReviews
- isVerified (boolean)
- items (array of Item IDs)
- timestamps

### Items Collection
- vendorId (reference to Vendor)
- name, description, category
- price, quantity
- image
- rating (0-5), totalReviews
- timestamps

### Orders Collection
- userId, vendorId
- items (array: itemId, quantity, price)
- totalAmount
- status (pending | confirmed | shipped | delivered | cancelled)
- deliveryAddress, paymentMethod
- timestamps

### Carts Collection
- userId (unique)
- items (array: itemId, vendorId, quantity, price)
- totalPrice
- timestamps

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Please provide all required fields"
}
```

### 401 Unauthorized
```json
{
  "error": "Access token required"
}
```

### 403 Forbidden
```json
{
  "error": "Access denied"
}
```

### 404 Not Found
```json
{
  "error": "User not found"
}
```

### 500 Server Error
```json
{
  "error": "Internal Server Error"
}
```

---

## Common Issues & Solutions

### MongoDB Connection Failed
- Ensure MongoDB is running locally or update MONGODB_URI for Atlas connection
- Check .env file for correct MONGODB_URI

### Token Invalid
- Generate a new token by logging in
- Ensure token format: `Authorization: Bearer <token>`

### CORS Error
- Update CORS_ORIGIN in .env if frontend is on different port

---

## Next Steps

1. connect frontend to these API endpoints
2. Implement payment processing
3. Add email notifications
4. Set up image upload functionality
5. Add review/rating system
6. Implement search and filters
