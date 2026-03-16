import { Suspense } from "react";
import ProductsPageClient from "./ProductsPageClient";

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-[60vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-9 h-9 border-2 border-gray-200 border-t-black animate-spin" />
            <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
              Đang tải...
            </p>
          </div>
        </main>
      }
    >
      <ProductsPageClient />
    </Suspense>
  );
}
