import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import "@/models";
import Order from "@/models/Order";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET() {
  try {
    await connectDB();

    const auth = await requireAdmin();
    if (!auth.ok) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status },
      );
    }

    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("GET /api/admin/orders error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi lấy đơn hàng" },
      { status: 500 },
    );
  }
}
