import mongoose, { Schema, model, models } from "mongoose";

export interface ICategory {
  name: string;
  slug: string;
}

const CategorySchema = new Schema<ICategory>(
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
  },
  { timestamps: true },
);

const Category =
  models.Category || model<ICategory>("Category", CategorySchema);

export default Category;
