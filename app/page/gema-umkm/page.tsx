"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import LayoutPage from "../layout-page";
import { FaChartLine, FaHandshake, FaStore, FaUsers } from "react-icons/fa";

const umkmProducts = [
  {
    id: 1,
    name: "Kopi Nusantara",
    desc: "Kopi pilihan petani NU yang dikemas modern untuk generasi masa kini.",
    img: "/assets/images/kopi.jpg",
  },
  {
    id: 2,
    name: "Batik Nahdliyin",
    desc: "Batik khas dengan motif Islami yang mengangkat kearifan lokal.",
    img: "/assets/images/batik.jpg",
  },
  {
    id: 3,
    name: "Makanan Tradisional",
    desc: "Camilan khas pesantren yang diproduksi UMKM binaan.",
    img: "/assets/images/makanan.jpg",
  },
  {
    id: 4,
    name: "Produk Herbal",
    desc: "Herbal alami untuk kesehatan, diracik dengan standar halal.",
    img: "/assets/images/herbal.jpg",
  },
];

const keunggulan = [
  {
    icon: <FaHandshake className="text-green-600 text-4xl" />,
    title: "Jaringan Luas",
    desc: "Terhubung dengan komunitas UMKM dan mitra strategis di seluruh Indonesia.",
  },
  {
    icon: <FaChartLine className="text-blue-600 text-4xl" />,
    title: "Pengembangan Bisnis",
    desc: "Dukungan pelatihan, mentoring, dan akses permodalan untuk peningkatan usaha.",
  },
  {
    icon: <FaUsers className="text-purple-600 text-4xl" />,
    title: "Kolaborasi",
    desc: "Kesempatan kolaborasi antar UMKM untuk memperluas pasar dan inovasi produk.",
  },
  {
    icon: <FaStore className="text-orange-600 text-4xl" />,
    title: "Promosi & Pemasaran",
    desc: "Produk UMKM dipromosikan melalui kanal resmi Gema Nahdliyin.",
  },
];

export default function GemaUMKMPage() {
  return (
    <LayoutPage
      title="Gema UMKM"
      titlePage="UMKM Nahdliyin"
      desc="Mendorong pertumbuhan ekonomi masyarakat Nahdliyin melalui produk UMKM unggulan yang inovatif, berkualitas, dan berdaya saing."
    >
      {/* Section Penjelasan */}
      <section className="text-center max-w-4xl mx-auto mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-4 mt-20">
          Apa itu Gema UMKM?
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed">
          <span className="font-semibold">Gema UMKM</span> hadir sebagai wadah
          untuk mendorong kemandirian ekonomi masyarakat Nahdliyin melalui
          pengembangan produk-produk unggulan berbasis lokal. Program ini
          berfokus pada pemberdayaan pelaku usaha kecil dan menengah,
          peningkatan kualitas produksi, hingga perluasan akses pasar, baik di
          tingkat nasional maupun global.
        </p>
      </section>

      {/* Grid Produk */}
      <div className="py-10 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 px-15">
          {umkmProducts.map((item) => (
            <motion.div
              key={item.id}
              className="relative group rounded-2xl overflow-hidden shadow-lg bg-white"
              whileHover={{ scale: 1.05, rotate: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <div className="relative h-64 w-full">
                <Image
                  src={item.img}
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
          {keunggulan.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -10, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl flex flex-col items-center text-center"
            >
              {item.icon}
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
