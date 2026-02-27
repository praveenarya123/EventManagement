# Backend Complete Setup Guide

## Project Structure Created ✓

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts          # MongoDB connection setup
│   ├── middleware/
│   │   ├── auth.ts              # JWT authentication & role authorization
│   │   └── errorHandler.ts      # Centralized error handling
│   ├── models/
│   │   ├── User.ts              # User schema with password hashing
│   │   ├── Vendor.ts            # Vendor profile schema
│   │   ├── Item.ts              # Product/Item schema
│   │   ├── Order.ts             # Order schema
│   │   └── Cart.ts              # Shopping cart schema
│   ├── routes/
│   │   ├── auth.ts              # Register & Login endpoints
│   │   ├── user.ts              # User profile & orders
│   │   ├── vendor.ts            # Vendor management & items
│   │   ├── admin.ts             # Admin dashboard & statistics
│   │   ├── cart.ts              # Shopping cart operations
│   │   └── items.ts             # Product catalog
│   └── server.ts                # Express app with all routes
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript configuration
├── .env                         # Environment variables
├── .env.example                 # Environment template
├── .gitignore                   # Git ignore rules
└── README.md                    # Quick start guide
```

## Setup Instructions

### 1. Install Dependencies ✓
```bash
cd backend
npm install
```

### 2. Configure MongoDB Atlas

#### Get Your MongoDB Connection String:

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign in or create account
3. Create a new cluster (Free tier available)
4. Click "Connect" on your cluster
5. Copy the connection string that looks like:
   ```
   mongodb+srv://USERNAME:PASSWORD@cluster-name.mongodb.net/database-name?retryWrites=true&w=majority
   ```

#### Update `.env` File:

Replace the `MONGODB_URI` with your actual connection string:

```env
PORT=5000
NODE_ENV=development

# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://praveenarya604_db_user:Akash123@YOUR_CLUSTER_NAME.mongodb.net/event-platform?retryWrites=true&w=majority

# JWT
JWT_SECRET=event_platform_super_secret_key_change_in_production_2024
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:5173
```

⚠️ **Important**: Replace `YOUR_CLUSTER_NAME` with your actual MongoDB Atlas cluster name!

### 3. Start Backend Server

```bash
npm run dev
```

Expected output:
```
✓ MongoDB connected successfully
Server running on http://localhost:5000
```

### 4. Test the API

Use Postman, Thunder Client, or curl to test:

```bash
# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123",
    "role": "user"
  }'
```

---

## Key Features

✓ **User Management**
- Register with email/password
- Login with JWT token
- Three roles: User, Vendor, Admin
- Profile management

✓ **Vendor Features**
- Create business profile
- Add/Edit/Delete products
- View transactions
- Admin verification

✓ **Shopping**
- Browse items by category
- Add to cart
- Manage cart
- Checkout (creates orders per vendor)

✓ **Admin Dashboard**
- View all users/vendors/orders
- Manage user roles
- Verify vendors
- Dashboard statistics

✓ **Security**
- Password hashing (bcryptjs)
- JWT authentication
- Role-based authorization (RBAC)
- Error handling

---

## Database Structure

### Collections Created Automatically:

1. **users** - User accounts with hashed passwords
2. **vendors** - Business profiles
3. **items** - Products/Services
4. **orders** - Customer orders (grouped by vendor)
5. **carts** - Shopping carts

---

## API Quick Reference

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
```

### User Operations
```
GET    /api/user/profile          [Requires Token]
PUT    /api/user/profile          [Requires Token]
GET    /api/user/cart             [Requires Token]
GET    /api/user/orders           [Requires Token]
```

### Shopping
```
GET    /api/items                 [Public]
GET    /api/items/{id}            [Public]
POST   /api/cart/add              [Requires Token]
PUT    /api/cart/{itemId}         [Requires Token]
DELETE /api/cart/{itemId}         [Requires Token]
POST   /api/cart/checkout         [Requires Token]
```

### Vendor Management
```
POST   /api/vendor/items          [Requires Token + Vendor Role]
PUT    /api/vendor/items/{id}     [Requires Token + Vendor Role]
DELETE /api/vendor/items/{id}     [Requires Token + Vendor Role]
```

### Admin Dashboard
```
GET    /api/admin/users           [Requires Token + Admin Role]
GET    /api/admin/vendors         [Requires Token + Admin Role]
GET    /api/admin/orders          [Requires Token + Admin Role]
GET    /api/admin/stats           [Requires Token + Admin Role]
```

---

## Common Issues & Solutions

### MongoDB Connection Failed
**Error**: `querySrv ENOTFOUND _mongodb._tcp.eventdb.mongodb.net`
**Solution**: Replace cluster name in MONGODB_URI with your actual cluster

### Token Invalid
**Error**: `Invalid or expired token`
**Solution**: Include `Authorization: Bearer <your_token>` header in requests

### CORS Error
**Error**: `CORS policy blocked`
**Solution**: Check CORS_ORIGIN in .env matches your frontend URL

### Port Already in Use
**Error**: `listen EADDRINUSE :::5000`
**Solution**: Change PORT in .env or kill process on port 5000

---

## Next Steps

1. **Connect Frontend**: Update [src/main.tsx](../src/main.tsx) to call these API endpoints
2. **Environment**: Create `.env.local` for production variables
3. **Testing**: Use API_DOCUMENTATION.md for complete endpoint reference
4. **Payment**: Integrate Stripe or PayPal for real transactions
5. **Email**: Add NodeMailer for notifications

---

## Production Checklist

- [ ] Update `JWT_SECRET` to a strong random string
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS
- [ ] Add rate limiting
- [ ] Add input validation (Joi is already installed)
- [ ] Add logging
- [ ] Set up Redis for caching
- [ ] Configure database backups
- [ ] Add monitoring and alerting

---

## Support

For full API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

For MongoDB help: https://www.mongodb.com/docs/manual/
For Express.js help: https://expressjs.com/
