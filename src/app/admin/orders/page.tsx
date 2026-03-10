"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchAdminOrders,
  updateAdminOrderStatus,
} from "@/features/adminOrder/adminOrderSlice";

const statusOptions = [
  "PENDING",
  "CONFIRMED",
  "SHIPPING",
  "DELIVERED",
  "CANCELLED",
] as const;

export default function AdminOrdersPage() {
  const dispatch = useAppDispatch();
  const { orders, loading, error } = useAppSelector(
    (state) => state.adminOrder,
  );

  useEffect(() => {
    dispatch(fetchAdminOrders());
  }, [dispatch]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Quản lý đơn hàng</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading && <p>Đang tải...</p>}

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="bg-white border rounded-lg p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
              <div>
                <p className="font-semibold">Mã đơn: {order._id}</p>
                <p className="text-sm text-gray-600">
                  Khách: {order.user?.name || "Không rõ"} -{" "}
                  {order.user?.email || ""}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-bold">
                  {order.totalAmount.toLocaleString("vi-VN")}đ
                </span>

                <select
                  value={order.status}
                  onChange={(e) =>
                    dispatch(
                      updateAdminOrderStatus({
                        id: order._id,
                        status: e.target.value as any,
                      }),
                    )
                  }
                  className="border rounded px-3 py-2"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-sm text-gray-700 mb-3">
              <p>
                Người nhận: {order.shippingAddress.fullName} -{" "}
                {order.shippingAddress.phone}
              </p>
              <p>
                Địa chỉ: {order.shippingAddress.address},{" "}
                {order.shippingAddress.district}, {order.shippingAddress.city}
              </p>
            </div>

            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 border-t pt-2"
                >
                  <img
                    src={
                      item.image || "https://placehold.co/80x100?text=No+Image"
                    }
                    alt={item.name}
                    className="w-14 h-16 object-cover rounded"
                  />
                  <div className="text-sm">
                    <p className="font-medium">{item.name}</p>
                    <p>
                      {item.color} / {item.size} / x{item.quantity}
                    </p>
                    <p>{item.price.toLocaleString("vi-VN")}đ</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
