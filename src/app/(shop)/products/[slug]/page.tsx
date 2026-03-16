"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearSelectedProduct,
  fetchProductBySlug,
} from "@/features/product/productSlice";
import { addToCart } from "@/features/cart/cartSlice";

type Props = {
  params: Promise<{ slug: string }>;
};

export default function ProductDetailPage({ params }: Props) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { selectedProduct, loading, error } = useAppSelector(
    (state) => state.product,
  );
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    let mounted = true;
    async function loadProduct() {
      const { slug } = await params;
      if (mounted) dispatch(fetchProductBySlug(slug));
    }
    loadProduct();
    return () => {
      mounted = false;
      dispatch(clearSelectedProduct());
    };
  }, [dispatch, params]);

  useEffect(() => {
    if (selectedProduct?.variants?.length) {
      setColor(selectedProduct.variants[0].color);
      setSize(selectedProduct.variants[0].size);
    }
    if (selectedProduct?.images?.length) {
      setSelectedImage(selectedProduct.images[0]);
    }
  }, [selectedProduct]);

  const variants = selectedProduct?.variants || [];
  const images = selectedProduct?.images || [];

  const uniqueColors = useMemo(
    () => [...new Set(variants.map((v) => v.color))],
    [variants],
  );

  const sizesByColor = useMemo(
    () => variants.filter((v) => v.color === color).map((v) => v.size),
    [variants, color],
  );

  const selectedVariant = useMemo(
    () => variants.find((v) => v.color === color && v.size === size),
    [variants, color, size],
  );

  async function handleAddToCart() {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!selectedProduct) return;

    const result = await dispatch(
      addToCart({
        productId: selectedProduct._id,
        color,
        size,
        quantity,
      }),
    );

    if (addToCart.fulfilled.match(result)) {
      router.push("/cart");
    }
  }

  /* ── States ── */
  if (loading)
    return (
      <main className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-9 h-9 border-2 border-gray-200 border-t-black animate-spin" />
          <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
            Đang tải...
          </p>
        </div>
      </main>
    );

  if (error)
    return (
      <main className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="border-l-4 border-rose-500 bg-rose-50 px-6 py-5 max-w-md w-full">
          <p className="text-xs font-bold uppercase tracking-widest text-rose-600 mb-1">
            Lỗi
          </p>
          <p className="text-sm text-rose-700">{error}</p>
        </div>
      </main>
    );

  if (!selectedProduct)
    return (
      <main className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-2xl font-black uppercase text-gray-900 mb-2">
            Không tìm thấy
          </p>
          <p className="text-sm text-gray-500">
            Sản phẩm không tồn tại hoặc đã bị xóa.
          </p>
        </div>
      </main>
    );

  const displayPrice =
    selectedProduct.salePrice &&
    selectedProduct.salePrice < selectedProduct.price
      ? selectedProduct.salePrice
      : selectedProduct.price;

  const hasSale =
    selectedProduct.salePrice &&
    selectedProduct.salePrice < selectedProduct.price;

  const discountPercent = hasSale
    ? Math.round(
        ((selectedProduct.price - selectedProduct.salePrice!) /
          selectedProduct.price) *
          100,
      )
    : 0;

  const stockCount = selectedVariant?.stock ?? 0;
  const stockStatus =
    stockCount === 0
      ? { label: "Hết hàng", color: "text-rose-500", dot: "bg-rose-400" }
      : stockCount < 5
        ? {
            label: `Còn ${stockCount} sản phẩm`,
            color: "text-amber-600",
            dot: "bg-amber-400",
          }
        : {
            label: `Còn hàng (${stockCount})`,
            color: "text-emerald-600",
            dot: "bg-emerald-400",
          };

  return (
    <main className="max-w-7xl mx-auto px-4 py-10 md:px-6">
      <div className="grid lg:grid-cols-2 gap-8 xl:gap-14 items-start">
        {/* ── LEFT: Images ── */}
        <div className="space-y-3">
          {/* Main image */}
          <div className="relative overflow-hidden bg-[#f7f6f3] aspect-[4/5]">
            {discountPercent > 0 && (
              <span className="absolute top-4 right-4 z-20 bg-rose-500 text-white text-[10px] font-bold tracking-[0.12em] uppercase px-3 py-1.5">
                -{discountPercent}%
              </span>
            )}
            {selectedProduct.isFeatured && (
              <span className="absolute top-4 left-4 z-20 bg-amber-400 text-black text-[10px] font-bold tracking-[0.12em] uppercase px-3 py-1.5">
                Nổi bật
              </span>
            )}
            <img
              src={
                selectedImage || "https://placehold.co/800x1000?text=No+Image"
              }
              alt={selectedProduct.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(.25,.46,.45,.94)] hover:scale-[1.03]"
            />
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedImage(image)}
                  className={`relative overflow-hidden aspect-square bg-[#f7f6f3] transition-all duration-200 ${
                    selectedImage === image
                      ? "ring-2 ring-black ring-offset-1"
                      : "opacity-55 hover:opacity-100"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${selectedProduct.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT: Info ── */}
        <div className="lg:sticky lg:top-24 space-y-6">
          {/* Category + Name + Price */}
          <div className="pb-6 border-b border-gray-100">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-400 mb-2">
              {selectedProduct.category?.name || "Danh mục"}
            </p>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight tracking-tight mb-4">
              {selectedProduct.name}
            </h1>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">
                {displayPrice.toLocaleString("vi-VN")}đ
              </span>
              {hasSale && (
                <>
                  <span className="text-lg text-gray-400 line-through font-medium">
                    {selectedProduct.price.toLocaleString("vi-VN")}đ
                  </span>
                  <span className="text-xs font-bold text-rose-500 bg-rose-50 px-2 py-0.5">
                    Tiết kiệm{" "}
                    {(
                      selectedProduct.price - selectedProduct.salePrice!
                    ).toLocaleString("vi-VN")}
                    đ
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed">
            {selectedProduct.description}
          </p>

          {/* Options panel */}
          <div className="bg-gray-50 p-5 space-y-5">
            {/* Color */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500 mb-2">
                Màu sắc
              </label>
              <div className="relative">
                <select
                  value={color}
                  onChange={(e) => {
                    const newColor = e.target.value;
                    setColor(newColor);
                    const firstSize =
                      variants.find((v) => v.color === newColor)?.size || "";
                    setSize(firstSize);
                  }}
                  className="w-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-800 outline-none focus:border-gray-400 appearance-none cursor-pointer transition-colors"
                >
                  {uniqueColors.map((c) => (
                    <option key={c} value={c}>
                      {c}
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
            </div>

            {/* Size */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500 mb-2">
                Kích cỡ
              </label>
              <div className="relative">
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-800 outline-none focus:border-gray-400 appearance-none cursor-pointer transition-colors"
                >
                  {sizesByColor.map((s) => (
                    <option key={s} value={s}>
                      {s}
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
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500 mb-2">
                Số lượng
              </label>
              <div className="inline-flex items-center border border-gray-200 bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-11 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-100 text-lg font-light transition-colors"
                >
                  −
                </button>
                <span className="w-14 h-11 flex items-center justify-center text-sm font-semibold text-gray-900 border-x border-gray-200">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-11 h-11 flex items-center justify-center text-gray-600 hover:bg-gray-100 text-lg font-light transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Stock status */}
            <div className="flex items-center gap-2 pt-1">
              <div className={`w-2 h-2 ${stockStatus.dot}`} />
              <span className={`text-xs font-semibold ${stockStatus.color}`}>
                {stockStatus.label}
              </span>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleAddToCart}
            disabled={stockCount === 0}
            className="w-full bg-black text-white py-4 text-sm font-bold uppercase tracking-widest hover:bg-gray-800 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
          >
            {stockCount === 0 ? "Hết hàng" : "Thêm vào giỏ hàng"}
          </button>

          {/* Trust note */}
          <p className="text-[11px] text-gray-400 text-center">
            Miễn phí vận chuyển cho đơn từ 500.000đ · Đổi trả trong 30 ngày
          </p>
        </div>
      </div>
    </main>
  );
}
