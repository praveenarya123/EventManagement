import mongoose, { Schema, Document, Types } from "mongoose";

export interface VendorDocument extends Document {
  userId: Types.ObjectId;
  businessName: string;
  businessDescription: string;
  category: string;
  rating: number;
  totalReviews: number;
  isVerified: boolean;
  items: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const vendorSchema = new Schema<VendorDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    businessName: {
      type: String,
      required: true,
    },
    businessDescription: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      default: "General",
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    items: [
      {
        type: Schema.Types.ObjectId,
        ref: "Item",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Vendor = mongoose.model<VendorDocument>("Vendor", vendorSchema);
