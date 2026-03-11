"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchMyOrders } from "@/features/order/orderSlice";

function getStatusLabel(status: string) {
  switch (status) {
    case "PENDING":
      return "Chờ xác nhận";
    case "CONFIRMED":
      return "Đã xác nhận";
    case "SHIPPING":
      return "Đang giao";
    case "DELIVERED":
      return "Đã giao";
    case "CANCELLED":
      return "Đã hủy";
    default:
      return status;
  }
}

export default function OrdersPage() {
  const dispatch = useAppDispatch();
  const { orders, loading, error } = useAppSelector((state) => state.order);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchMyOrders());
    }
  }, [dispatch, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-4">Đơn hàng của tôi</h1>
        <p className="mb-4">Bạn cần đăng nhập để xem đơn hàng.</p>
        <Link
          href="/login"
          className="inline-block bg-black text-white px-5 py-3 rounded-full"
        >
          Đăng nhập
        </Link>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-12">Đang tải đơn hàng...</main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-sm uppercase tracking-wider text-gray-500">
            Tài khoản
          </p>
          <h1 className="text-3xl font-bold">Đơn hàng của tôi</h1>
        </div>

        <Link
          href="/products"
          className="border px-4 py-2 rounded-full hover:bg-gray-50"
        >
          Tiếp tục mua sắm
        </Link>
      </div>

      {error && <p className="text-red-500 mb-6">{error}</p>}

      {orders.length === 0 ? (
        <div className="bg-white border rounded-3xl p-10 text-center">
          <h2 className="text-2xl font-semibold mb-3">
            Bạn chưa có đơn hàng nào
          </h2>
          <p className="text-gray-600 mb-6">
            Hãy khám phá các sản phẩm mới và tạo đơn hàng đầu tiên.
          </p>
          <Link
            href="/products"
            className="inline-block bg-black text-white px-6 py-3 rounded-full"
          >
            Khám phá sản phẩm
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white border rounded-3xl p-6 shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
                <div>
                  <p className="font-semibold">Mã đơn: {order._id}</p>
                  <p className="text-sm text-gray-500">
                    Trạng thái: {getStatusLabel(order.status)}
                  </p>
                </div>

                <div className="text-xl font-bold">
                  {order.totalAmount.toLocaleString("vi-VN")}đ
                </div>
              </div>

              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={`${order._id}-${index}`}
                    className="flex gap-4 items-center border-t pt-4"
                  >
                    <img
                      src={
                        item.image ||
                        "https://placehold.co/120x140?text=No+Image"
                      }
                      alt={item.name}
                      className="w-20 h-24 object-cover rounded-xl"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        {item.color} / {item.size}
                      </p>
                      <p className="text-sm text-gray-600">
                        Số lượng: {item.quantity}
                      </p>
                    </div>
                    <div className="font-semibold">
                      {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t text-sm text-gray-600">
                <p>
                  Người nhận: {order.shippingAddress.fullName} -{" "}
                  {order.shippingAddress.phone}
                </p>
                <p>
                  Địa chỉ: {order.shippingAddress.address},{" "}
                  {order.shippingAddress.district}, {order.shippingAddress.city}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
