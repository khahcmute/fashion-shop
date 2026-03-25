"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logoutUser } from "@/features/auth/authSlice";
import { clearCartState, fetchCart } from "@/features/cart/cartSlice";
import { fetchProducts } from "@/features/product/productSlice";
import { ShoppingCart, Search } from "lucide-react";
import { signOut as nextAuthSignOut, useSession } from "next-auth/react";

export default function UserNavbar() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { status } = useSession();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.cart);
  const { products } = useAppSelector((state) => state.product);

  const [search, setSearch] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showCartDropdown, setShowCartDropdown] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const cartRef = useRef<HTMLDivElement | null>(null);

  const totalCartItems = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const suggestions = useMemo(() => {
    if (!search.trim()) return [];
    return products
      .filter((product) =>
        product.name.toLowerCase().includes(search.trim().toLowerCase()),
      )
      .slice(0, 6);
  }, [products, search]);

  const cartPreviewItems = items.slice(0, 4);

  const totalCartPrice = useMemo(() => {
    return items.reduce((sum, item) => {
      return sum + item.priceAtAddedTime * item.quantity;
    }, 0);
  }, [items]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    dispatch(fetchProducts(undefined));
  }, [dispatch]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;

      if (menuRef.current && !menuRef.current.contains(target)) {
        setShowUserMenu(false);
      }

      if (searchRef.current && !searchRef.current.contains(target)) {
        setShowSuggestions(false);
      }

      if (cartRef.current && !cartRef.current.contains(target)) {
        setShowCartDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function handleLogout() {
    const result = await dispatch(logoutUser());

    if (logoutUser.fulfilled.match(result)) {
      dispatch(clearCartState());

      if (status === "authenticated") {
        await nextAuthSignOut({ redirect: false });
      }

      setShowUserMenu(false);
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

    setShowSuggestions(false);
    router.push(`/products?search=${encodeURIComponent(keyword)}`);
  }

  function handleSuggestionClick(name: string) {
    setSearch(name);
    setShowSuggestions(false);
    router.push(`/products?search=${encodeURIComponent(name)}`);
  }

  function handleCartClick() {
    if (window.innerWidth < 640) {
      router.push("/cart");
      return;
    }

    setShowCartDropdown((prev) => !prev);
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-3 sm:px-4">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 py-3 md:gap-4">
          <div className="min-w-0">
            <Link
              href="/"
              className="whitespace-nowrap text-lg font-bold sm:text-xl md:text-2xl"
            >
              Fashion Shop
            </Link>
          </div>

          <div
            ref={searchRef}
            className="hidden md:block relative col-span-3 order-3 w-full md:col-span-1 md:order-2 md:mx-auto md:max-w-3xl"
          >
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Tìm áo thun, hoodie, quần jeans..."
                className="w-full min-w-0 rounded-xs border border-gray-300 px-4 py-2.5 pr-14 text-sm outline-none focus:border-black sm:px-5 sm:py-3 sm:pr-16"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-xs bg-black px-3 py-2 text-white sm:px-4"
                aria-label="Tìm kiếm"
              >
                <Search className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </form>

            {showSuggestions && search.trim() && (
              <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl bg-white shadow-xl">
                {suggestions.length > 0 ? (
                  suggestions.map((product) => (
                    <button
                      key={product._id}
                      type="button"
                      onClick={() => handleSuggestionClick(product.name)}
                      className="w-full px-4 py-3 text-left text-sm transition hover:bg-gray-50"
                    >
                      {product.name}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-500">
                    Không có gợi ý phù hợp
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="order-2 flex items-center justify-end gap-2 sm:gap-3 md:order-3">
            <div ref={cartRef} className="relative">
              <button
                onClick={handleCartClick}
                className="relative rounded-full p-2 hover:bg-gray-50"
              >
                <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
                {totalCartItems > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs text-white">
                    {totalCartItems}
                  </span>
                )}
              </button>

              {showCartDropdown && (
                <div className="absolute right-0 top-full z-50 mt-2 w-[90vw] max-w-sm overflow-visible rounded-xl bg-white shadow-lg sm:w-96">
                  <div className="border-b p-4">
                    <h3 className="text-base font-semibold sm:text-lg">
                      Giỏ hàng
                    </h3>
                  </div>

                  {items.length === 0 ? (
                    <div className="p-4 text-sm text-gray-500">
                      Giỏ hàng đang trống.
                    </div>
                  ) : (
                    <>
                      <div className="max-h-80 overflow-auto sm:max-h-96">
                        {cartPreviewItems.map((item) => (
                          <div
                            key={item._id}
                            className="flex gap-3 border-b p-4 last:border-b-0"
                          >
                            <img
                              src={
                                item.product.images[0] ||
                                "https://placehold.co/100x120?text=No+Image"
                              }
                              alt={item.product.name}
                              className="h-20 w-16 rounded-xl object-cover"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="line-clamp-2 text-sm font-medium">
                                {item.product.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {item.color} / {item.size}
                              </p>
                              <p className="text-xs text-gray-500">
                                SL: {item.quantity}
                              </p>
                              <p className="mt-1 text-sm font-semibold">
                                {(
                                  item.priceAtAddedTime * item.quantity
                                ).toLocaleString("vi-VN")}
                                đ
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="border-t p-4">
                        <div className="mb-4 flex items-center justify-between">
                          <span className="font-medium">Tổng</span>
                          <span className="font-bold">
                            {totalCartPrice.toLocaleString("vi-VN")}đ
                          </span>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <Link
                            href="/cart"
                            onClick={() => setShowCartDropdown(false)}
                            className="rounded-full border px-4 py-3 text-center text-sm hover:bg-gray-50"
                          >
                            Xem giỏ hàng
                          </Link>
                          <Link
                            href="/checkout"
                            onClick={() => setShowCartDropdown(false)}
                            className="rounded-full bg-black px-4 py-3 text-center text-sm text-white"
                          >
                            Thanh toán
                          </Link>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {!isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="rounded-sm bg-black px-3 py-2 text-sm text-white sm:bg-transparent sm:px-0 sm:py-0 sm:text-gray-900 sm:hover:text-gray-600"
                >
                  Đăng nhập
                </Link>

                <span className="hidden text-gray-400 sm:inline">|</span>

                <Link
                  href="/register"
                  className="hidden text-sm hover:text-gray-600 sm:block"
                >
                  Đăng ký
                </Link>
              </div>
            ) : (
              <div ref={menuRef} className="relative">
                <button
                  onClick={() => setShowUserMenu((prev) => !prev)}
                  className="flex max-w-[140px] items-center gap-2 rounded-full px-3 py-2 hover:bg-gray-50 sm:max-w-[180px]"
                >
                  <span className="truncate text-sm font-medium">
                    {user?.name}
                  </span>
                  <span className="shrink-0">▾</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-xl bg-white shadow-md">
                    <Link
                      href="/account"
                      onClick={() => setShowUserMenu(false)}
                      className="block px-4 py-3 hover:bg-gray-50"
                    >
                      Quản lý tài khoản
                    </Link>
                    <Link
                      href="/orders"
                      onClick={() => setShowUserMenu(false)}
                      className="block px-4 py-3 text-gray-800 hover:bg-gray-100"
                    >
                      Đơn hàng của tôi
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-left text-gray-800 hover:bg-gray-100"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
