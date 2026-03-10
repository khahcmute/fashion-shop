"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAdminCategories } from "@/features/adminCategory/adminCategorySlice";
import { createAdminProduct } from "@/features/adminProduct/adminProductSlice";
import AdminProductForm from "@/components/admin/AdminProductForm";

export default function AdminNewProductPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { categories } = useAppSelector((state) => state.adminCategory);
  const { loading, error } = useAppSelector((state) => state.adminProduct);

  useEffect(() => {
    dispatch(fetchAdminCategories());
  }, [dispatch]);

  async function handleSubmit(data: any) {
    const result = await dispatch(createAdminProduct(data));
    if (createAdminProduct.fulfilled.match(result)) {
      router.push("/admin/products");
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Thêm sản phẩm</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <AdminProductForm
        categories={categories}
        onSubmit={handleSubmit}
        submitting={loading}
      />
    </div>
  );
}
