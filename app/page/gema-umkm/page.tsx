"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import LayoutPage from "../layout-page";
import DynamicIcon from "@/components/Common/DynamicIcon";
import { GemaImgUMKM, GemaUMKM, GemaUMKMDetail } from "@/types/gemaumkm";

// interface sesuai model Prisma

export default function GemaUMKMPage() {
  const [umkm, setUmkm] = useState<GemaUMKM[]>([]);
  const [umkmImgs, setUmkmImgs] = useState<GemaImgUMKM[]>([]);
  const [umkmDetails, setUmkmDetails] = useState<GemaUMKMDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [umkmRes, imgRes, detailRes] = await Promise.all([
          fetch("/api/gemaumkm"),
          fetch("/api/gemaumkm/image"),
          fetch("/api/gemaumkm/detail"),
        ]);

        if (!umkmRes.ok || !imgRes.ok || !detailRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const [umkmData, imgData, detailData] = await Promise.all([
          umkmRes.json(),
          imgRes.json(),
          detailRes.json(),
        ]);

        setUmkm(umkmData);
        setUmkmImgs(imgData);
        setUmkmDetails(detailData);
      } catch (error) {
        console.error("Error fetching UMKM data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <LayoutPage title="Loading..." titlePage="Loading" desc="Loading data">
        <div className="text-center py-20">Loading data UMKM...</div>
      </LayoutPage>
    );
  }

  return (
    <LayoutPage
      title="Gema UMKM"
      titlePage="UMKM Nahdliyin"
      desc="Mendorong pertumbuhan ekonomi masyarakat Nahdliyin melalui produk UMKM unggulan yang inovatif, berkualitas, dan berdaya saing."
    >
      {/* Section Penjelasan (pakai umkmData) */}
      <section className="text-center max-w-4xl mx-auto mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-4 mt-20">
          {umkm[0]?.title || "Apa itu Gema UMKM?"}
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed">
          {umkm[0]?.desc || (
            <>
              <span className="font-semibold">Gema UMKM</span> hadir sebagai
              wadah untuk mendorong kemandirian ekonomi masyarakat Nahdliyin
              melalui pengembangan produk-produk unggulan berbasis lokal.
            </>
          )}
        </p>
      </section>

      {/* Grid Produk (dari umkmImgs) */}
      <div className="py-10 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 px-15">
          {umkmImgs.map((item) => (
            <motion.div
              key={item.id}
              className="relative group rounded-2xl overflow-hidden shadow-lg bg-white"
              whileHover={{ scale: 1.05, rotate: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <div className="relative h-64 w-full">
                <Image
                  src={item.image || "/assets/images/default.jpg"}
                  alt={item.name}
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

      {/* Section Keunggulan (dari umkmDetails) */}
      <section className="relative bg-gradient-to-r from-green-100 via-white to-green-50 py-16 rounded-2xl shadow-lg">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Keunggulan Bergabung{" "}
            <span className="text-green-600">Mitra Gema UMKM</span>
          </h2>
          <p className="text-gray-600 mt-4 text-lg">
            Nikmati berbagai keuntungan ketika bergabung bersama Gema Nahdliyin
            untuk UMKM.
          </p>
        </div>

        {/* Grid Keunggulan */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 px-6 md:px-16">
          {umkmDetails.map((item, index) => (
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
            Gabung Mitra Sekarang
          </motion.a>
        </div>
      </section>
    </LayoutPage>
  );
}
