"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logoutUser } from "@/features/auth/authSlice";
import { clearCartState, fetchCart } from "@/features/cart/cartSlice";
import { fetchProducts } from "@/features/product/productSlice";

export default function UserNavbar() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.cart);
  const { products } = useAppSelector((state) => state.product);

  const [search, setSearch] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLDivElement | null>(null);

  const totalCartItems = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const cartRef = useRef<HTMLDivElement | null>(null);
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

  return (
    <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
        <div className="shrink-0">
          <Link href="/" className="text-2xl font-bold">
            Fashion Shop
          </Link>
        </div>

        <div ref={searchRef} className="flex-1 max-w-3xl mx-auto relative">
          <form onSubmit={handleSearchSubmit} className="flex">
            <input
              type="text"
              placeholder="Tìm áo thun, hoodie, quần jeans..."
              className="w-full border border-gray-300 rounded-l-full px-5 py-3 outline-none focus:border-black"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
            />
            <button
              type="submit"
              className="bg-black text-white px-6 rounded-r-full"
            >
              Tìm
            </button>
          </form>

          {showSuggestions && search.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-2xl shadow-lg overflow-hidden">
              {suggestions.length > 0 ? (
                suggestions.map((product) => (
                  <button
                    key={product._id}
                    type="button"
                    onClick={() => handleSuggestionClick(product.name)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b last:border-b-0"
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

        <div className="flex items-center gap-3 shrink-0">
          <div ref={cartRef} className="relative">
            <button
              onClick={() => setShowCartDropdown((prev) => !prev)}
              className="relative px-2 py-2"
            >
              <span className="text-2xl">🛒</span>
              {totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  {totalCartItems}
                </span>
              )}
            </button>

            {showCartDropdown && (
              <div className="absolute right-0 top-full mt-2 w-96 bg-white border rounded-3xl shadow-xl overflow-hidden">
                <div className="p-4 border-b">
                  <h3 className="font-semibold text-lg">Giỏ hàng</h3>
                </div>

                {items.length === 0 ? (
                  <div className="p-4 text-sm text-gray-500">
                    Giỏ hàng đang trống.
                  </div>
                ) : (
                  <>
                    <div className="max-h-96 overflow-auto">
                      {cartPreviewItems.map((item) => (
                        <div
                          key={item._id}
                          className="flex gap-3 p-4 border-b last:border-b-0"
                        >
                          <img
                            src={
                              item.product.images[0] ||
                              "https://placehold.co/100x120?text=No+Image"
                            }
                            alt={item.product.name}
                            className="w-16 h-20 object-cover rounded-xl"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {item.product.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.color} / {item.size}
                            </p>
                            <p className="text-xs text-gray-500">
                              SL: {item.quantity}
                            </p>
                            <p className="text-sm font-semibold mt-1">
                              {(
                                item.priceAtAddedTime * item.quantity
                              ).toLocaleString("vi-VN")}
                              đ
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 border-t">
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-medium">Tổng</span>
                        <span className="font-bold">
                          {totalCartPrice.toLocaleString("vi-VN")}đ
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <Link
                          href="/cart"
                          onClick={() => setShowCartDropdown(false)}
                          className="text-center border px-4 py-3 rounded-full hover:bg-gray-50"
                        >
                          Xem giỏ hàng
                        </Link>
                        <Link
                          href="/checkout"
                          onClick={() => setShowCartDropdown(false)}
                          className="text-center bg-black text-white px-4 py-3 rounded-full"
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
              <Link href="/login" className="text-sm hover:text-gray-600">
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="text-sm bg-black text-white px-3 py-2 rounded-full"
              >
                Đăng ký
              </Link>
            </div>
          ) : (
            <div ref={menuRef} className="relative">
              <button
                onClick={() => setShowUserMenu((prev) => !prev)}
                className="flex items-center gap-2 px-3 py-2 rounded-full border hover:bg-gray-50"
              >
                <span className="text-sm font-medium">{user?.name}</span>
                <span>▾</span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white border rounded-2xl shadow-lg overflow-hidden">
                  <Link
                    href="/orders"
                    onClick={() => setShowUserMenu(false)}
                    className="block px-4 py-3 hover:bg-gray-50"
                  >
                    Đơn hàng của tôi
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 text-red-500"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
