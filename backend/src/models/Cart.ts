import mongoose, { Schema, Document, Types } from "mongoose";

export interface CartDocument extends Document {
  userId: Types.ObjectId;
  items: Array<{
    itemId: Types.ObjectId;
    vendorId: Types.ObjectId;
    quantity: number;
    price: number;
  }>;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

const cartSchema = new Schema<CartDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [
      {
        itemId: {
          type: Schema.Types.ObjectId,
          ref: "Item",
          required: true,
        },
        vendorId: {
          type: Schema.Types.ObjectId,
          ref: "Vendor",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Recalculate total price before saving
cartSchema.pre("save", function (next) {
  this.totalPrice = this.items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
  next();
});

export const Cart = mongoose.model<CartDocument>("Cart", cartSchema);
