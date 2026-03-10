import Link from "next/link";
import Banner from "@/components/Banner";

export default function HomePage() {
  return (
    <>
      <Banner />
      <main className="p-6">
        <h1 className="text-3xl font-bold">Fashion Shop</h1>
        <p className="mt-2 mb-4">Dự án ecommerce shop thời trang</p>

        <Link
          href="/products"
          className="inline-block bg-black text-white px-4 py-2 rounded"
        >
          Xem sản phẩm
        </Link>
      </main>
    </>
  );
}
