"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product } from "@/features/product/productSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart } from "@/features/cart/cartSlice";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const discountPercent =
    product.salePrice && product.price > product.salePrice
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : 0;

  const displayPrice =
    product.salePrice && product.salePrice < product.price
      ? product.salePrice
      : product.price;

  async function handleQuickAdd() {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    const firstVariant = product.variants?.[0];
    if (!firstVariant) {
      router.push(`/products/${product.slug}`);
      return;
    }
    const result = await dispatch(
      addToCart({
        productId: product._id,
        color: firstVariant.color,
        size: firstVariant.size,
        quantity: 1,
      }),
    );
    if (addToCart.fulfilled.match(result)) router.push("/cart");
  }

  return (
    <div className="group relative bg-white overflow-hidden transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.09)]">
      {/* ── Image block ── */}
      <div className="relative overflow-hidden aspect-[3/4] bg-[#f7f6f3]">
        {/* Sale badge — rose accent */}
        {discountPercent > 0 && (
          <span className="absolute top-3 right-3 z-20 bg-rose-500 text-white text-[10px] font-bold tracking-[0.12em] uppercase px-2.5 py-1">
            -{discountPercent}%
          </span>
        )}

        {/* Featured badge — amber accent */}
        {product.isFeatured && (
          <span className="absolute top-3 left-3 z-20 bg-amber-400 text-black text-[10px] font-bold tracking-[0.12em] uppercase px-2.5 py-1">
            Nổi bật
          </span>
        )}

        <img
          src={
            product.images?.[0] || "https://placehold.co/600x800?text=No+Image"
          }
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(.25,.46,.45,.94)] group-hover:scale-105"
        />

        {/* Gradient veil */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

        {/* CTA strip — slides up */}
        <div className="absolute inset-x-0 bottom-0 z-20 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
          <div className="flex gap-2">
            <Link
              href={`/products/${product.slug}`}
              className="flex-1 bg-white/92 backdrop-blur-sm text-gray-900 text-[11px] font-semibold uppercase tracking-widest text-center px-3 py-2.5 hover:bg-white transition-colors duration-150"
            >
              Xem chi tiết
            </Link>
            <button
              onClick={handleQuickAdd}
              className="flex-1 bg-black text-white text-[11px] font-semibold uppercase tracking-widest px-3 py-2.5 hover:bg-gray-800 active:scale-[0.98] transition-all duration-150"
            >
              + Giỏ hàng
            </button>
          </div>
        </div>
      </div>

      {/* ── Info block ── */}
      <div className="px-4 pt-3.5 pb-4 border-t border-gray-100">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400 mb-1">
          {product.category?.name || "—"}
        </p>

        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 min-h-[40px] mb-3 leading-snug">
          {product.name}
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-[15px] font-bold text-gray-900">
              {displayPrice.toLocaleString("vi-VN")}đ
            </span>
            {product.salePrice && product.salePrice < product.price && (
              <span className="text-xs text-gray-400 line-through">
                {product.price.toLocaleString("vi-VN")}đ
              </span>
            )}
          </div>

          {/* Compact arrow CTA */}
          <Link
            href={`/products/${product.slug}`}
            aria-label="Xem chi tiết"
            className="w-7 h-7 flex items-center justify-center bg-gray-100 hover:bg-black text-gray-500 hover:text-white transition-colors duration-200"
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path
                d="M1 10L10 1M10 1H3M10 1V8"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="square"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
