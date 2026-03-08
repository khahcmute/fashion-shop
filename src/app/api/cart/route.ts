import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import "@/models";
import CartItem from "@/models/CartItem";
import Product from "@/models/Product";
import { getAuthUser } from "@/lib/getAuthUser";

export async function GET() {
  try {
    await connectDB();

    const authUser = await getAuthUser();

    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Chưa đăng nhập" },
        { status: 401 },
      );
    }

    const items = await CartItem.find({ user: authUser.userId })
      .populate("product")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error("GET /api/cart error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi lấy giỏ hàng" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const authUser = await getAuthUser();

    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Chưa đăng nhập" },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { productId, color, size, quantity } = body;

    if (!productId || !color || !size || !quantity) {
      return NextResponse.json(
        { success: false, message: "Thiếu dữ liệu thêm vào giỏ" },
        { status: 400 },
      );
    }

    const product = await Product.findById(productId);

    if (!product || !product.isActive) {
      return NextResponse.json(
        { success: false, message: "Sản phẩm không tồn tại" },
        { status: 404 },
      );
    }

    const variant = product.variants.find(
      (v: { color: string; size: string; stock: number }) =>
        v.color === color && v.size === size,
    );

    if (!variant) {
      return NextResponse.json(
        { success: false, message: "Biến thể không tồn tại" },
        { status: 400 },
      );
    }

    if (quantity > variant.stock) {
      return NextResponse.json(
        { success: false, message: "Số lượng vượt quá tồn kho" },
        { status: 400 },
      );
    }

    const existingItem = await CartItem.findOne({
      user: authUser.userId,
      product: productId,
      color,
      size,
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;

      if (newQuantity > variant.stock) {
        return NextResponse.json(
          { success: false, message: "Số lượng vượt quá tồn kho" },
          { status: 400 },
        );
      }

      existingItem.quantity = newQuantity;
      await existingItem.save();

      const populatedItem = await existingItem.populate("product");

      return NextResponse.json({
        success: true,
        message: "Đã cập nhật giỏ hàng",
        data: populatedItem,
      });
    }

    const item = await CartItem.create({
      user: authUser.userId,
      product: productId,
      color,
      size,
      quantity,
      priceAtAddedTime: product.salePrice || product.price,
    });

    const populatedItem = await item.populate("product");

    return NextResponse.json(
      {
        success: true,
        message: "Đã thêm vào giỏ hàng",
        data: populatedItem,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/cart error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi thêm vào giỏ hàng" },
      { status: 500 },
    );
  }
}
