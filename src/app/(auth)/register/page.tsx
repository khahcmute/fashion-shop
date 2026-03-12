"use client";

import Link from "next/link";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { registerUser } from "@/features/auth/authSlice";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const resultAction = await dispatch(registerUser(form));

    if (registerUser.fulfilled.match(resultAction)) {
      router.push("/login");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-neutral-100 via-white to-neutral-200">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="hidden lg:flex flex-col justify-between bg-black text-white p-12">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/70">
              Fashion Shop
            </p>
            <h1 className="mt-6 text-5xl font-bold leading-tight">
              Tạo tài khoản
              <br />
              để bắt đầu mua sắm
            </h1>
            <p className="mt-6 max-w-md text-white/70 text-lg">
              Khám phá xu hướng thời trang mới, lưu sản phẩm yêu thích và theo
              dõi đơn hàng của bạn dễ dàng hơn.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <p className="text-2xl font-semibold">New</p>
              <p className="mt-1 text-sm text-white/70">
                Xu hướng mới mỗi tuần
              </p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <p className="text-2xl font-semibold">Hot</p>
              <p className="mt-1 text-sm text-white/70">
                Deal hấp dẫn mỗi ngày
              </p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <p className="text-2xl font-semibold">Fast</p>
              <p className="mt-1 text-sm text-white/70">Đặt hàng nhanh chóng</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center lg:hidden">
              <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
                Fashion Shop
              </p>
              <h1 className="mt-3 text-3xl font-bold text-neutral-900">
                Tạo tài khoản mới
              </h1>
              <p className="mt-2 text-sm text-neutral-600">
                Tham gia để mua sắm và theo dõi đơn hàng dễ dàng hơn
              </p>
            </div>

            <div className="rounded-3xl border border-neutral-200 bg-white/80 p-8 shadow-2xl backdrop-blur">
              <div className="mb-6 hidden lg:block">
                <h2 className="text-3xl font-bold text-neutral-900">Đăng ký</h2>
                <p className="mt-2 text-sm text-neutral-500">
                  Tạo tài khoản để trải nghiệm mua sắm tại Fashion Shop
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    placeholder="Nhập họ và tên"
                    className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Nhập email"
                    className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-700">
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    placeholder="Tạo mật khẩu"
                    className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
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
                  {loading ? "Đang xử lý..." : "Tạo tài khoản"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-neutral-600">
                Đã có tài khoản?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-black underline underline-offset-4"
                >
                  Đăng nhập
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
