import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import "@/models";
import Coupon from "@/models/Coupon";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { code, totalAmount } = body;

    if (!code || !totalAmount) {
      return NextResponse.json(
        { success: false, message: "Thiếu mã hoặc tổng tiền" },
        { status: 400 },
      );
    }

    const coupon = await Coupon.findOne({
      code: code.trim().toUpperCase(),
      isActive: true,
    });

    if (!coupon) {
      return NextResponse.json(
        { success: false, message: "Mã giảm giá không tồn tại" },
        { status: 404 },
      );
    }

    if (coupon.expiresAt.getTime() < Date.now()) {
      return NextResponse.json(
        { success: false, message: "Mã giảm giá đã hết hạn" },
        { status: 400 },
      );
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json(
        { success: false, message: "Mã giảm giá đã hết lượt sử dụng" },
        { status: 400 },
      );
    }

    if (totalAmount < coupon.minOrderValue) {
      return NextResponse.json(
        {
          success: false,
          message: `Đơn hàng tối thiểu phải từ ${coupon.minOrderValue.toLocaleString(
            "vi-VN",
          )}đ`,
        },
        { status: 400 },
      );
    }

    let discountAmount = 0;

    if (coupon.discountType === "PERCENT") {
      discountAmount = (totalAmount * coupon.discountValue) / 100;

      if (coupon.maxDiscount) {
        discountAmount = Math.min(discountAmount, coupon.maxDiscount);
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    return NextResponse.json({
      success: true,
      data: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
      },
    });
  } catch (error) {
    console.error("POST /api/coupons/validate error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Lỗi khi kiểm tra mã giảm giá",
      },
      { status: 500 },
    );
  }
}
