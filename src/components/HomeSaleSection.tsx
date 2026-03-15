"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/product/ProductCard";

type Product = any;

export default function HomeSaleSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSaleProducts() {
      try {
        const res = await fetch("/api/products/sale");
        const result = await res.json();

        if (res.ok) {
          setProducts(result.data || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadSaleProducts();
  }, []);

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-12">
        <p>Đang tải sản phẩm giảm giá...</p>
      </section>
    );
  }

  if (!products.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-6">
        <p className="text-sm uppercase tracking-wider text-red-500">
          Sale nổi bật
        </p>
        <h2 className="text-3xl font-bold">Sản phẩm đang giảm giá</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.slice(0, 6).map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}
