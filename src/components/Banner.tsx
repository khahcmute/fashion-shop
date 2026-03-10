import Link from "next/link";

export default function Banner() {
  return (
    <section className="bg-gradient-to-r from-black to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <p className="uppercase tracking-widest text-sm text-gray-300 mb-3">
            Fashion Collection 2026
          </p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            Phong cách tối giản, hiện đại và dễ phối mỗi ngày
          </h1>
          <p className="text-gray-200 mb-6">
            Khám phá bộ sưu tập áo thun, hoodie, sơ mi và quần jeans dành cho
            phong cách trẻ trung, năng động.
          </p>

          <div className="flex gap-3">
            <Link
              href="/products"
              className="bg-white text-black px-6 py-3 rounded-full font-medium"
            >
              Mua ngay
            </Link>
            <Link
              href="/products?category=ao-thun"
              className="border border-white px-6 py-3 rounded-full font-medium"
            >
              Xem áo thun
            </Link>
          </div>
        </div>

        <div className="hidden md:flex justify-end">
          <img
            src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200&auto=format&fit=crop"
            alt="Banner thời trang"
            className="w-full max-w-md h-[420px] object-cover rounded-3xl"
          />
        </div>
      </div>
    </section>
  );
}
