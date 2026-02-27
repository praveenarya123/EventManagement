import express, { Request, Response, Router } from "express";
import { User } from "../models/User.js";
import { Vendor } from "../models/Vendor.js";
import { Order } from "../models/Order.js";
import { authenticateToken, authorizeRole, AuthRequest } from "../middleware/auth.js";

const router: Router = express.Router();

// Get all users
router.get(
  "/users",
  authenticateToken,
  authorizeRole(["admin"]),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const users = await User.find().select("-password");
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get user by ID
router.get(
  "/users/:userId",
  authenticateToken,
  authorizeRole(["admin"]),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const user = await User.findById(req.params.userId).select("-password");

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Update user role
router.put(
  "/users/:userId/role",
  authenticateToken,
  authorizeRole(["admin"]),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { role } = req.body;

      if (!["admin", "vendor", "user"].includes(role)) {
        res.status(400).json({ error: "Invalid role" });
        return;
      }

      const user = await User.findByIdAndUpdate(
        req.params.userId,
        { role },
        { new: true }
      ).select("-password");

      res.json({ message: "User role updated", user });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Delete user
router.delete(
  "/users/:userId",
  authenticateToken,
  authorizeRole(["admin"]),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const user = await User.findByIdAndDelete(req.params.userId);

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.json({ message: "User deleted" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get all vendors
router.get(
  "/vendors",
  authenticateToken,
  authorizeRole(["admin"]),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const vendors = await Vendor.find().populate("userId", "name email");
      res.json(vendors);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Verify vendor
router.put(
  "/vendors/:vendorId/verify",
  authenticateToken,
  authorizeRole(["admin"]),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const vendor = await Vendor.findByIdAndUpdate(
        req.params.vendorId,
        { isVerified: true },
        { new: true }
      );

      res.json({ message: "Vendor verified", vendor });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get all orders
router.get(
  "/orders",
  authenticateToken,
  authorizeRole(["admin"]),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const orders = await Order.find()
        .populate("userId", "name email")
        .populate("vendorId", "businessName")
        .populate("items.itemId");

      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get dashboard stats
router.get(
  "/stats",
  authenticateToken,
  authorizeRole(["admin"]),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const totalUsers = await User.countDocuments();
      const totalVendors = await Vendor.countDocuments();
      const totalOrders = await Order.countDocuments();
      const totalRevenue = await Order.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: "$totalAmount" },
          },
        },
      ]);

      res.json({
        totalUsers,
        totalVendors,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;
