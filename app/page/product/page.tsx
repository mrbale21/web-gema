"use client";

import DynamicIcon from "@/components/Common/DynamicIcon";
import { NewProductDetail, NewProductImage, Product } from "@/types/newProduct";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import LayoutPage from "../layout-page";

// interface Product, ProductImage, ProductDetail sesuai model Prisma
export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productImgs, setProductImgs] = useState<NewProductImage[]>([]);
  const [productDetails, setProductDetails] = useState<NewProductDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [prodRes, imgRes, detailRes] = await Promise.all([
          fetch("/api/newprod"),
          fetch("/api/newprod/{imageId}/image"),
          fetch("/api/newprod/{detailId}/detail"),
        ]);

        if (!prodRes.ok || !imgRes.ok || !detailRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const [prodData, imgData, detailData] = await Promise.all([
          prodRes.json(),
          imgRes.json(),
          detailRes.json(),
        ]);

        setProducts(prodData);
        setProductImgs(imgData);
        setProductDetails(detailData);
      } catch (error) {
        console.error("Error fetching product data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <LayoutPage title="Loading..." titlePage="Loading" desc="Loading data">
        <div className="text-center py-20">Loading data produk...</div>
      </LayoutPage>
    );
  }

  return (
    <LayoutPage
      title="Produk Gema UMKM"
      titlePage="Produk Unggulan"
      desc="Temukan produk-produk unggulan yang inovatif, berkualitas, dan berdaya saing dari UMKM Nahdliyin."
    >
      {/* Section Penjelasan */}
      <section className="text-center max-w-4xl mx-auto mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-4 mt-20">
          {products[0]?.name || ""}
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed">
          {products[0]?.desc || ""}
        </p>
      </section>

      {/* Grid Produk */}
      <div className="py-10 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 px-15">
          {productImgs.map((item) => (
            <motion.div
              key={item.id}
              className="relative group rounded-2xl overflow-hidden shadow-lg bg-white"
              whileHover={{ scale: 1.05, rotate: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <div className="relative h-64 w-full">
                <Image
                  src={item.image || "/assets/images/default.jpg"}
                  alt={item.name || "foto"}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-green-700 mb-2">
                  {item.name}
                </h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Section Keunggulan Produk */}
      <section className="relative bg-gradient-to-r from-green-100 via-white to-green-50 py-16 rounded-2xl shadow-lg">
        {/* Grid Keunggulan */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 px-6 md:px-16">
          {productDetails.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -10, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl flex flex-col items-center text-center"
            >
              <DynamicIcon
                name={item.icon}
                className="w-10 h-10 text-primary"
              />
              <h3 className="mt-4 text-xl font-semibold text-gray-800">
                {item.title}
              </h3>
              <p className="mt-2 text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <motion.a
            href="#"
            whileHover={{ scale: 1.1 }}
            className="inline-block px-8 py-4 bg-green-600 text-white rounded-full shadow-lg font-medium"
          >
            Lihat Semua Produk
          </motion.a>
        </div>
      </section>
    </LayoutPage>
  );
}
