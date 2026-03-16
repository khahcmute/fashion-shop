"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProducts } from "@/features/product/productSlice";
import { fetchCategories } from "@/features/category/categorySlice";
import ProductCard from "@/components/product/ProductCard";

export default function ProductsPageClient() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();

  const { products, loading, error } = useAppSelector((state) => state.product);
  const { categories } = useAppSelector((state) => state.category);

  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "";

  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    setSearch(initialSearch);
    setSelectedCategory(initialCategory);
    dispatch(
      fetchProducts({ search: initialSearch, category: initialCategory }),
    );
  }, [dispatch, initialSearch, initialCategory]);

  const handleFilter = () => {
    dispatch(fetchProducts({ search, category: selectedCategory }));
  };

  const handleReset = () => {
    setSearch("");
    setSelectedCategory("");
    dispatch(fetchProducts(undefined));
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-10 md:px-6">
      {/* ── Page header ── */}
      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-400 mb-2">
          Bộ sưu tập
        </p>
        <h1 className="text-4xl md:text-5xl  uppercase text-gray-900 leading-none tracking-tight mb-3">
          Tất cả sản phẩm
        </h1>
        {/* Accent underline */}
        <div className="flex items-center gap-3">
          <div className="h-[3px] w-12 bg-black" />
          <p className="text-sm text-gray-500">
            Khám phá các sản phẩm mới, nổi bật và đang giảm giá.
          </p>
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div className="bg-white border border-gray-200 shadow-sm mb-8 p-4">
        <div className="grid md:grid-cols-[1fr_1fr_auto_auto] gap-3">
          <input
            type="text"
            placeholder="Tìm theo tên sản phẩm..."
            className="md:col-span-1 border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-gray-400 focus:bg-white transition-colors"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleFilter()}
          />

          <div className="relative">
            <select
              className="w-full h-full border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-gray-400 focus:bg-white appearance-none cursor-pointer transition-colors"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((category) => (
                <option key={category._id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                <path
                  d="M1 1L5 5L9 1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="square"
                />
              </svg>
            </div>
          </div>

          <button
            onClick={handleFilter}
            className="px-7 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800 active:scale-[0.98] transition-all duration-150"
          >
            Lọc
          </button>

          <button
            onClick={handleReset}
            className="px-7 py-2.5 border border-gray-300 text-gray-600 text-xs font-semibold uppercase tracking-widest hover:border-gray-900 hover:text-gray-900 transition-colors duration-150"
          >
            Reset
          </button>
        </div>
      </div>

      {/* ── Results meta ── */}
      {!loading && !error && products.length > 0 && (
        <p className="text-xs text-gray-400 font-medium mb-5">
          {products.length} sản phẩm
        </p>
      )}

      {/* ── Loading ── */}
      {loading && (
        <div className="py-24 flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-black animate-spin" />
          <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
            Đang tải...
          </p>
        </div>
      )}

      {/* ── Error ── */}
      {error && (
        <div className="border-l-4 border-rose-500 bg-rose-50 px-5 py-4">
          <p className="text-sm font-semibold text-rose-700">{error}</p>
        </div>
      )}

      {/* ── Empty ── */}
      {!loading && !error && products.length === 0 && (
        <div className="py-24 flex flex-col items-center gap-3 bg-[#fafaf9] border border-gray-100">
          <div className="w-10 h-10 border-2 border-gray-200 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="#9ca3af" strokeWidth="2" />
              <path
                d="m21 21-4.35-4.35"
                stroke="#9ca3af"
                strokeWidth="2"
                strokeLinecap="square"
              />
            </svg>
          </div>
          <p className="text-sm font-semibold text-gray-500">
            Không có sản phẩm phù hợp
          </p>
          <button
            onClick={handleReset}
            className="text-xs underline text-gray-400 hover:text-black transition-colors"
          >
            Xem tất cả
          </button>
        </div>
      )}

      {/* ── Product grid ── */}
      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
