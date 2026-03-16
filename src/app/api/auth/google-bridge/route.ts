import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { signToken } from "@/lib/jwt";
import { connectDB } from "@/lib/mongoose";
import "@/models";
import User from "@/models/User";

export async function POST() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Không tìm thấy phiên đăng nhập Google" },
        { status: 401 },
      );
    }

    await connectDB();

    let user = await User.findOne({ email: session.user.email });

    if (!user) {
      user = await User.create({
        name: session.user.name || "Google User",
        email: session.user.email,
        password: "",
        role: "USER",
        avatar: session.user.image || "",
        isEmailVerified: true,
        emailOtp: "",
        emailOtpExpires: null,
      });
    }

    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const res = NextResponse.json({
      success: true,
      message: "Đồng bộ đăng nhập Google thành công",
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
    console.error("POST /api/auth/google-bridge error:", error);

    return NextResponse.json(
      { success: false, message: "Lỗi khi đồng bộ phiên Google" },
      { status: 500 },
    );
  }
}
