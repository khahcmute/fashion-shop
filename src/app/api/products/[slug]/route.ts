import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import "@/models";
import Product from "@/models/Product";
import Category from "@/models/Category";

type Params = {
  params: Promise<{ slug: string }>;
};

export async function GET(_: Request, { params }: Params) {
  try {
    await connectDB();
    void Category;
    const { slug } = await params;

    const product = await Product.findOne({
      slug,
      isActive: true,
    }).populate("category");

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Không tìm thấy sản phẩm",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("GET /api/products/[slug] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Lỗi khi lấy chi tiết sản phẩm",
      },
      { status: 500 },
    );
  }
}
