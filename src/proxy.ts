import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

type TokenPayload = {
  userId: string;
  email: string;
  role: "USER" | "ADMIN";
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthRoute = pathname === "/login" || pathname === "/register";

  // Chưa đăng nhập
  if (!token) {
    if (isAdminRoute) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  // Có token
  try {
    const payload = jwt.verify(token, JWT_SECRET) as TokenPayload;

    // Đã đăng nhập mà vào login/register -> đá về trang phù hợp
    if (isAuthRoute) {
      const redirectTo = payload.role === "ADMIN" ? "/admin" : "/";
      return NextResponse.redirect(new URL(redirectTo, request.url));
    }

    // Không phải admin mà cố vào admin
    if (isAdminRoute && payload.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch {
    // Token hỏng/hết hạn
    if (isAdminRoute) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/admin/:path*", "/login", "/register"],
};
