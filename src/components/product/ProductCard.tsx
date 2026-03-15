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

    if (addToCart.fulfilled.match(result)) {
      router.push("/cart");
    }
  }

  return (
    <div className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative overflow-hidden">
        {discountPercent > 0 && (
          <span className="absolute top-4 right-4 z-20 rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white shadow">
            -{discountPercent}%
          </span>
        )}

        {product.isFeatured && (
          <span className="absolute top-4 left-4 z-20 rounded-full bg-black px-3 py-1 text-xs font-semibold text-white shadow">
            Nổi bật
          </span>
        )}

        <img
          src={
            product.images?.[0] || "https://placehold.co/600x800?text=No+Image"
          }
          alt={product.name}
          className="h-80 w-full object-cover transition duration-500 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-black/10 opacity-0 transition duration-300 group-hover:opacity-100" />

        <div className="absolute inset-x-0 bottom-0 z-20 translate-y-full p-4 transition duration-300 group-hover:translate-y-0">
          <div className="flex gap-2">
            <Link
              href={`/products/${product.slug}`}
              className="w-full rounded-2xl bg-white px-4 py-3 text-center text-sm font-semibold text-black shadow-md transition hover:bg-gray-100"
            >
              Xem chi tiết
            </Link>

            <button
              onClick={handleQuickAdd}
              className="w-full rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-gray-900"
            >
              Thêm vào giỏ
            </button>
          </div>
        </div>
      </div>

      <div className="p-5">
        <p className="mb-2 text-sm text-gray-500">{product.category?.name}</p>

        <h3 className="mb-3 line-clamp-2 min-h-[56px] text-lg font-semibold text-gray-900">
          {product.name}
        </h3>

        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-gray-900">
            {displayPrice.toLocaleString("vi-VN")}đ
          </span>

          {product.salePrice && product.salePrice < product.price && (
            <span className="text-sm text-gray-400 line-through">
              {product.price.toLocaleString("vi-VN")}đ
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
