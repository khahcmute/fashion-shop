import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white mt-16">
      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-2xl font-bold mb-3">Fashion Shop</h3>
          <p className="text-gray-300 text-sm leading-6">
            Cửa hàng thời trang hiện đại dành cho phong cách trẻ trung, tối giản
            và dễ ứng dụng mỗi ngày.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Mua sắm</h4>
          <div className="space-y-2 text-sm text-gray-300">
            <Link href="/products" className="block hover:text-white">
              Tất cả sản phẩm
            </Link>
            <Link
              href="/products?category=ao-thun"
              className="block hover:text-white"
            >
              Áo thun
            </Link>
            <Link
              href="/products?category=hoodie"
              className="block hover:text-white"
            >
              Hoodie
            </Link>
            <Link
              href="/products?category=quan-jeans"
              className="block hover:text-white"
            >
              Quần jeans
            </Link>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Hỗ trợ</h4>
          <div className="space-y-2 text-sm text-gray-300">
            <p>Chính sách đổi trả</p>
            <p>Chính sách giao hàng</p>
            <p>Hướng dẫn mua hàng</p>
            <p>Liên hệ hỗ trợ</p>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Liên hệ</h4>
          <div className="space-y-2 text-sm text-gray-300">
            <p>Email: support@fashionshop.com</p>
            <p>Hotline: 0900 000 000</p>
            <p>Địa chỉ: Quảng Ngãi, Việt Nam</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 text-center text-sm text-gray-400 py-4">
        © 2026 Fashion Shop. All rights reserved.
      </div>
    </footer>
  );
}
