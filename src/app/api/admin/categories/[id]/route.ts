import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongoose";
import "@/models";
import Category from "@/models/Category";
import Product from "@/models/Product";
import { requireAdmin } from "@/lib/requireAdmin";
import { slugify } from "@/lib/slugify";

type Params = {
  params: Promise<{ id: string }>;
};

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
    const name = body.name?.trim();

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Tên danh mục là bắt buộc" },
        { status: 400 },
      );
    }

    const slug = slugify(name);

    const existed = await Category.findOne({
      _id: { $ne: id },
      $or: [{ name }, { slug }],
    });

    if (existed) {
      return NextResponse.json(
        { success: false, message: "Tên danh mục đã tồn tại" },
        { status: 400 },
      );
    }

    const updated = await Category.findByIdAndUpdate(
      id,
      { name, slug },
      { new: true },
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy danh mục" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Cập nhật danh mục thành công",
      data: updated,
    });
  } catch (error) {
    console.error("PATCH /api/admin/categories/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi cập nhật danh mục" },
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

    const productUsing = await Product.findOne({ category: id });

    if (productUsing) {
      return NextResponse.json(
        {
          success: false,
          message: "Không thể xóa vì vẫn còn sản phẩm thuộc danh mục này",
        },
        { status: 400 },
      );
    }

    const deleted = await Category.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy danh mục" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Xóa danh mục thành công",
    });
  } catch (error) {
    console.error("DELETE /api/admin/categories/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi xóa danh mục" },
      { status: 500 },
    );
  }
}
