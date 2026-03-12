import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import "@/models";
import User from "@/models/User";
import { generateOtp } from "@/lib/otp";
import { sendEmailOtp } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Thiếu email" },
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
      return NextResponse.json(
        { success: false, message: "Email đã được xác thực" },
        { status: 400 },
      );
    }

    const otp = generateOtp(6);
    user.emailOtp = otp;
    user.emailOtpExpires = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    await sendEmailOtp({
      to: user.email,
      name: user.name,
      otp,
    });

    return NextResponse.json({
      success: true,
      message: "Đã gửi lại OTP",
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi khi gửi lại OTP" },
      { status: 500 },
    );
  }
}
