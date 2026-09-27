import { db } from "./index";
import { users, products } from "./schema";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  const userPassword = await bcrypt.hash("user123", 12);

  await db
    .insert(users)
    .values([
      {
        name: "Admin User",
        email: "admin@storefront.com",
        password: adminPassword,
        role: "ADMIN",
      },
      {
        name: "Jane Doe",
        email: "user@storefront.com",
        password: userPassword,
        role: "USER",
      },
    ])
    .onConflictDoNothing();

  // Create sample products
  await db
    .insert(products)
    .values([
      {
        name: "Premium Wireless Headphones",
        description:
          "Experience crystal-clear audio with our premium wireless headphones. Featuring active noise cancellation, 30-hour battery life, and ultra-comfortable ear cushions designed for all-day wear.",
        price: "299.99",
        category: "Electronics",
        stock: 45,
        imageUrl:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
      },
      {
        name: "Minimalist Leather Watch",
        description:
          "Elegant Swiss-inspired timepiece with genuine leather strap, sapphire crystal glass, and water resistance up to 50m. Perfect for both casual and formal occasions.",
        price: "189.99",
        category: "Accessories",
        stock: 28,
        imageUrl:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
      },
      {
        name: "Mechanical Gaming Keyboard",
        description:
          "Professional-grade mechanical keyboard with Cherry MX switches, per-key RGB backlighting, and aluminum alloy construction. Built for competitive gaming and extended typing sessions.",
        price: "149.99",
        category: "Electronics",
        stock: 62,
        imageUrl:
          "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80",
      },
      {
        name: "Classic White Sneakers",
        description:
          "Timeless white leather sneakers with cushioned insole and durable rubber outsole. A versatile wardrobe essential that pairs perfectly with any outfit.",
        price: "89.99",
        category: "Footwear",
        stock: 150,
        imageUrl:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
      },
      {
        name: "Organic Cotton T-Shirt",
        description:
          "Sustainably sourced, GOTS-certified organic cotton t-shirt. Ultra-soft, breathable fabric that gets better with every wash. Available in multiple colors.",
        price: "34.99",
        category: "Clothing",
        stock: 200,
        imageUrl:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
      },
      {
        name: "Portable Bluetooth Speaker",
        description:
          "360° surround sound in a compact, waterproof design. IPX7 rated, 24-hour playtime, and built-in mic for hands-free calls. Perfect for outdoor adventures.",
        price: "79.99",
        category: "Electronics",
        stock: 85,
        imageUrl:
          "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80",
      },
      {
        name: "Genuine Leather Backpack",
        description:
          "Handcrafted full-grain leather backpack with laptop compartment (fits up to 15\"), multiple organizer pockets, and padded shoulder straps. Ages beautifully.",
        price: "224.99",
        category: "Accessories",
        stock: 33,
        imageUrl:
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
      },
      {
        name: "4K Webcam Pro",
        description:
          "Professional 4K webcam with auto-focus, built-in noise-cancelling microphone, HDR support, and universal clip mount. Elevate your video calls and streaming.",
        price: "129.99",
        category: "Electronics",
        stock: 41,
        imageUrl:
          "https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=600&q=80",
      },
      {
        name: "Yoga Mat Premium",
        description:
          "Extra-thick 6mm non-slip yoga mat made from eco-friendly TPE material. Includes carrying strap and alignment lines. Perfect for yoga, pilates, and meditation.",
        price: "59.99",
        category: "Sports",
        stock: 97,
        imageUrl:
          "https://images.unsplash.com/photo-1601925228613-62a8e9e8a4b8?w=600&q=80",
      },
      {
        name: "Ceramic Coffee Mug Set",
        description:
          "Set of 4 hand-thrown ceramic mugs with matte glaze finish. Microwave and dishwasher safe. Each mug holds 12oz and has a comfortable handle for daily use.",
        price: "44.99",
        category: "Home & Kitchen",
        stock: 0,
        imageUrl:
          "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&q=80",
      },
      {
        name: "Slim Fit Chino Pants",
        description:
          "Modern slim-fit chino pants crafted from stretch cotton blend. Wrinkle-resistant, available in multiple colors. Perfect for smart-casual office wear.",
        price: "64.99",
        category: "Clothing",
        stock: 120,
        imageUrl:
          "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80",
      },
      {
        name: "Stainless Steel Water Bottle",
        description:
          "Double-wall vacuum insulated water bottle keeps drinks cold 24hrs or hot 12hrs. BPA-free, leak-proof lid, and wide mouth for easy filling and cleaning.",
        price: "39.99",
        category: "Sports",
        stock: 175,
        imageUrl:
          "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80",
      },
    ])
    .onConflictDoNothing();

  console.log("✅ Seed complete!");
}

seed().catch(console.error);
