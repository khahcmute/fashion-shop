import mongoose, { Schema, model, models, Types } from "mongoose";

export interface IVariant {
  color: string;
  size: string;
  stock: number;
  sku: string;
}

export interface IProduct {
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number;
  category: Types.ObjectId;
  images: string[];
  variants: IVariant[];
  isFeatured: boolean;
  isActive: boolean;
}

const VariantSchema = new Schema<IVariant>(
  {
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
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    sku: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false },
);

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    salePrice: {
      type: Number,
      min: 0,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    images: [
      {
        type: String,
        trim: true,
      },
    ],
    variants: [VariantSchema],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Product = models.Product || model<IProduct>("Product", ProductSchema);

export default Product;
