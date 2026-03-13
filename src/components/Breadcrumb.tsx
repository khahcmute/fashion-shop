"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname } from "next/navigation";

const labelMap: Record<string, string> = {
  admin: "Admin",
  products: "Sản phẩm",
  categories: "Danh mục",
  orders: "Đơn hàng",
  cart: "Giỏ hàng",
  checkout: "Thanh toán",
  login: "Đăng nhập",
  register: "Đăng ký",
  account: "Tài khoản",
  "verify-email": "Xác thực email",
  new: "Thêm mới",
  edit: "Chỉnh sửa",
};

function formatSegment(segment: string) {
  if (labelMap[segment]) return labelMap[segment];

  return decodeURIComponent(segment)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function Breadcrumb() {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);

    const items = [
      {
        label: "Trang chủ",
        href: "/",
      },
    ];

    let currentPath = "";

    segments.forEach((segment) => {
      currentPath += `/${segment}`;

      items.push({
        label: formatSegment(segment),
        href: currentPath,
      });
    });

    return items;
  }, [pathname]);

  // Không hiện breadcrumb ở trang chủ
  if (pathname === "/") return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="max-w-7xl mx-auto px-6 py-4 text-sm"
    >
      <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <li key={item.href} className="flex items-center gap-2">
              {isLast ? (
                <span className="text-gray-900 font-medium">{item.label}</span>
              ) : (
                <Link href={item.href} className="hover:text-black">
                  {item.label}
                </Link>
              )}

              {!isLast && <span>/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
