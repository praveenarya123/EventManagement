import express, { Request, Response, Router } from "express";
import { Cart } from "../models/Cart.js";
import { Item } from "../models/Item.js";
import { Order } from "../models/Order.js";
import { authenticateToken, AuthRequest } from "../middleware/auth.js";

const router: Router = express.Router();

// Add item to cart
router.post(
  "/add",
  authenticateToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { itemId, vendorId, quantity } = req.body;

      // Find or create cart
      let cart = await Cart.findOne({ userId: req.userId });

      if (!cart) {
        cart = new Cart({
          userId: req.userId,
          items: [],
          totalPrice: 0,
        });
      }

      // Get item details
      const item = await Item.findById(itemId);
      if (!item) {
        res.status(404).json({ error: "Item not found" });
        return;
      }

      // Check if item already in cart
      const existingItemIndex = cart.items.findIndex(
        (i) => i.itemId.toString() === itemId
      );

      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        cart.items.push({
          itemId,
          vendorId,
          quantity,
          price: item.price,
        });
      }

      await cart.save();

      res.json({ message: "Item added to cart", cart });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Remove item from cart
router.post(
  "/remove/:itemId",
  authenticateToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const cart = await Cart.findOneAndUpdate(
        { userId: req.userId },
        { $pull: { items: { itemId: req.params.itemId } } },
        { new: true }
      );

      res.json({ message: "Item removed from cart", cart });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Update cart item quantity
router.put(
  "/:itemId",
  authenticateToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { quantity } = req.body;

      if (quantity < 1) {
        res.status(400).json({ error: "Quantity must be at least 1" });
        return;
      }

      const cart = await Cart.findOne({ userId: req.userId });

      if (!cart) {
        res.status(404).json({ error: "Cart not found" });
        return;
      }

      const item = cart.items.find((i) => i.itemId.toString() === req.params.itemId);

      if (!item) {
        res.status(404).json({ error: "Item not in cart" });
        return;
      }

      item.quantity = quantity;
      await cart.save();

      res.json({ message: "Cart updated", cart });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Clear cart
router.delete(
  "/",
  authenticateToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const cart = await Cart.findOneAndUpdate(
        { userId: req.userId },
        { items: [], totalPrice: 0 },
        { new: true }
      );

      res.json({ message: "Cart cleared", cart });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Checkout (create order from cart)
router.post(
  "/checkout",
  authenticateToken,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { deliveryAddress, paymentMethod } = req.body;

      if (!deliveryAddress) {
        res.status(400).json({ error: "Delivery address required" });
        return;
      }

      const cart = await Cart.findOne({ userId: req.userId });

      if (!cart || cart.items.length === 0) {
        res.status(400).json({ error: "Cart is empty" });
        return;
      }

      // Group items by vendor and create orders
      const ordersByVendor: {
        [key: string]: {
          vendorId: any;
          items: any[];
          totalAmount: number;
        };
      } = {};

      cart.items.forEach((item) => {
        const vendorId = item.vendorId.toString();

        if (!ordersByVendor[vendorId]) {
          ordersByVendor[vendorId] = {
            vendorId: item.vendorId,
            items: [],
            totalAmount: 0,
          };
        }

        ordersByVendor[vendorId].items.push({
          itemId: item.itemId,
          quantity: item.quantity,
          price: item.price,
        });

        ordersByVendor[vendorId].totalAmount += item.price * item.quantity;
      });

      // Create orders
      const orders = [];

      for (const vendorId in ordersByVendor) {
        const orderData = ordersByVendor[vendorId];

        const order = new Order({
          userId: req.userId,
          vendorId: orderData.vendorId,
          items: orderData.items,
          totalAmount: orderData.totalAmount,
          deliveryAddress,
          paymentMethod: paymentMethod || "card",
          status: "pending",
        });

        await order.save();
        orders.push(order);
      }

      // Clear cart
      await Cart.findOneAndUpdate(
        { userId: req.userId },
        { items: [], totalPrice: 0 }
      );

      res.status(201).json({
        message: "Orders created successfully",
        orders: orders,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;
