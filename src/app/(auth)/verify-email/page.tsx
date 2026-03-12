"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const res = await fetch("/api/auth/verify-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    });

    const result = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(result.message || "Xác thực thất bại");
      return;
    }

    setMessage(result.message || "Xác thực thành công");

    setTimeout(() => {
      router.push("/login");
    }, 1200);
  }

  async function handleResend() {
    setLoading(true);
    setError("");
    setMessage("");

    const res = await fetch("/api/auth/resend-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const result = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(result.message || "Gửi lại OTP thất bại");
      return;
    }

    setMessage(result.message || "Đã gửi lại OTP");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-neutral-100 via-white to-neutral-200">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="hidden lg:flex flex-col justify-between bg-black text-white p-12">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-white/70">
              Fashion Shop
            </p>
            <h1 className="mt-6 text-5xl font-bold leading-tight">
              Xác thực
              <br />
              email của bạn
            </h1>
            <p className="mt-6 max-w-md text-lg text-white/70">
              Nhập mã OTP đã được gửi đến email để hoàn tất đăng ký và kích hoạt
              tài khoản.
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
              <p className="font-semibold">Bảo mật tài khoản</p>
              <p className="mt-1 text-sm text-white/70">
                Xác minh email giúp bảo vệ tài khoản của bạn tốt hơn.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
              <p className="font-semibold">Kích hoạt nhanh</p>
              <p className="mt-1 text-sm text-white/70">
                Chỉ cần nhập đúng mã OTP để hoàn tất trong vài giây.
              </p>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center lg:hidden">
              <p className="text-sm uppercase tracking-[0.35em] text-neutral-500">
                Fashion Shop
              </p>
              <h1 className="mt-3 text-3xl font-bold text-neutral-900">
                Xác thực email
              </h1>
              <p className="mt-2 text-sm text-neutral-600">
                Nhập mã OTP để kích hoạt tài khoản
              </p>
            </div>

            <div className="rounded-3xl border border-neutral-200 bg-white/85 p-8 shadow-2xl backdrop-blur">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-neutral-900">
                  Nhập mã OTP
                </h2>
                <p className="mt-2 text-sm text-neutral-500">
                  Chúng tôi đã gửi mã xác thực đến email của bạn
                </p>
              </div>

              <form onSubmit={handleVerify} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
                    placeholder="Nhập email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700">
                    Mã OTP
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-center text-lg tracking-[0.45em] outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    maxLength={6}
                  />
                  <p className="mt-2 text-xs text-neutral-500">
                    Vui lòng nhập mã OTP gồm 6 chữ số.
                  </p>
                </div>

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                {message && (
                  <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full rounded-xl bg-black py-3.5 font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={loading}
                >
                  {loading ? "Đang xử lý..." : "Xác thực OTP"}
                </button>

                <button
                  type="button"
                  onClick={handleResend}
                  className="w-full rounded-xl border border-neutral-300 bg-white py-3.5 font-semibold text-neutral-800 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={loading}
                >
                  Gửi lại OTP
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-neutral-600">
                Quay lại{" "}
                <Link
                  href="/login"
                  className="font-semibold text-black underline underline-offset-4"
                >
                  đăng nhập
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
