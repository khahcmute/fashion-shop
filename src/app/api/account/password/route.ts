import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongoose";
import "@/models";
import User from "@/models/User";
import { getAuthUser } from "@/lib/getAuthUser";

export async function PATCH(req: Request) {
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
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: "Thiếu dữ liệu đổi mật khẩu" },
        { status: 400 },
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: "Mật khẩu mới phải ít nhất 6 ký tự" },
        { status: 400 },
      );
    }

    const user = await User.findById(authUser.userId);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy người dùng" },
        { status: 404 },
      );
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Mật khẩu hiện tại không đúng" },
        { status: 400 },
      );
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Đổi mật khẩu thành công",
    });
  } catch (error) {
    console.error("PATCH /api/account/password error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi đổi mật khẩu" },
      { status: 500 },
    );
  }
}
