import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

dotenv.config({ path: ".env.local" });

async function seed() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;

    console.log("ENV:", MONGODB_URI);

    if (!MONGODB_URI) {
      throw new Error("Thiếu MONGODB_URI trong file .env.local");
    }

    const { default: User } = await import("../src/models/User");
    const { default: Category } = await import("../src/models/Category");
    const { default: Product } = await import("../src/models/Product");

    await mongoose.connect(MONGODB_URI);
    console.log("Đã kết nối MongoDB");

    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});

    console.log("Đã xóa dữ liệu cũ");

    const adminPassword = await bcrypt.hash("123456", 10);
    const userPassword = await bcrypt.hash("123456", 10);

    await User.insertMany([
      {
        name: "Admin Fashion Shop",
        email: "admin@example.com",
        password: adminPassword,
        role: "ADMIN",
      },
      {
        name: "Nguyen Van A",
        email: "user@example.com",
        password: userPassword,
        role: "USER",
      },
    ]);

    const categories = await Category.insertMany([
      { name: "Áo thun", slug: "ao-thun" },
      { name: "Áo sơ mi", slug: "ao-so-mi" },
      { name: "Quần jeans", slug: "quan-jeans" },
      { name: "Hoodie", slug: "hoodie" },
    ]);

    const aoThun = categories.find((c) => c.slug === "ao-thun")!;
    const aoSoMi = categories.find((c) => c.slug === "ao-so-mi")!;
    const quanJeans = categories.find((c) => c.slug === "quan-jeans")!;
    const hoodie = categories.find((c) => c.slug === "hoodie")!;

    await Product.insertMany([
      {
        name: "Áo thun basic trắng",
        slug: "ao-thun-basic-trang",
        description: "Áo thun basic form rộng, chất cotton mềm mại.",
        price: 199000,
        salePrice: 179000,
        category: aoThun._id,
        images: ["https://placehold.co/600x800?text=Ao+thun+trang"],
        variants: [
          { color: "Trắng", size: "M", stock: 10, sku: "ATBT-M-W" },
          { color: "Trắng", size: "L", stock: 8, sku: "ATBT-L-W" },
        ],
        isFeatured: true,
        isActive: true,
      },
      {
        name: "Áo thun basic đen",
        slug: "ao-thun-basic-den",
        description: "Áo thun basic màu đen, dễ phối đồ.",
        price: 199000,
        category: aoThun._id,
        images: ["https://placehold.co/600x800?text=Ao+thun+den"],
        variants: [
          { color: "Đen", size: "M", stock: 12, sku: "ATBD-M-B" },
          { color: "Đen", size: "L", stock: 9, sku: "ATBD-L-B" },
        ],
        isFeatured: true,
        isActive: true,
      },
      {
        name: "Áo sơ mi xanh nhạt",
        slug: "ao-so-mi-xanh-nhat",
        description: "Áo sơ mi thanh lịch, phù hợp đi làm.",
        price: 349000,
        salePrice: 299000,
        category: aoSoMi._id,
        images: ["https://placehold.co/600x800?text=Ao+so+mi"],
        variants: [
          { color: "Xanh nhạt", size: "M", stock: 5, sku: "ASM-M-XN" },
          { color: "Xanh nhạt", size: "L", stock: 6, sku: "ASM-L-XN" },
        ],
        isFeatured: false,
        isActive: true,
      },
      {
        name: "Quần jeans xanh",
        slug: "quan-jeans-xanh",
        description: "Quần jeans trẻ trung, form slim fit.",
        price: 459000,
        category: quanJeans._id,
        images: ["https://placehold.co/600x800?text=Quan+jeans"],
        variants: [
          { color: "Xanh", size: "30", stock: 7, sku: "QJX-30" },
          { color: "Xanh", size: "32", stock: 9, sku: "QJX-32" },
        ],
        isFeatured: true,
        isActive: true,
      },
      {
        name: "Quần jeans đen",
        slug: "quan-jeans-den",
        description: "Quần jeans đen dễ phối với nhiều outfit.",
        price: 469000,
        category: quanJeans._id,
        images: ["https://placehold.co/600x800?text=Quan+jeans+den"],
        variants: [
          { color: "Đen", size: "30", stock: 6, sku: "QJD-30" },
          { color: "Đen", size: "32", stock: 8, sku: "QJD-32" },
        ],
        isFeatured: false,
        isActive: true,
      },
      {
        name: "Hoodie xám basic",
        slug: "hoodie-xam-basic",
        description: "Hoodie nỉ xám basic, ấm áp và dễ mặc.",
        price: 399000,
        salePrice: 359000,
        category: hoodie._id,
        images: ["https://placehold.co/600x800?text=Hoodie+xam"],
        variants: [
          { color: "Xám", size: "M", stock: 10, sku: "HDX-M" },
          { color: "Xám", size: "L", stock: 11, sku: "HDX-L" },
        ],
        isFeatured: true,
        isActive: true,
      },
    ]);

    console.log("Seed thành công");
    console.log("Admin: admin@example.com / 123456");
    console.log("User: user@example.com / 123456");
  } catch (error) {
    console.error("Seed thất bại:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

seed();
