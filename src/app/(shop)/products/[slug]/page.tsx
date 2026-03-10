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
  }, [selectedProduct]);

  const variants = selectedProduct?.variants || [];

  const uniqueColors = useMemo(
    () => [...new Set(variants.map((v) => v.color))],
    [variants],
  );

  const sizesByColor = useMemo(
    () => variants.filter((v) => v.color === color).map((v) => v.size),
    [variants, color],
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

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <img
            src={
              selectedProduct.images[0] ||
              "https://placehold.co/600x800?text=No+Image"
            }
            alt={selectedProduct.name}
            className="w-full rounded-lg object-cover"
          />
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-2">
            {selectedProduct.category?.name}
          </p>
          <h1 className="text-3xl font-bold mb-4">{selectedProduct.name}</h1>
          <p className="text-gray-700 mb-6">{selectedProduct.description}</p>

          <div className="mb-4">
            <label className="block mb-2 font-medium">Màu</label>
            <select
              value={color}
              onChange={(e) => {
                const newColor = e.target.value;
                setColor(newColor);
                const firstSize =
                  variants.find((v) => v.color === newColor)?.size || "";
                setSize(firstSize);
              }}
              className="border rounded px-3 py-2 w-full"
            >
              {uniqueColors.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-medium">Size</label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="border rounded px-3 py-2 w-full"
            >
              {sizesByColor.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-medium">Số lượng</label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border rounded px-3 py-2 w-full"
            />
          </div>

          <button
            onClick={handleAddToCart}
            className="bg-black text-white px-6 py-3 rounded"
          >
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </main>
  );
}
