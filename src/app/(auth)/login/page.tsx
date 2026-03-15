"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearAuthMessages, loginUser } from "@/features/auth/authSlice";
import { useRouter } from "next/navigation";
import GoogleLoginButton from "@/components/GoogleLoginButton";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { loading, error, needVerify, verifyEmail } = useAppSelector(
    (state) => state.auth,
  );

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (needVerify && verifyEmail) {
      router.push(`/verify-email?email=${encodeURIComponent(verifyEmail)}`);
    }
  }, [needVerify, verifyEmail, router]);

  useEffect(() => {
    return () => {
      dispatch(clearAuthMessages());
    };
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const resultAction = await dispatch(loginUser(form));

    if (loginUser.fulfilled.match(resultAction)) {
      const role = resultAction.payload.role;

      if (role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-neutral-100 via-white to-neutral-200">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="hidden lg:flex flex-col justify-between bg-black text-white p-12">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-white/70">
              Fashion Shop
            </p>
            <h1 className="mt-6 text-5xl font-bold leading-tight">
              Chào mừng
              <br />
              bạn quay lại
            </h1>
            <p className="mt-6 max-w-md text-lg text-white/70">
              Đăng nhập để tiếp tục mua sắm, theo dõi đơn hàng và khám phá các
              bộ sưu tập mới nhất.
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
              <p className="font-semibold">Mua sắm nhanh hơn</p>
              <p className="mt-1 text-sm text-white/70">
                Lưu thông tin và tiếp tục đơn hàng dễ dàng.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
              <p className="font-semibold">Theo dõi đơn hàng</p>
              <p className="mt-1 text-sm text-white/70">
                Quản lý lịch sử mua hàng và trạng thái giao hàng tiện lợi.
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
                Đăng nhập
              </h1>
              <p className="mt-2 text-sm text-neutral-600">
                Tiếp tục hành trình mua sắm của bạn
              </p>
            </div>

            <div className="rounded-3xl border border-neutral-200 bg-white/85 p-8 shadow-2xl backdrop-blur">
              <div className="mb-6 hidden lg:block">
                <h2 className="text-3xl font-bold text-neutral-900">
                  Đăng nhập
                </h2>
                <p className="mt-2 text-sm text-neutral-500">
                  Nhập thông tin để truy cập tài khoản của bạn
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Nhập email"
                    className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-sm font-medium text-neutral-700">
                      Mật khẩu
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-xs font-medium text-neutral-500 hover:text-black"
                    >
                      Quên mật khẩu?
                    </Link>
                  </div>

                  <input
                    type="password"
                    placeholder="Nhập mật khẩu"
                    className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                  />
                </div>

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full rounded-xl bg-black py-3.5 font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={loading}
                >
                  {loading ? "Đang xử lý..." : "Đăng nhập"}
                </button>
                <GoogleLoginButton />
              </form>

              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-neutral-200" />
                <span className="text-xs uppercase tracking-[0.25em] text-neutral-400">
                  Fashion Shop
                </span>
                <div className="h-px flex-1 bg-neutral-200" />
              </div>

              <p className="text-center text-sm text-neutral-600">
                Chưa có tài khoản?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-black underline underline-offset-4"
                >
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
