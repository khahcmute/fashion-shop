"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  changePassword,
  clearAccountMessages,
  fetchAccount,
  updateAccount,
} from "@/features/account/accountSlice";

export default function AccountPage() {
  const dispatch = useAppDispatch();
  const { profile, loading, error, successMessage } = useAppSelector(
    (state) => state.account,
  );

  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
    avatar: "",
    address: "",
    city: "",
    district: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    dispatch(fetchAccount());

    return () => {
      dispatch(clearAccountMessages());
    };
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setProfileForm({
        name: profile.name || "",
        phone: profile.phone || "",
        avatar: profile.avatar || "",
        address: profile.address || "",
        city: profile.city || "",
        district: profile.district || "",
      });
    }
  }, [profile]);

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    await dispatch(updateAccount(profileForm));
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    await dispatch(changePassword(passwordForm));
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
    });
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-wider text-gray-500">
          Tài khoản
        </p>
        <h1 className="text-3xl font-bold">Quản lý tài khoản</h1>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {successMessage && (
        <p className="text-green-600 mb-4">{successMessage}</p>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        <form
          onSubmit={handleProfileSubmit}
          className="bg-white border rounded-3xl p-6 space-y-4"
        >
          <h2 className="text-xl font-semibold">Thông tin cá nhân</h2>

          {profileForm.avatar && (
            <img
              src={profileForm.avatar}
              alt="Avatar"
              className="w-20 h-20 rounded-full object-cover border"
            />
          )}

          <input
            className="w-full border rounded px-4 py-3"
            placeholder="Họ tên"
            value={profileForm.name}
            onChange={(e) =>
              setProfileForm({ ...profileForm, name: e.target.value })
            }
          />

          <input
            className="w-full border rounded px-4 py-3"
            placeholder="Số điện thoại"
            value={profileForm.phone}
            onChange={(e) =>
              setProfileForm({ ...profileForm, phone: e.target.value })
            }
          />

          <input
            className="w-full border rounded px-4 py-3"
            placeholder="URL avatar"
            value={profileForm.avatar}
            onChange={(e) =>
              setProfileForm({ ...profileForm, avatar: e.target.value })
            }
          />

          <input
            className="w-full border rounded px-4 py-3"
            placeholder="Địa chỉ"
            value={profileForm.address}
            onChange={(e) =>
              setProfileForm({ ...profileForm, address: e.target.value })
            }
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              className="w-full border rounded px-4 py-3"
              placeholder="Tỉnh/Thành phố"
              value={profileForm.city}
              onChange={(e) =>
                setProfileForm({ ...profileForm, city: e.target.value })
              }
            />

            <input
              className="w-full border rounded px-4 py-3"
              placeholder="Quận/Huyện"
              value={profileForm.district}
              onChange={(e) =>
                setProfileForm({ ...profileForm, district: e.target.value })
              }
            />
          </div>

          <button
            disabled={loading}
            className="bg-black text-white px-5 py-3 rounded-full"
          >
            {loading ? "Đang lưu..." : "Lưu thông tin"}
          </button>
        </form>

        <form
          onSubmit={handlePasswordSubmit}
          className="bg-white border rounded-3xl p-6 space-y-4"
        >
          <h2 className="text-xl font-semibold">Đổi mật khẩu</h2>

          <input
            type="password"
            className="w-full border rounded px-4 py-3"
            placeholder="Mật khẩu hiện tại"
            value={passwordForm.currentPassword}
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,
                currentPassword: e.target.value,
              })
            }
          />

          <input
            type="password"
            className="w-full border rounded px-4 py-3"
            placeholder="Mật khẩu mới"
            value={passwordForm.newPassword}
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,
                newPassword: e.target.value,
              })
            }
          />

          <button
            disabled={loading}
            className="bg-black text-white px-5 py-3 rounded-full"
          >
            {loading ? "Đang đổi..." : "Đổi mật khẩu"}
          </button>
        </form>
      </div>
    </main>
  );
}
