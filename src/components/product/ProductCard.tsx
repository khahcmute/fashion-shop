import Link from "next/link";
import { Product } from "@/features/product/productSlice";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  return (
    <div className="border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition bg-white">
      <div className="relative">
        <img
          src={
            product.images[0] || "https://placehold.co/600x800?text=No+Image"
          }
          alt={product.name}
          className="w-full h-80 object-cover"
        />

        {product.isFeatured && (
          <span className="absolute top-3 left-3 bg-black text-white text-xs px-3 py-1 rounded-full">
            Nổi bật
          </span>
        )}
      </div>

      <div className="p-4">
        <p className="text-sm text-gray-500 mb-1">{product.category?.name}</p>

        <h3 className="text-lg font-semibold mb-2 line-clamp-2">
          {product.name}
        </h3>

        <div className="mb-3">
          {product.salePrice ? (
            <div className="flex items-center gap-2">
              <span className="text-red-500 font-bold text-lg">
                {product.salePrice.toLocaleString("vi-VN")}đ
              </span>
              <span className="text-gray-400 line-through text-sm">
                {product.price.toLocaleString("vi-VN")}đ
              </span>
            </div>
          ) : (
            <span className="font-bold text-lg">
              {product.price.toLocaleString("vi-VN")}đ
            </span>
          )}
        </div>

        <Link
          href={`/products/${product.slug}`}
          className="inline-block bg-black text-white px-4 py-2 rounded-full"
        >
          Xem chi tiết
        </Link>
      </div>
    </div>
  );
}
