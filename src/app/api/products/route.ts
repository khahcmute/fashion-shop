import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import "@/models";
import Product from "@/models/Product";
import Category from "@/models/Category";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const categorySlug = searchParams.get("category") || "";

    const query: Record<string, any> = {
      isActive: true,
    };

    if (search.trim()) {
      query.name = {
        $regex: search.trim(),
        $options: "i",
      };
    }

    if (categorySlug) {
      const category = await Category.findOne({ slug: categorySlug });

      if (!category) {
        return NextResponse.json({
          success: true,
          count: 0,
          data: [],
        });
      }

      query.category = category._id;
    }

    const products = await Product.find(query)
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
