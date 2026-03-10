"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAdminCategories } from "@/features/adminCategory/adminCategorySlice";
import {
  clearSelectedAdminProduct,
  fetchAdminProductById,
  updateAdminProduct,
} from "@/features/adminProduct/adminProductSlice";
import AdminProductForm from "@/components/admin/AdminProductForm";

type Props = {
  params: Promise<{ id: string }>;
};

export default function AdminEditProductPage({ params }: Props) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { categories } = useAppSelector((state) => state.adminCategory);
  const { selectedProduct, loading, error } = useAppSelector(
    (state) => state.adminProduct,
  );

  useEffect(() => {
    dispatch(fetchAdminCategories());

    let mounted = true;
    async function load() {
      const { id } = await params;
      if (mounted) dispatch(fetchAdminProductById(id));
    }
    load();

    return () => {
      mounted = false;
      dispatch(clearSelectedAdminProduct());
    };
  }, [dispatch, params]);

  async function handleSubmit(data: any) {
    if (!selectedProduct) return;

    const result = await dispatch(
      updateAdminProduct({
        id: selectedProduct._id,
        payload: data,
      }),
    );

    if (updateAdminProduct.fulfilled.match(result)) {
      router.push("/admin/products");
    }
  }

  if (!selectedProduct) {
    return <div>Đang tải dữ liệu sản phẩm...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Sửa sản phẩm</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <AdminProductForm
        categories={categories}
        initialData={{
          name: selectedProduct.name,
          description: selectedProduct.description,
          price: selectedProduct.price,
          salePrice: selectedProduct.salePrice,
          category: selectedProduct.category?._id,
          images: selectedProduct.images,
          variants: selectedProduct.variants,
          isFeatured: selectedProduct.isFeatured,
          isActive: selectedProduct.isActive,
        }}
        onSubmit={handleSubmit}
        submitting={loading}
      />
    </div>
  );
}
