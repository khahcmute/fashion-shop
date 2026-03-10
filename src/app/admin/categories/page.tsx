"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  createAdminCategory,
  deleteAdminCategory,
  fetchAdminCategories,
  updateAdminCategory,
} from "@/features/adminCategory/adminCategorySlice";

export default function AdminCategoriesPage() {
  const dispatch = useAppDispatch();
  const { categories, loading, error } = useAppSelector(
    (state) => state.adminCategory,
  );

  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAdminCategories());
  }, [dispatch]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim()) return;

    if (editingId) {
      await dispatch(updateAdminCategory({ id: editingId, name }));
      setEditingId(null);
    } else {
      await dispatch(createAdminCategory(name));
    }

    setName("");
  }

  function handleEdit(id: string, currentName: string) {
    setEditingId(id);
    setName(currentName);
  }

  function handleCancel() {
    setEditingId(null);
    setName("");
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Quản lý danh mục</h1>

      <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nhập tên danh mục..."
          className="border rounded px-4 py-2 w-full max-w-md"
        />
        <button className="bg-black text-white px-4 py-2 rounded">
          {editingId ? "Cập nhật" : "Thêm"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={handleCancel}
            className="border px-4 py-2 rounded"
          >
            Hủy
          </button>
        )}
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading && <p>Đang tải...</p>}

      <div className="border rounded-lg overflow-hidden bg-white">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3">Tên</th>
              <th className="text-left p-3">Slug</th>
              <th className="text-left p-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id} className="border-t">
                <td className="p-3">{category.name}</td>
                <td className="p-3">{category.slug}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(category._id, category.name)}
                    className="px-3 py-1 rounded bg-yellow-500 text-white"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => dispatch(deleteAdminCategory(category._id))}
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
