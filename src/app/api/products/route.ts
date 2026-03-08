import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Product from "@/models/Product";
import Category from "@/models/Category";

export async function GET() {
  try {
    await connectDB();
    void Category;
    const products = await Product.find({ isActive: true })
      .populate("category")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("GET /api/products error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Lỗi khi lấy danh sách sản phẩm",
      },
      { status: 500 },
    );
  }
}
