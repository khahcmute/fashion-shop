import Link from "next/link";

const categories = [
  {
    title: "Áo thun",
    slug: "ao-thun",
    image:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Hoodie",
    slug: "hoodie",
    image:
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Quần jeans",
    slug: "quan-jeans",
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1200&auto=format&fit=crop",
  },
];

export default function HomeCategories() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm uppercase tracking-wider text-gray-500">
            Danh mục nổi bật
          </p>
          <h2 className="text-3xl font-bold">Khám phá theo phong cách</h2>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/products?category=${category.slug}`}
            className="group relative overflow-hidden rounded-3xl"
          >
            <img
              src={category.image}
              alt={category.title}
              className="w-full h-96 object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <h3 className="text-2xl font-bold">{category.title}</h3>
              <p className="text-sm text-gray-100 mt-1">Xem ngay</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
