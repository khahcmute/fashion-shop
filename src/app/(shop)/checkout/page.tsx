"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCart } from "@/features/cart/cartSlice";
import { createOrder } from "@/features/order/orderSlice";

export default function CheckoutPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { items } = useAppSelector((state) => state.cart);
  const { loading, error } = useAppSelector((state) => state.order);
  const [couponCode, setCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    district: "",
  });

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const total = useMemo(() => {
    return items.reduce((sum, item) => {
      return sum + item.priceAtAddedTime * item.quantity;
    }, 0);
  }, [items]);

  const finalTotal = Math.max(total - discountAmount, 0);
  async function handleApplyCoupon() {
    setCouponMessage("");

    const res = await fetch("/api/coupons/validate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: couponCode,
        totalAmount: total,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      setDiscountAmount(0);
      setCouponMessage(result.message || "Mã giảm giá không hợp lệ");
      return;
    }

    setDiscountAmount(result.data.discountAmount || 0);
    setCouponMessage(
      `Áp mã thành công: giảm ${result.data.discountAmount.toLocaleString("vi-VN")}đ`,
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = await dispatch(
      createOrder({
        ...form,
        couponCode,
      }),
    );

    if (createOrder.fulfilled.match(result)) {
      router.push("/orders");
    }
  }

  if (!items.length) {
    return <main className="p-6">Giỏ hàng đang trống.</main>;
  }

  return (
    <main className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-8">
      <div>
        <h1 className="text-3xl font-bold mb-6">Thanh toán</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Họ và tên"
            className="w-full border rounded px-4 py-3"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          />
          <input
            type="text"
            placeholder="Số điện thoại"
            className="w-full border rounded px-4 py-3"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <input
            type="text"
            placeholder="Địa chỉ"
            className="w-full border rounded px-4 py-3"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          <input
            type="text"
            placeholder="Tỉnh/Thành phố"
            className="w-full border rounded px-4 py-3"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />
          <input
            type="text"
            placeholder="Quận/Huyện"
            className="w-full border rounded px-4 py-3"
            value={form.district}
            onChange={(e) => setForm({ ...form, district: e.target.value })}
          />

          {error && <p className="text-red-500">{error}</p>}
          <div className="space-y-3">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Nhập mã giảm giá"
                className="w-full border rounded px-4 py-3"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                className="border px-4 py-3 rounded"
              >
                Áp dụng
              </button>
            </div>

            {couponMessage && (
              <p className="text-sm text-gray-700">{couponMessage}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-6 py-3 rounded"
          >
            {loading ? "Đang tạo đơn..." : "Đặt hàng"}
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Đơn hàng của bạn</h2>

        <div className="space-y-4">
          {items.map((item) => (
            <div key={item._id} className="border rounded p-4 flex gap-4">
              <img
                src={
                  item.product.images[0] ||
                  "https://placehold.co/120x160?text=No+Image"
                }
                alt={item.product.name}
                className="w-20 h-28 object-cover rounded"
              />
              <div>
                <h3 className="font-semibold">{item.product.name}</h3>
                <p>Màu: {item.color}</p>
                <p>Size: {item.size}</p>
                <p>Số lượng: {item.quantity}</p>
                <p>Giá: {item.priceAtAddedTime.toLocaleString("vi-VN")}đ</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t pt-4 space-y-2">
          <div className="flex justify-between">
            <span>Tạm tính</span>
            <span>{total.toLocaleString("vi-VN")}đ</span>
          </div>

          <div className="flex justify-between text-green-600">
            <span>Giảm giá</span>
            <span>-{discountAmount.toLocaleString("vi-VN")}đ</span>
          </div>

          <div className="flex justify-between text-2xl font-bold pt-2 border-t">
            <span>Tổng thanh toán</span>
            <span>{finalTotal.toLocaleString("vi-VN")}đ</span>
          </div>
        </div>
      </div>
    </main>
  );
}
