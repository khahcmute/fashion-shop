"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logoutUser } from "@/features/auth/authSlice";

export default function UserNavbar() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.cart);

  const [search, setSearch] = useState("");

  const totalCartItems = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  async function handleLogout() {
    const result = await dispatch(logoutUser());

    if (logoutUser.fulfilled.match(result)) {
      router.push("/login");
    }
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();

    const keyword = search.trim();

    if (!keyword) {
      router.push("/products");
      return;
    }

    router.push(`/products?search=${encodeURIComponent(keyword)}`);
  }

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-2xl font-bold">
            Fashion Shop
          </Link>

          <nav className="hidden md:flex items-center gap-4 text-sm">
            <Link href="/" className="hover:text-gray-600">
              Trang chủ
            </Link>
            <Link href="/products" className="hover:text-gray-600">
              Sản phẩm
            </Link>
            {isAuthenticated && (
              <Link href="/orders" className="hover:text-gray-600">
                Đơn hàng của tôi
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="hidden md:flex">
            <input
              type="text"
              placeholder="Tìm sản phẩm..."
              className="border rounded-l px-3 py-2 w-56"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              type="submit"
              className="bg-black text-white px-4 rounded-r"
            >
              Tìm
            </button>
          </form>

          <Link href="/cart" className="relative px-2 py-2">
            <span className="text-xl">🛒</span>
            {totalCartItems > 0 && (
              <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                {totalCartItems}
              </span>
            )}
          </Link>

          {!isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link href="/login" className="text-sm hover:text-gray-600">
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="text-sm bg-black text-white px-3 py-2 rounded"
              >
                Đăng ký
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-sm text-gray-700">
                Xin chào, {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm bg-red-500 text-white px-3 py-2 rounded"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
