import express, { Request, Response, Router } from "express";
import { User } from "../models/User.js";
import { Cart } from "../models/Cart.js";
import { Order } from "../models/Order.js";
import { authenticateToken, authorizeRole, AuthRequest } from "../middleware/auth.js";

const router: Router = express.Router();

// Get user profile
router.get("/profile", authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.put("/profile", authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, phone, address, city, state, zipCode } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, phone, address, city, state, zipCode },
      { new: true }
    ).select("-password");

    res.json({ message: "Profile updated", user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get user cart
router.get("/cart", authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const cart = await Cart.findOne({ userId: req.userId }).populate("items.itemId");

    if (!cart) {
      res.json({ userId: req.userId, items: [], totalPrice: 0 });
      return;
    }

    res.json(cart);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get user orders
router.get("/orders", authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const orders = await Order.find({ userId: req.userId })
      .populate("vendorId")
      .populate("items.itemId")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get single order
router.get("/orders/:orderId", authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      userId: req.userId,
    })
      .populate("vendorId")
      .populate("items.itemId");

    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    res.json(order);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
