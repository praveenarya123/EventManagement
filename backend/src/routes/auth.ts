import express, { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { Vendor } from "../models/Vendor.js";

const router: Router = express.Router();

const getSecret = (): string => {
  return process.env.JWT_SECRET || "secret";
};

const getExpire = (): string => {
  return process.env.JWT_EXPIRE || "7d";
};

// Register
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role, businessName } = req.body;

    // Validate input
    if (!name || !email || !password) {
      res.status(400).json({ error: "Please provide all required fields" });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: "Email already registered" });
      return;
    }


    // Validate role
    const allowedRoles = ["user", "vendor", "admin"];
    let userRole = "user";
    if (role && allowedRoles.includes(role)) {
      userRole = role;
    }

    // Create user
    const user = new User({
      name,
      email,
      password,
      role: userRole,
    });

    await user.save();

    // If vendor, create vendor profile
    if (userRole === "vendor") {
      if (!businessName) {
        await user.deleteOne();
        res.status(400).json({ error: "Business name is required for vendor registration" });
        return;
      }
      const vendor = new Vendor({
        userId: user._id,
        businessName,
      });
      await vendor.save();
    }

    // Generate token
    // @ts-ignore
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      getSecret(),
      { expiresIn: getExpire() }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({ error: "Email and password required" });
      return;
    }

    // Find user and select password field
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    // Compare password
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    // Generate token
    // @ts-ignore
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      getSecret(),
      { expiresIn: getExpire() }
    ) as any;

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
