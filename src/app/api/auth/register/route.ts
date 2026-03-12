import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";
import { registerSchema } from "@/schemas/auth.schema";
import { generateOtp } from "@/lib/otp";
import { sendEmailOtp } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: parsed.error.issues[0]?.message || "Dữ liệu không hợp lệ",
        },
        { status: 400 },
      );
    }

    const { name, email, password } = parsed.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email đã tồn tại" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp(6);
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "USER",
      isEmailVerified: false,
      emailOtp: otp,
      emailOtpExpires: otpExpires,
    });

    try {
      await sendEmailOtp({
        to: user.email,
        name: user.name,
        otp,
      });
    } catch (mailError) {
      console.error("Send OTP email error:", mailError);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Đăng ký thành công. Vui lòng kiểm tra email để lấy mã OTP.",
        data: {
          email: user.email,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Đăng ký thất bại",
      },
      { status: 500 },
    );
  }
}
