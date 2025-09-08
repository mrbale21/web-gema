"use client";

import { motion } from "framer-motion";
import {
  FaChalkboardTeacher,
  FaLaptopCode,
  FaUsers,
  FaCertificate,
} from "react-icons/fa";
import LayoutPage from "../layout-page";

export default function GemaEdTechPage() {
  const features = [
    {
      icon: <FaChalkboardTeacher size={40} className="text-green-600" />,
      title: "Pembelajaran Interaktif",
      desc: "Kelas dengan metode modern yang membuat belajar lebih efektif dan menyenangkan.",
    },
    {
      icon: <FaLaptopCode size={40} className="text-green-600" />,
      title: "Platform Digital",
      desc: "Akses pembelajaran dari mana saja melalui platform digital yang user-friendly.",
    },
    {
      icon: <FaUsers size={40} className="text-green-600" />,
      title: "Komunitas Belajar",
      desc: "Bergabung dengan komunitas pembelajar untuk berkolaborasi dan bertukar ilmu.",
    },
    {
      icon: <FaCertificate size={40} className="text-green-600" />,
      title: "Sertifikasi",
      desc: "Dapatkan sertifikat resmi yang diakui untuk mendukung karir dan kompetensi Anda.",
    },
  ];

  return (
    <LayoutPage
      title="Gema EdTech"
      titlePage="Gema EdTech"
      desc="Inovasi pendidikan digital dari Gema Nahdliyin, menghadirkan solusi pembelajaran modern, mudah diakses, dan berkualitas."
    >
      <div className="relative bg-gradient-to-br from-green-50 via-white to-green-100 py-16 overflow-hidden">
        <div className="max-w-6xl mx-auto text-center px-6">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Belajar Lebih Mudah & Modern
          </motion.h2>
          <motion.p
            className="text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Gema EdTech mendukung perkembangan pendidikan berbasis teknologi
            dengan menyediakan platform digital inovatif yang membantu siswa,
            guru, dan masyarakat dalam mengakses ilmu dengan lebih luas.
          </motion.p>
        </div>

        {/* Features Section */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 px-20 py-10">
          {features.map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="group flex items-center gap-4 rounded-2xl bg-white/90 shadow-md p-6 hover:shadow-xl border border-gray-100"
            >
              <div className="flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          className="mt-16 text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <button className="bg-green-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-green-700 transition">
            Mulai Belajar Sekarang
          </button>
        </motion.div>
      </div>
    </LayoutPage>
  );
}
