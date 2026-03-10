import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import "@/models";
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

    const categories = await Category.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("GET /api/admin/categories error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi lấy danh mục" },
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
    const name = body.name?.trim();

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Tên danh mục là bắt buộc" },
        { status: 400 },
      );
    }

    const slug = slugify(name);

    const existed = await Category.findOne({
      $or: [{ name }, { slug }],
    });

    if (existed) {
      return NextResponse.json(
        { success: false, message: "Danh mục đã tồn tại" },
        { status: 400 },
      );
    }

    const category = await Category.create({ name, slug });

    return NextResponse.json(
      {
        success: true,
        message: "Tạo danh mục thành công",
        data: category,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/admin/categories error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi tạo danh mục" },
      { status: 500 },
    );
  }
}
