import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Chưa đăng nhập",
        },
        { status: 401 },
      );
    }

    const payload = verifyToken(token);

    const user = await User.findById(payload.userId).select("-password");

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Không tìm thấy user",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Me error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Token không hợp lệ hoặc đã hết hạn",
      },
      { status: 401 },
    );
  }
}
