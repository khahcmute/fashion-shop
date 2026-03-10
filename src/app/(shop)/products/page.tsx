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
    <main className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Tất cả sản phẩm</h1>

      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="Tìm theo tên sản phẩm..."
          className="border rounded px-4 py-2 md:col-span-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border rounded px-4 py-2"
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
            className="bg-black text-white px-4 py-2 rounded w-full"
          >
            Lọc
          </button>

          <button
            onClick={handleReset}
            className="border px-4 py-2 rounded w-full"
          >
            Reset
          </button>
        </div>
      </div>

      {loading && <p>Đang tải sản phẩm...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && products.length === 0 && (
        <p>Không có sản phẩm phù hợp.</p>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
