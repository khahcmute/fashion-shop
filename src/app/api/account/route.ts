import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import "@/models";
import User from "@/models/User";
import { getAuthUser } from "@/lib/getAuthUser";
import { sendProfileUpdatedEmail } from "@/lib/mail";

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

    const user = await User.findById(authUser.userId).select("-password");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy người dùng" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("GET /api/account error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi lấy thông tin tài khoản" },
      { status: 500 },
    );
  }
}

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
    const { name, phone, avatar, address, city, district } = body;

    const updated = await User.findByIdAndUpdate(
      authUser.userId,
      {
        name: name?.trim() || "",
        phone: phone?.trim() || "",
        avatar: avatar?.trim() || "",
        address: address?.trim() || "",
        city: city?.trim() || "",
        district: district?.trim() || "",
      },
      { new: true },
    ).select("-password");

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy người dùng" },
        { status: 404 },
      );
    }

    try {
      await sendProfileUpdatedEmail({
        to: updated.email,
        name: updated.name,
      });
    } catch (mailError) {
      console.error("Send profile updated email error:", mailError);
    }

    return NextResponse.json({
      success: true,
      message: "Cập nhật tài khoản thành công",
      data: updated,
    });
  } catch (error) {
    console.error("PATCH /api/account error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi cập nhật tài khoản" },
      { status: 500 },
    );
  }
}
