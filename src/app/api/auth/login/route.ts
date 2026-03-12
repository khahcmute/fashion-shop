import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongoose";
import User from "@/models/User";
import { loginSchema } from "@/schemas/auth.schema";
import { signToken } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: parsed.error.issues[0]?.message || "Dữ liệu không hợp lệ",
        },
        { status: 400 },
      );
    }

    const { email, password } = parsed.data;

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Email hoặc mật khẩu không đúng",
        },
        { status: 401 },
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        {
          success: false,
          message: "Email hoặc mật khẩu không đúng",
        },
        { status: 401 },
      );
    }

    // CHẶN LOGIN NẾU CHƯA VERIFY EMAIL
    if (!user.isEmailVerified) {
      return NextResponse.json(
        {
          success: false,
          message: "Tài khoản chưa được kích hoạt. Vui lòng xác thực email.",
          needVerify: true,
          email: user.email,
        },
        { status: 403 },
      );
    }

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const res = NextResponse.json({
      success: true,
      message: "Đăng nhập thành công",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Đăng nhập thất bại",
      },
      { status: 500 },
    );
  }
}
