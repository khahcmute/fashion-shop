import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongoose";
import "@/models";
import CartItem from "@/models/CartItem";
import Product from "@/models/Product";
import Order from "@/models/Order";
import { getAuthUser } from "@/lib/getAuthUser";
import Coupon from "@/models/Coupon";

export async function POST(req: Request) {
  await connectDB();

  const authUser = await getAuthUser();

  if (!authUser) {
    return NextResponse.json(
      { success: false, message: "Chưa đăng nhập" },
      { status: 401 },
    );
  }

  const body = await req.json();
  const { fullName, phone, address, city, district, couponCode } = body;

  if (!fullName || !phone || !address || !city || !district) {
    return NextResponse.json(
      { success: false, message: "Vui lòng nhập đầy đủ thông tin giao hàng" },
      { status: 400 },
    );
  }

  const session = await mongoose.startSession();

  try {
    let createdOrder: any = null;

    await session.withTransaction(async () => {
      const cartItems = await CartItem.find({ user: authUser.userId })
        .populate("product")
        .session(session);

      if (!cartItems.length) {
        throw new Error("Giỏ hàng đang trống");
      }

      const orderItems = [];
      let totalAmount = 0;

      for (const item of cartItems) {
        const productDoc: any = await Product.findById(
          item.product._id,
        ).session(session);

        if (!productDoc || !productDoc.isActive) {
          throw new Error(`Sản phẩm không tồn tại hoặc đã ngừng bán`);
        }

        const variant = productDoc.variants.find(
          (v: { color: string; size: string; stock: number }) =>
            v.color === item.color && v.size === item.size,
        );

        if (!variant) {
          throw new Error(
            `Biến thể ${item.color} / ${item.size} không tồn tại`,
          );
        }

        if (variant.stock < item.quantity) {
          throw new Error(`Tồn kho không đủ cho ${productDoc.name}`);
        }

        variant.stock -= item.quantity;
        await productDoc.save({ session });

        orderItems.push({
          product: productDoc._id,
          name: productDoc.name,
          image: productDoc.images?.[0] || "",
          color: item.color,
          size: item.size,
          quantity: item.quantity,
          price: item.priceAtAddedTime,
        });

        totalAmount += item.priceAtAddedTime * item.quantity;
      }

      let discountAmount = 0;
      let appliedCouponCode = "";

      if (couponCode) {
        const coupon = await Coupon.findOne({
          code: couponCode.trim().toUpperCase(),
          isActive: true,
        }).session(session);

        if (!coupon) {
          throw new Error("Mã giảm giá không tồn tại");
        }

        if (coupon.expiresAt.getTime() < Date.now()) {
          throw new Error("Mã giảm giá đã hết hạn");
        }

        if (coupon.usedCount >= coupon.usageLimit) {
          throw new Error("Mã giảm giá đã hết lượt sử dụng");
        }

        if (totalAmount < coupon.minOrderValue) {
          throw new Error("Đơn hàng chưa đạt giá trị tối thiểu để áp mã");
        }

        if (coupon.discountType === "PERCENT") {
          discountAmount = (totalAmount * coupon.discountValue) / 100;

          if (coupon.maxDiscount) {
            discountAmount = Math.min(discountAmount, coupon.maxDiscount);
          }
        } else {
          discountAmount = coupon.discountValue;
        }

        appliedCouponCode = coupon.code;
        coupon.usedCount += 1;
        await coupon.save({ session });
      }

      const finalAmount = Math.max(totalAmount - discountAmount, 0);

      const orders = await Order.create(
        [
          {
            user: authUser.userId,
            items: orderItems,
            shippingAddress: {
              fullName,
              phone,
              address,
              city,
              district,
            },
            totalAmount,
            couponCode: appliedCouponCode,
            discountAmount,
            finalAmount,
            status: "PENDING",
          },
        ],
        { session },
      );

      createdOrder = orders[0];

      await CartItem.deleteMany({ user: authUser.userId }).session(session);
    });

    return NextResponse.json(
      {
        success: true,
        message: "Đặt hàng thành công",
        data: createdOrder,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/orders error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Lỗi khi tạo đơn hàng",
      },
      { status: 500 },
    );
  } finally {
    await session.endSession();
  }
}
