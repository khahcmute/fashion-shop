import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import "@/models";
import Order from "@/models/Order";
import { getAuthUser } from "@/lib/getAuthUser";

export async function GET() {
  try {
    await connectDB();

    const authUser = await getAuthUser();

    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Chưa đăng nhập" },
        { status: 401 },
      );
    }

    const orders = await Order.find({ user: authUser.userId }).sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("GET /api/orders/my error:", error);

    return NextResponse.json(
      { success: false, message: "Lỗi khi lấy danh sách đơn hàng" },
      { status: 500 },
    );
  }
}
