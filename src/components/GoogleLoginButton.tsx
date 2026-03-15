"use client";

import { signIn } from "next-auth/react";

export default function GoogleLoginButton() {
  return (
    <button
      type="button"
      onClick={() => signIn("google", { callbackUrl: "/" })}
      className="w-full border py-3 rounded mt-3"
    >
      Đăng nhập bằng Google
    </button>
  );
}
