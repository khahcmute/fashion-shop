import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import "@/models";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectDB();

    const products = await Product.find({
      isActive: true,
      salePrice: { $exists: true, $gt: 0 },
    })
      .populate("category")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("GET /api/products/sale error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Lỗi khi lấy sản phẩm giảm giá",
      },
      { status: 500 },
    );
  }
}
