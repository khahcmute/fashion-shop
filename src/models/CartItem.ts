import { Schema, model, models, Types } from "mongoose";

export interface ICartItem {
  user: Types.ObjectId;
  product: Types.ObjectId;
  color: string;
  size: string;
  quantity: number;
  priceAtAddedTime: number;
}

const CartItemSchema = new Schema<ICartItem>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    color: {
      type: String,
      required: true,
      trim: true,
    },
    size: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    priceAtAddedTime: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true },
);

CartItemSchema.index({ user: 1 });
CartItemSchema.index(
  { user: 1, product: 1, color: 1, size: 1 },
  { unique: true },
);

const CartItem =
  models.CartItem || model<ICartItem>("CartItem", CartItemSchema);

export default CartItem;
