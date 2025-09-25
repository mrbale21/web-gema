"use client";

import TextHeader from "../Common/TextHeader";
import { useEffect, useState } from "react";
import Loading from "../Common/Loading";
import { Product } from "@/types/products";

export default function ProductSection() {
  const [product, setProduct] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products`)
      .then((res) => res.json())
      .then((json) => {
        let data: Product[] = Array.isArray(json) ? json : [json];
        const activeProducts = data.filter((item) => item.isActive === true);
        setProduct(activeProducts);
      })
      .catch((err) => console.error("Error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading type="spinner" text="Memuat Produk..." />;
  if (!product || product.length === 0)
    return <Loading type="spinner" text="Data Tidak Ditemukan!" />;

  return (
    <div className="bg-white px-4 sm:px-6 md:px-10 pb-16">
      {/* Header */}
      <TextHeader
        title="Produk Unggulan | Gema Nahdliyin"
        desc="Berbagai produk inovatif yang dirancang untuk mendukung penguatan ekonomi, pemberdayaan UMKM, serta pengembangan ekosistem digital berbasis komunitas."
      />

      {/* Grid Produk */}
      <div className="bg-gray-200 rounded-lg mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 p-1">
          {product.map((item, idx) => (
            <div
              key={idx}
              className="relative bg-accent flex flex-col justify-end items-center group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <a
                href={`/page/products/${item.slug}`}
                className="w-full h-full flex flex-col justify-end"
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary/60 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>

                {/* Gambar */}
                <img
                  src={item.image ?? "/assets/images/placeholder.png"}
                  alt={item.name}
                  className="w-full h-60 sm:h-64 md:h-72 lg:h-64 xl:h-60 object-cover relative z-0 transform transition-transform duration-500 group-hover:scale-105"
                />

                {/* Info Produk */}
                <div className="bg-white group-hover:bg-transparent w-full py-4 px-3 flex flex-col gap-1 items-center justify-center relative z-20">
                  <div className="uppercase font-bold text-base sm:text-lg md:text-xl text-gray-800 text-center">
                    {item.name}
                  </div>
                  <div className="text-gray-600 text-sm sm:text-base text-center">
                    {item.desc.length > 80
                      ? item.desc.substring(0, 80) + "..."
                      : item.desc}
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
