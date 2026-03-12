import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import "@/models";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: "Thiếu email hoặc OTP" },
        { status: 400 },
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy người dùng" },
        { status: 404 },
      );
    }

    if (user.isEmailVerified) {
      return NextResponse.json({
        success: true,
        message: "Email đã được xác thực trước đó",
      });
    }

    if (!user.emailOtp || !user.emailOtpExpires) {
      return NextResponse.json(
        { success: false, message: "Không có OTP hợp lệ" },
        { status: 400 },
      );
    }

    if (user.emailOtp !== otp) {
      return NextResponse.json(
        { success: false, message: "OTP không đúng" },
        { status: 400 },
      );
    }

    if (new Date(user.emailOtpExpires).getTime() < Date.now()) {
      return NextResponse.json(
        { success: false, message: "OTP đã hết hạn" },
        { status: 400 },
      );
    }

    user.isEmailVerified = true;
    user.emailOtp = "";
    user.emailOtpExpires = null;
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Xác thực email thành công",
    });
  } catch (error) {
    console.error("Verify email OTP error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi xác thực OTP" },
      { status: 500 },
    );
  }
}
