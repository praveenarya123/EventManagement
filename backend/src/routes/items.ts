import express, { Request, Response, Router } from "express";
import { Item } from "../models/Item.js";

const router: Router = express.Router();

// Get all items (public)
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search, limit = 20, page = 1 } = req.query;

    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 20;
    const skip = (pageNum - 1) * limitNum;

    let query: any = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const items = await Item.find(query)
      .populate("vendorId", "businessName")
      .limit(limitNum)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Item.countDocuments(query);

    res.json({
      items,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get items by category
router.get("/category/:category", async (req: Request, res: Response): Promise<void> => {
  try {
    const items = await Item.find({ category: req.params.category }).populate(
      "vendorId",
      "businessName"
    );

    res.json(items);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get single item
router.get("/:itemId", async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await Item.findById(req.params.itemId).populate(
      "vendorId",
      "businessName businessDescription"
    );

    if (!item) {
      res.status(404).json({ error: "Item not found" });
      return;
    }

    res.json(item);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
