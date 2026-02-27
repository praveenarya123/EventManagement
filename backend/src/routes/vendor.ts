import express, { Request, Response, Router } from "express";
import { Vendor } from "../models/Vendor.js";
import { Item } from "../models/Item.js";
import { Order } from "../models/Order.js";
import { authenticateToken, authorizeRole, AuthRequest } from "../middleware/auth.js";

const router: Router = express.Router();

// Get all vendors (public)
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const vendors = await Vendor.find().populate("userId", "name email");
    res.json(vendors);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get vendor profile
router.get("/:vendorId", async (req: Request, res: Response): Promise<void> => {
  try {
    const vendor = await Vendor.findById(req.params.vendorId)
      .populate("userId", "name email phone")
      .populate("items");

    if (!vendor) {
      res.status(404).json({ error: "Vendor not found" });
      return;
    }

    res.json(vendor);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get my vendor profile (authenticated)
router.get(
  "/me/profile",
  authenticateToken,
  authorizeRole(["vendor"]),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const vendor = await Vendor.findOne({ userId: req.userId }).populate("items");

      if (!vendor) {
        res.status(404).json({ error: "Vendor profile not found" });
        return;
      }

      res.json(vendor);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Add item to vendor
router.post(
  "/items",
  authenticateToken,
  authorizeRole(["vendor"]),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { name, description, price, category, image, quantity } = req.body;

      // Find vendor by userId
      const vendor = await Vendor.findOne({ userId: req.userId });
      if (!vendor) {
        res.status(404).json({ error: "Vendor profile not found" });
        return;
      }

      const item = new Item({
        vendorId: vendor._id,
        name,
        description,
        price,
        category,
        image,
        quantity,
      });

      await item.save();

      // Add item to vendor's items array
      vendor.items.push(item._id);
      await vendor.save();

      res.status(201).json({ message: "Item added", item });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Update item
router.put(
  "/items/:itemId",
  authenticateToken,
  authorizeRole(["vendor"]),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const item = await Item.findById(req.params.itemId);

      if (!item) {
        res.status(404).json({ error: "Item not found" });
        return;
      }

      // Verify ownership
      const vendor = await Vendor.findById(item.vendorId);
      if (vendor?.userId.toString() !== req.userId) {
        res.status(403).json({ error: "Unauthorized" });
        return;
      }

      const updatedItem = await Item.findByIdAndUpdate(
        req.params.itemId,
        req.body,
        { new: true }
      );

      res.json({ message: "Item updated", item: updatedItem });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Delete item
router.delete(
  "/items/:itemId",
  authenticateToken,
  authorizeRole(["vendor"]),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const item = await Item.findById(req.params.itemId);

      if (!item) {
        res.status(404).json({ error: "Item not found" });
        return;
      }

      // Verify ownership
      const vendor = await Vendor.findById(item.vendorId);
      if (!vendor || vendor?.userId.toString() !== req.userId) {
        res.status(403).json({ error: "Unauthorized" });
        return;
      }

      await Item.findByIdAndDelete(req.params.itemId);
      vendor.items = vendor.items.filter((id) => id.toString() !== req.params.itemId);
      await vendor.save();

      res.json({ message: "Item deleted" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get vendor transactions
router.get(
  "/me/transactions",
  authenticateToken,
  authorizeRole(["vendor"]),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const vendor = await Vendor.findOne({ userId: req.userId });

      if (!vendor) {
        res.status(404).json({ error: "Vendor not found" });
        return;
      }

      const orders = await Order.find({ vendorId: vendor._id })
        .populate("userId", "name email")
        .populate("items.itemId");

      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;
