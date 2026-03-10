import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import "@/models";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { requireAdmin } from "@/lib/requireAdmin";
import { slugify } from "@/lib/slugify";

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

    const products = await Product.find()
      .populate("category")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("GET /api/admin/products error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi lấy sản phẩm" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const auth = await requireAdmin();
    if (!auth.ok) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status },
      );
    }

    const body = await req.json();
    const {
      name,
      description,
      price,
      salePrice,
      category,
      images,
      variants,
      isFeatured,
      isActive,
    } = body;

    if (
      !name ||
      !price ||
      !category ||
      !Array.isArray(variants) ||
      !variants.length
    ) {
      return NextResponse.json(
        { success: false, message: "Thiếu dữ liệu sản phẩm" },
        { status: 400 },
      );
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return NextResponse.json(
        { success: false, message: "Danh mục không tồn tại" },
        { status: 400 },
      );
    }

    const slug = slugify(name);
    const existed = await Product.findOne({ slug });

    if (existed) {
      return NextResponse.json(
        { success: false, message: "Slug sản phẩm đã tồn tại" },
        { status: 400 },
      );
    }

    const product = await Product.create({
      name: name.trim(),
      slug,
      description: description?.trim() || "",
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : undefined,
      category,
      images: Array.isArray(images) ? images : [],
      variants,
      isFeatured: Boolean(isFeatured),
      isActive: isActive !== false,
    });

    const populated = await product.populate("category");

    return NextResponse.json(
      {
        success: true,
        message: "Tạo sản phẩm thành công",
        data: populated,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/admin/products error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi tạo sản phẩm" },
      { status: 500 },
    );
  }
}
