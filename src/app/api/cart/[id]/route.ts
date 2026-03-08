import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import "@/models";
import CartItem from "@/models/CartItem";
import Product from "@/models/Product";
import { getAuthUser } from "@/lib/getAuthUser";

type Params = {
  params: Promise<{ id: string }>;
};

export async function PATCH(req: Request, { params }: Params) {
  try {
    await connectDB();

    const authUser = await getAuthUser();

    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Chưa đăng nhập" },
        { status: 401 },
      );
    }

    const { id } = await params;
    const body = await req.json();
    const { quantity } = body;

    if (!quantity || quantity < 1) {
      return NextResponse.json(
        { success: false, message: "Số lượng không hợp lệ" },
        { status: 400 },
      );
    }

    const item = await CartItem.findOne({
      _id: id,
      user: authUser.userId,
    }).populate("product");

    if (!item) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy cart item" },
        { status: 404 },
      );
    }

    const product = await Product.findById(item.product);

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Sản phẩm không tồn tại" },
        { status: 404 },
      );
    }

    const variant = product.variants.find(
      (v: { color: string; size: string; stock: number }) =>
        v.color === item.color && v.size === item.size,
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

    item.quantity = quantity;
    await item.save();

    return NextResponse.json({
      success: true,
      message: "Cập nhật giỏ hàng thành công",
      data: item,
    });
  } catch (error) {
    console.error("PATCH /api/cart/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi cập nhật giỏ hàng" },
      { status: 500 },
    );
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    await connectDB();

    const authUser = await getAuthUser();

    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "Chưa đăng nhập" },
        { status: 401 },
      );
    }

    const { id } = await params;

    const deleted = await CartItem.findOneAndDelete({
      _id: id,
      user: authUser.userId,
    });

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy cart item" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Xóa sản phẩm khỏi giỏ hàng thành công",
    });
  } catch (error) {
    console.error("DELETE /api/cart/[id] error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi xóa khỏi giỏ hàng" },
      { status: 500 },
    );
  }
}
