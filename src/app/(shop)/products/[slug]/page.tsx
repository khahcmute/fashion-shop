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
      if (mounted) {
        dispatch(fetchProductBySlug(slug));
      }
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

  if (loading) return <main className="p-6">Đang tải...</main>;
  if (error) return <main className="p-6 text-red-500">{error}</main>;
  if (!selectedProduct)
    return <main className="p-6">Không tìm thấy sản phẩm.</main>;

  const displayPrice =
    selectedProduct.salePrice &&
    selectedProduct.salePrice < selectedProduct.price
      ? selectedProduct.salePrice
      : selectedProduct.price;

  const hasSale =
    selectedProduct.salePrice &&
    selectedProduct.salePrice < selectedProduct.price;

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 md:px-6">
      <div className="grid lg:grid-cols-2 gap-10 items-start">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-3xl bg-gray-100 border">
            <img
              src={
                selectedImage || "https://placehold.co/800x1000?text=No+Image"
              }
              alt={selectedProduct.name}
              className="w-full h-[420px] md:h-[560px] object-cover transition duration-500 hover:scale-105"
            />
          </div>

          {images.length > 1 && (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
              {images.map((image, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedImage(image)}
                  className={`overflow-hidden rounded-2xl border-2 transition ${
                    selectedImage === image
                      ? "border-black shadow-md"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${selectedProduct.name}-${index}`}
                    className="w-full h-24 object-cover hover:scale-105 transition duration-300"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-24">
          <p className="text-sm uppercase tracking-wide text-gray-500 mb-2">
            {selectedProduct.category?.name || "Danh mục"}
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {selectedProduct.name}
          </h1>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-bold text-red-500">
              {displayPrice.toLocaleString("vi-VN")}đ
            </span>

            {hasSale && (
              <span className="text-lg text-gray-400 line-through">
                {selectedProduct.price.toLocaleString("vi-VN")}đ
              </span>
            )}
          </div>

          <p className="text-gray-600 leading-7 mb-8">
            {selectedProduct.description}
          </p>

          <div className="space-y-5 rounded-3xl border bg-white p-5 shadow-sm">
            <div>
              <label className="block mb-2 font-medium text-gray-800">
                Màu sắc
              </label>
              <select
                value={color}
                onChange={(e) => {
                  const newColor = e.target.value;
                  setColor(newColor);
                  const firstSize =
                    variants.find((v) => v.color === newColor)?.size || "";
                  setSize(firstSize);
                }}
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
              >
                {uniqueColors.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-800">
                Size
              </label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
              >
                {sizesByColor.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-800">
                Số lượng
              </label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, Number(e.target.value)))
                }
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
              />
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3 text-sm">
              <span className="text-gray-500">Tồn kho</span>
              <span className="font-semibold text-gray-900">
                {selectedVariant?.stock ?? 0} sản phẩm
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full rounded-2xl bg-black px-6 py-4 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-gray-900"
            >
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
