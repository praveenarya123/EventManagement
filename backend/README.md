# Event Platform Backend API

Express.js backend server with MongoDB for the event platform application.

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
# or
bun install
```

### 2. Configure Environment Variables

Create a `.env` file in the backend directory (copy from `.env.example`):

```bash
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/event-platform

# JWT
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:5173
```

### 3. MongoDB Setup

#### Option A: Local MongoDB
Make sure MongoDB is running locally:
```bash
# On Windows (if installed via MSI)
# MongoDB is typically installed as a service

# On Mac
brew services start mongodb-community

# On Linux
sudo systemctl start mongod
```

#### Option B: MongoDB Atlas (Cloud)
1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get your connection string
4. Update MONGODB_URI in `.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/event-platform?retryWrites=true&w=majority
```

### 4. Run the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production build:
```bash
npm run build
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register a new user
- `POST /login` - Login user

### User (`/api/user`)
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `GET /cart` - Get user cart
- `GET /orders` - Get user orders
- `GET /orders/:orderId` - Get single order

### Vendor (`/api/vendor`)
- `GET /` - Get all vendors
- `GET /:vendorId` - Get vendor profile
- `GET /me/profile` - Get my vendor profile
- `POST /items` - Add item (vendor only)
- `PUT /items/:itemId` - Update item (vendor only)
- `DELETE /items/:itemId` - Delete item (vendor only)
- `GET /me/transactions` - Get vendor transactions

### Admin (`/api/admin`)
- `GET /users` - Get all users (admin only)
- `GET /users/:userId` - Get user by ID (admin only)
- `PUT /users/:userId/role` - Update user role (admin only)
- `DELETE /users/:userId` - Delete user (admin only)
- `GET /vendors` - Get all vendors (admin only)
- `PUT /vendors/:vendorId/verify` - Verify vendor (admin only)
- `GET /orders` - Get all orders (admin only)
- `GET /stats` - Get dashboard statistics (admin only)

## Database Models

### User
```typescript
{
  name: string
  email: string (unique)
  password: string (hashed)
  role: "admin" | "vendor" | "user"
  avatar?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  createdAt: Date
  updatedAt: Date
}
```

### Vendor
```typescript
{
  userId: ObjectId (ref: User)
  businessName: string
  businessDescription: string
  category: string
  rating: number (0-5)
  totalReviews: number
  isVerified: boolean
  items: ObjectId[] (ref: Item)
  createdAt: Date
  updatedAt: Date
}
```

### Item
```typescript
{
  vendorId: ObjectId (ref: Vendor)
  name: string
  description: string
  price: number
  category: string
  image: string
  quantity: number
  rating: number (0-5)
  totalReviews: number
  createdAt: Date
  updatedAt: Date
}
```

### Order
```typescript
{
  userId: ObjectId (ref: User)
  vendorId: ObjectId (ref: Vendor)
  items: [{
    itemId: ObjectId
    quantity: number
    price: number
  }]
  totalAmount: number
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  deliveryAddress: string
  paymentMethod: string
  createdAt: Date
  updatedAt: Date
}
```

### Cart
```typescript
{
  userId: ObjectId (ref: User, unique)
  items: [{
    itemId: ObjectId
    vendorId: ObjectId
    quantity: number
    price: number
  }]
  totalPrice: number
  createdAt: Date
  updatedAt: Date
}
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_token>
```

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   └── errorHandler.ts
│   ├── models/
│   │   ├── User.ts
│   │   ├── Vendor.ts
│   │   ├── Item.ts
│   │   ├── Order.ts
│   │   └── Cart.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── user.ts
│   │   ├── vendor.ts
│   │   └── admin.ts
│   └── server.ts
├── .env.example
├── .gitignore
├── package.json
└── tsconfig.json
```

## Technologies Used

- **Express.js** - Web framework
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **TypeScript** - Type safety
- **CORS** - Cross-origin requests
