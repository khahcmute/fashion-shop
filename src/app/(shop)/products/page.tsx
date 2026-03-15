"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProducts } from "@/features/product/productSlice";
import { fetchCategories } from "@/features/category/categorySlice";
import ProductCard from "@/components/product/ProductCard";

export default function ProductsPage() {
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
      fetchProducts({
        search: initialSearch,
        category: initialCategory,
      }),
    );
  }, [dispatch, initialSearch, initialCategory]);

  const handleFilter = () => {
    dispatch(
      fetchProducts({
        search,
        category: selectedCategory,
      }),
    );
  };

  const handleReset = () => {
    setSearch("");
    setSelectedCategory("");
    dispatch(fetchProducts(undefined));
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Tất cả sản phẩm
        </h1>
        <p className="text-gray-500 mt-2">
          Khám phá các sản phẩm mới, nổi bật và đang giảm giá.
        </p>
      </div>

      <div className="mb-8 rounded-3xl border bg-white p-4 md:p-5 shadow-sm">
        <div className="grid md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Tìm theo tên sản phẩm..."
            className="md:col-span-2 rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
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

          <div className="flex gap-2">
            <button
              onClick={handleFilter}
              className="w-full rounded-2xl bg-black px-4 py-3 text-white font-medium transition hover:bg-gray-900"
            >
              Lọc
            </button>

            <button
              onClick={handleReset}
              className="w-full rounded-2xl border px-4 py-3 font-medium transition hover:bg-gray-50"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="py-10 text-center text-gray-500">
          Đang tải sản phẩm...
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && products.length === 0 && (
        <div className="rounded-3xl border bg-white py-16 text-center text-gray-500 shadow-sm">
          Không có sản phẩm phù hợp.
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-7">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
