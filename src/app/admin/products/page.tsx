"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  deleteAdminProduct,
  fetchAdminProducts,
} from "@/features/adminProduct/adminProductSlice";

export default function AdminProductsPage() {
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector(
    (state) => state.adminProduct,
  );

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Quản lý sản phẩm</h1>
        <Link
          href="/admin/products/new"
          className="bg-black text-white px-4 py-2 rounded"
        >
          Thêm sản phẩm
        </Link>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading && <p>Đang tải...</p>}

      <div className="border rounded-lg overflow-hidden bg-white">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3">Tên</th>
              <th className="text-left p-3">Danh mục</th>
              <th className="text-left p-3">Giá</th>
              <th className="text-left p-3">Trạng thái</th>
              <th className="text-left p-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-t">
                <td className="p-3">{product.name}</td>
                <td className="p-3">{product.category?.name}</td>
                <td className="p-3">
                  {product.price.toLocaleString("vi-VN")}đ
                </td>
                <td className="p-3">{product.isActive ? "Đang bán" : "Ẩn"}</td>
                <td className="p-3 flex gap-2">
                  <Link
                    href={`/admin/products/${product._id}/edit`}
                    className="px-3 py-1 rounded bg-yellow-500 text-white"
                  >
                    Sửa
                  </Link>
                  <button
                    onClick={() => dispatch(deleteAdminProduct(product._id))}
                    className="px-3 py-1 rounded bg-red-500 text-white"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
