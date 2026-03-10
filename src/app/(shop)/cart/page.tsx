"use client";

import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchCart,
  removeCartItem,
  updateCartItem,
} from "@/features/cart/cartSlice";
import Link from "next/link";

export default function CartPage() {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const total = useMemo(() => {
    return items.reduce((sum, item) => {
      return sum + item.priceAtAddedTime * item.quantity;
    }, 0);
  }, [items]);

  if (loading) {
    return <main className="p-6">Đang tải giỏ hàng...</main>;
  }

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Giỏ hàng</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {items.length === 0 ? (
        <p>Giỏ hàng đang trống.</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="border rounded-lg p-4 flex gap-4 items-center"
            >
              <img
                src={
                  item.product.images[0] ||
                  "https://placehold.co/200x250?text=No+Image"
                }
                alt={item.product.name}
                className="w-24 h-32 object-cover rounded"
              />

              <div className="flex-1">
                <h3 className="font-semibold text-lg">{item.product.name}</h3>
                <p>Màu: {item.color}</p>
                <p>Size: {item.size}</p>
                <p>Giá: {item.priceAtAddedTime.toLocaleString("vi-VN")}đ</p>

                <div className="mt-2">
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      dispatch(
                        updateCartItem({
                          id: item._id,
                          quantity: Number(e.target.value),
                        }),
                      )
                    }
                    className="border px-3 py-1 rounded w-24"
                  />
                </div>
              </div>

              <button
                onClick={() => dispatch(removeCartItem(item._id))}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Xóa
              </button>
            </div>
          ))}

          <div className="pt-4 border-t">
            <h2 className="text-2xl font-bold">
              Tổng: {total.toLocaleString("vi-VN")}đ
            </h2>
          </div>
        </div>
      )}
      <div className="pt-4 border-t flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          Tổng: {total.toLocaleString("vi-VN")}đ
        </h2>

        <Link
          href="/checkout"
          className="bg-black text-white px-6 py-3 rounded"
        >
          Tiến hành thanh toán
        </Link>
      </div>
    </main>
  );
}
