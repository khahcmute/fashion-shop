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

  async function handleQuickAdd(e?: React.MouseEvent<HTMLButtonElement>) {
    e?.preventDefault();
    e?.stopPropagation();

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

    if (addToCart.fulfilled.match(result)) {
      router.push("/cart");
    }
  }

  return (
    <div className="group relative overflow-hidden bg-white shadow-[0_4px_14px_rgba(0,0,0,0.08)] sm:shadow-none sm:hover:shadow-[0_12px_40px_rgba(0,0,0,0.09)] transition-all duration-300">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-[#f7f6f3]">
          {discountPercent > 0 && (
            <span className="absolute right-3 top-3 z-20 bg-rose-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
              -{discountPercent}%
            </span>
          )}

          {product.isFeatured && (
            <span className="absolute left-3 top-3 z-20 bg-amber-400 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-black">
              Nổi bật
            </span>
          )}

          <img
            src={
              product.images?.[0] ||
              "https://placehold.co/600x800?text=No+Image"
            }
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(.25,.46,.45,.94)] group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 hidden sm:block" />

          <div className="absolute inset-x-0 bottom-0 z-20 hidden translate-y-full p-3 transition-transform duration-300 ease-out group-hover:translate-y-0 sm:block">
            <button
              onClick={handleQuickAdd}
              className="w-full bg-black px-3 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-white transition-all duration-150 hover:bg-gray-800 active:scale-[0.98]"
            >
              + Giỏ hàng
            </button>
          </div>
        </div>

        <div className="border-t border-gray-100 px-4 pb-4 pt-3.5">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
            {product.category?.name || "—"}
          </p>

          <h3 className="mb-3 min-h-[40px] line-clamp-2 text-sm font-semibold leading-snug text-gray-900">
            {product.name}
          </h3>

          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex items-baseline gap-2">
              <span className="text-[15px] font-bold text-gray-900">
                {displayPrice.toLocaleString("vi-VN")}đ
              </span>
              {product.salePrice && product.salePrice < product.price && (
                <span className="text-xs text-gray-400 line-through">
                  {product.price.toLocaleString("vi-VN")}đ
                </span>
              )}
            </div>

            <span className="hidden h-7 w-7 items-center justify-center bg-gray-100 text-gray-500 transition-colors duration-200 group-hover:bg-black group-hover:text-white sm:flex">
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path
                  d="M1 10L10 1M10 1H3M10 1V8"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="square"
                />
              </svg>
            </span>
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4 sm:hidden">
        <button
          onClick={handleQuickAdd}
          className="w-full bg-black px-4 py-3 text-sm font-semibold text-white active:scale-[0.98]"
        >
          Thêm vào giỏ hàng
        </button>
      </div>
    </div>
  );
}
