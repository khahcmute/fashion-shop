import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Product from "@/models/Product";
import Category from "@/models/Category";

export async function GET() {
  try {
    await connectDB();
    void Category;
    const products = await Product.find().populate("category");

    return NextResponse.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Lỗi khi lấy products",
      },
      { status: 500 },
    );
  }
}

export async function POST() {
  try {
    await connectDB();

    const product = await Product.create({
      name: "Áo thun basic",
      price: 199000,
      description: "Áo thun form rộng",
    });

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Tạo sản phẩm thất bại",
      },
      { status: 500 },
    );
  }
}
