import Link from "next/link";
import { Product } from "@/features/product/productSlice";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  return (
    <div className="border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition bg-white">
      <img
        src={product.images[0] || "https://placehold.co/600x800?text=No+Image"}
        alt={product.name}
        className="w-full h-72 object-cover"
      />

      <div className="p-4">
        <p className="text-sm text-gray-500 mb-1">{product.category?.name}</p>

        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>

        <div className="mb-3">
          {product.salePrice ? (
            <div className="flex items-center gap-2">
              <span className="text-red-500 font-bold">
                {product.salePrice.toLocaleString("vi-VN")}đ
              </span>
              <span className="text-gray-400 line-through text-sm">
                {product.price.toLocaleString("vi-VN")}đ
              </span>
            </div>
          ) : (
            <span className="font-bold">
              {product.price.toLocaleString("vi-VN")}đ
            </span>
          )}
        </div>

        <Link
          href={`/products/${product.slug}`}
          className="inline-block bg-black text-white px-4 py-2 rounded"
        >
          Xem chi tiết
        </Link>
      </div>
    </div>
  );
}
