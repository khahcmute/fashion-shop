"use client";

import { useState } from "react";
import { AdminCategory } from "@/features/adminCategory/adminCategorySlice";

type Variant = {
  color: string;
  size: string;
  stock: number;
  sku: string;
};

type Props = {
  categories: AdminCategory[];
  initialData?: {
    name: string;
    description: string;
    price: number;
    salePrice?: number;
    category: string;
    images: string[];
    variants: Variant[];
    isFeatured: boolean;
    isActive: boolean;
  };
  onSubmit: (data: any) => void | Promise<void>;
  submitting?: boolean;
};

export default function AdminProductForm({
  categories,
  initialData,
  onSubmit,
  submitting,
}: Props) {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(
    initialData?.description || "",
  );
  const [price, setPrice] = useState(initialData?.price || 0);
  const [salePrice, setSalePrice] = useState(initialData?.salePrice || 0);
  const [category, setCategory] = useState(initialData?.category || "");
  const [imageText, setImageText] = useState(
    initialData?.images?.join("\n") || "",
  );
  const [isFeatured, setIsFeatured] = useState(
    initialData?.isFeatured || false,
  );
  const [isActive, setIsActive] = useState(
    initialData?.isActive !== undefined ? initialData.isActive : true,
  );
  const [variants, setVariants] = useState<Variant[]>(
    initialData?.variants || [{ color: "", size: "", stock: 0, sku: "" }],
  );

  function handleVariantChange(
    index: number,
    field: keyof Variant,
    value: string | number,
  ) {
    const next = [...variants];
    next[index] = { ...next[index], [field]: value };
    setVariants(next);
  }

  function addVariant() {
    setVariants([...variants, { color: "", size: "", stock: 0, sku: "" }]);
  }

  function removeVariant(index: number) {
    setVariants(variants.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await onSubmit({
      name,
      description,
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : undefined,
      category,
      images: imageText
        .split("\n")
        .map((i) => i.trim())
        .filter(Boolean),
      variants,
      isFeatured,
      isActive,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 bg-white p-6 rounded-lg border"
    >
      <input
        className="w-full border rounded px-4 py-3"
        placeholder="Tên sản phẩm"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <textarea
        className="w-full border rounded px-4 py-3"
        placeholder="Mô tả"
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="grid md:grid-cols-3 gap-4">
        <input
          type="number"
          className="border rounded px-4 py-3"
          placeholder="Giá"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
        <input
          type="number"
          className="border rounded px-4 py-3"
          placeholder="Giá giảm"
          value={salePrice}
          onChange={(e) => setSalePrice(Number(e.target.value))}
        />
        <select
          className="border rounded px-4 py-3"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Chọn danh mục</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <textarea
        className="w-full border rounded px-4 py-3"
        placeholder="Mỗi dòng là 1 URL ảnh"
        rows={4}
        value={imageText}
        onChange={(e) => setImageText(e.target.value)}
      />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Biến thể</h3>
          <button
            type="button"
            onClick={addVariant}
            className="px-3 py-2 rounded border"
          >
            Thêm biến thể
          </button>
        </div>

        {variants.map((variant, index) => (
          <div
            key={index}
            className="grid md:grid-cols-5 gap-3 border rounded p-3"
          >
            <input
              className="border rounded px-3 py-2"
              placeholder="Màu"
              value={variant.color}
              onChange={(e) =>
                handleVariantChange(index, "color", e.target.value)
              }
            />
            <input
              className="border rounded px-3 py-2"
              placeholder="Size"
              value={variant.size}
              onChange={(e) =>
                handleVariantChange(index, "size", e.target.value)
              }
            />
            <input
              type="number"
              className="border rounded px-3 py-2"
              placeholder="Stock"
              value={variant.stock}
              onChange={(e) =>
                handleVariantChange(index, "stock", Number(e.target.value))
              }
            />
            <input
              className="border rounded px-3 py-2"
              placeholder="SKU"
              value={variant.sku}
              onChange={(e) =>
                handleVariantChange(index, "sku", e.target.value)
              }
            />
            <button
              type="button"
              onClick={() => removeVariant(index)}
              className="bg-red-500 text-white rounded px-3 py-2"
            >
              Xóa
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
          />
          Nổi bật
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          Đang bán
        </label>
      </div>

      <button
        className="bg-black text-white px-5 py-3 rounded"
        disabled={submitting}
      >
        {submitting ? "Đang xử lý..." : "Lưu sản phẩm"}
      </button>
    </form>
  );
}
