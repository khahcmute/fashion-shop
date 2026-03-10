import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongoose";
import "@/models";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { requireAdmin } from "@/lib/requireAdmin";
import { slugify } from "@/lib/slugify";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, { params }: Params) {
  try {
    await connectDB();

    const auth = await requireAdmin();
    if (!auth.ok) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status },
      );
    }

    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: "ID không hợp lệ" },
        { status: 400 },
      );
    }

    const product = await Product.findById(id).populate("category");

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy sản phẩm" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("GET /api/admin/products/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi lấy chi tiết sản phẩm" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request, { params }: Params) {
  try {
    await connectDB();

    const auth = await requireAdmin();
    if (!auth.ok) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status },
      );
    }

    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: "ID không hợp lệ" },
        { status: 400 },
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

    const existed = await Product.findOne({
      _id: { $ne: id },
      slug,
    });

    if (existed) {
      return NextResponse.json(
        { success: false, message: "Slug sản phẩm đã tồn tại" },
        { status: 400 },
      );
    }

    const updated = await Product.findByIdAndUpdate(
      id,
      {
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
      },
      { new: true },
    ).populate("category");

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy sản phẩm" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Cập nhật sản phẩm thành công",
      data: updated,
    });
  } catch (error) {
    console.error("PATCH /api/admin/products/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi cập nhật sản phẩm" },
      { status: 500 },
    );
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    await connectDB();

    const auth = await requireAdmin();
    if (!auth.ok) {
      return NextResponse.json(
        { success: false, message: auth.message },
        { status: auth.status },
      );
    }

    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: "ID không hợp lệ" },
        { status: 400 },
      );
    }

    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy sản phẩm" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Xóa sản phẩm thành công",
    });
  } catch (error) {
    console.error("DELETE /api/admin/products/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi xóa sản phẩm" },
      { status: 500 },
    );
  }
}
