import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

dotenv.config({ path: ".env.local" });

async function seed() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
      throw new Error("Thiếu MONGODB_URI trong file .env.local");
    }

    // Import models
    const { default: User } = await import("../src/models/User");
    const { default: Category } = await import("../src/models/Category");
    const { default: Product } = await import("../src/models/Product");
    const { default: Coupon } = await import("../src/models/Coupon");
    const { default: Order } = await import("../src/models/Order");

    await mongoose.connect(MONGODB_URI);
    console.log("Đã kết nối MongoDB");

    // Xóa dữ liệu cũ
    await Order.deleteMany({});
    await Coupon.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});
    await User.deleteMany({});

    console.log("Đã xóa dữ liệu cũ");

    const adminPassword = await bcrypt.hash("123456", 10);
    const userPassword = await bcrypt.hash("123456", 10);

    // Seed users
    const users = await User.insertMany([
      {
        name: "Admin Fashion Shop",
        email: "admin@example.com",
        password: adminPassword,
        provider: "credentials",
        role: "ADMIN",
        phone: "0900000001",
        avatar: "",
        address: "12 Nguyễn Huệ",
        city: "Đà Nẵng",
        district: "Hải Châu",
        isEmailVerified: true,
        emailOtp: "",
        emailOtpExpires: null,
      },
      {
        name: "Nguyễn Văn A",
        email: "user@example.com",
        password: userPassword,
        provider: "credentials",
        role: "USER",
        phone: "0900000002",
        avatar: "",
        address: "45 Lê Lợi",
        city: "Hồ Chí Minh",
        district: "Quận 1",
        isEmailVerified: true,
        emailOtp: "",
        emailOtpExpires: null,
      },
    ]);

    console.log("Đã seed users");

    // Seed categories
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

    // Seed products
    const products = await Product.insertMany([
      {
        name: "Áo thun basic trắng",
        slug: "ao-thun-basic-trang",
        description: "Áo thun basic form rộng, chất cotton mềm mại.",
        price: 199000,
        salePrice: 179000,
        category: aoThun._id,
        images: [
          "https://down-vn.img.susercontent.com/file/sg-11134282-8259w-mfxtpw5cb8jsf4@resize_w900_nl.webp",
        ],
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
        images: [
          "https://chodole.com/cdn/shop/products/CDL10_2_1024x1024.jpg?v=1586758482",
        ],
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
        images: [
          "https://cdn.vuahanghieu.com/unsafe/0x500/left/top/smart/filters:quality(90)/https://admin.vuahanghieu.com/upload/product/2024/12/ao-so-mi-dai-tay-nam-giovanni-gls0265-1lb-mau-xanh-da-troi-nhat-size-m-674e6ceb3e667-03122024092859.jpg",
        ],
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
        images: [
          "https://pos.nvncdn.com/6c3cf7-882/ps/20191004_2BsdC704fd3bMGHna2gWIVwf.jpg?v=1676232499",
        ],
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
        images: [
          "https://4men.com.vn/thumbs/2023/10/quan-jeans-den-wash-cao-gan-tag-da-form-slimfit-qj086-34675-p.jpg",
        ],
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
        images: [
          "https://product.hstatic.net/200000265901/product/dscf7105_547221375cea450598cb58d0b102afd8.jpg",
        ],
        variants: [
          { color: "Xám", size: "M", stock: 10, sku: "HDX-M" },
          { color: "Xám", size: "L", stock: 11, sku: "HDX-L" },
        ],
        isFeatured: true,
        isActive: true,
      },
    ]);

    console.log("Đã seed products");

    // Seed coupons
    await Coupon.insertMany([
      {
        code: "GIAM10",
        discountType: "PERCENT",
        discountValue: 10,
        minOrderValue: 200000,
        maxDiscount: 50000,
        usageLimit: 100,
        usedCount: 0,
        expiresAt: new Date("2026-12-31T23:59:59.000Z"),
        isActive: true,
      },
      {
        code: "SALE50K",
        discountType: "FIXED",
        discountValue: 50000,
        minOrderValue: 500000,
        usageLimit: 50,
        usedCount: 0,
        expiresAt: new Date("2026-12-31T23:59:59.000Z"),
        isActive: true,
      },
    ]);

    console.log("Đã seed coupons");

    // Seed sample order
    const sampleUser = users.find((u) => u.email === "user@example.com");
    const product1 = products.find((p) => p.slug === "ao-thun-basic-trang");
    const product2 = products.find((p) => p.slug === "hoodie-xam-basic");

    if (sampleUser && product1 && product2) {
      const item1Variant = product1.variants[0];
      const item2Variant = product2.variants[0];

      const items = [
        {
          product: product1._id,
          name: product1.name,
          image: product1.images?.[0] || "",
          color: item1Variant.color,
          size: item1Variant.size,
          quantity: 2,
          price: product1.salePrice || product1.price,
        },
        {
          product: product2._id,
          name: product2.name,
          image: product2.images?.[0] || "",
          color: item2Variant.color,
          size: item2Variant.size,
          quantity: 1,
          price: product2.salePrice || product2.price,
        },
      ];

      const totalAmount = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      const discountAmount = 50000;
      const finalAmount = totalAmount - discountAmount;

      await Order.create({
        user: sampleUser._id,
        items,
        shippingAddress: {
          fullName: "Nguyễn Văn A",
          phone: "0900000002",
          address: "45 Lê Lợi",
          city: "Hồ Chí Minh",
          district: "Quận 1",
        },
        totalAmount,
        status: "PENDING",
        couponCode: "SALE50K",
        discountAmount,
        finalAmount,
      });

      console.log("Đã seed sample order");
    }

    console.log("Seed thành công");
    console.log("Admin: admin@example.com / 123456");
    console.log("User: user@example.com / 123456");
  } catch (error) {
    console.error("Seed thất bại:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    console.log("Đã đóng kết nối MongoDB");
  }
}

seed();
