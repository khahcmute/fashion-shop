import Link from "next/link";

export default function HomeCTA() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="rounded-[32px] bg-black text-white px-8 py-14 text-center">
        <p className="uppercase tracking-widest text-sm text-gray-300 mb-3">
          New Season
        </p>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Sẵn sàng làm mới tủ đồ của bạn?
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto mb-8">
          Khám phá những item basic dễ mặc, dễ phối và phù hợp cho nhịp sống
          năng động mỗi ngày.
        </p>
        <Link
          href="/products"
          className="inline-block bg-white text-black px-6 py-3 rounded-full font-medium"
        >
          Mua sắm ngay
        </Link>
      </div>
    </section>
  );
}
