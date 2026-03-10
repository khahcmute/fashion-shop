"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProducts } from "@/features/product/productSlice";
import ProductCard from "@/components/product/ProductCard";

export default function HomeProductSection() {
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchProducts(undefined));
  }, [dispatch]);

  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 6);
  const displayProducts =
    featuredProducts.length > 0 ? featuredProducts : products.slice(0, 6);

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-gray-500 uppercase tracking-wider">
            Sản phẩm nổi bật
          </p>
          <h2 className="text-3xl font-bold">Chọn phong cách của bạn</h2>
        </div>

        <Link href="/products" className="text-sm font-medium hover:underline">
          Xem tất cả
        </Link>
      </div>

      {loading && <p>Đang tải sản phẩm...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && displayProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {displayProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
