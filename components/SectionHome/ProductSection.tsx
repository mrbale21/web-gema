"use client";

import product from "@/data/product";
import TextHeader from "../Common/TextHeader";
import { useEffect, useState } from "react";
import { ProductType } from "@/types/product";
import Loading from "../Common/Loading";

export default function ProductSection() {
  const [product, setProduct] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/product`)
      .then((res) => res.json())
      .then((json) => {
        if (Array.isArray(json)) {
          setProduct(json);
        } else {
          setProduct([json]);
        }
      })
      .catch((err) => console.error("Error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading type="spinner" text="Memuat Produk..." />;
  if (!product) return <Loading type="spinner" text="Data Tidak Ditemukan!" />;

  return (
    <div className="bg-white px-6 md:px-10 pb-16">
      {/* Header */}
      <TextHeader
        title=" Produk Unggulan | Gema Nahdliyin"
        desc="Berbagai produk inovatif yang dirancang untuk mendukung penguatan
          ekonomi, pemberdayaan UMKM, serta pengembangan ekosistem digital
          berbasis komunitas."
      />

      {/* Grid Produk */}
      <div className="bg-gray-200 rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0.5 p-0.5">
          {product.map((item, idx) => (
            <div
              key={idx}
              className="relative bg-accent flex flex-col justify-between items-center group overflow-hidden"
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-primary/60 to-primary/10 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Gambar */}
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover relative z-0 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-1"
              />

              {/* Info Produk */}
              <div className="bg-white group-hover:bg-transparent h-40 w-full items-center flex flex-col gap-1 justify-center relative z-20 -mt-20 p-4">
                <div className="uppercase font-bold text-lg text-gray-800 transition">
                  {item.name}
                </div>
                <div className="text-gray-600 text-center  transition text-sm">
                  {item.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
