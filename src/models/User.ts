import { Schema, model, models } from "mongoose";

export type UserRole = "USER" | "ADMIN";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  address?: string;
  city?: string;
  district?: string;
  isEmailVerified: boolean;
  emailOtp: string;
  emailOtpExpires?: Date | null;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    phone: { type: String, trim: true, default: "" },
    avatar: { type: String, trim: true, default: "" },
    address: { type: String, trim: true, default: "" },
    city: { type: String, trim: true, default: "" },
    district: { type: String, trim: true, default: "" },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailOtp: {
      type: String,
      default: "",
    },
    emailOtpExpires: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

const User = models.User || model<IUser>("User", UserSchema);
export default User;
