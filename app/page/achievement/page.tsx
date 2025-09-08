"use client";

import { motion } from "framer-motion";
import { Users, Target, Award, Rocket } from "lucide-react";

import CountUp from "react-countup";
import LayoutPage from "../layout-page";

export default function CapaianPage() {
  const achievements = [
    {
      icon: <Users className="w-8 h-8 text-white" />,
      title: "Anggota Terdaftar",
      count: 1500,
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: <Target className="w-8 h-8 text-white" />,
      title: "Program Pelatihan",
      count: 120,
      color: "from-green-500 to-teal-500",
    },
    {
      icon: <Award className="w-8 h-8 text-white" />,
      title: "UMKM Tersertifikasi",
      count: 80,
      color: "from-yellow-400 to-yellow-600",
    },
    {
      icon: <Rocket className="w-8 h-8 text-white" />,
      title: "Proyek & Kolaborasi",
      count: 35,
      color: "from-pink-500 to-red-500",
    },
  ];

  return (
    <LayoutPage
      title="Capaian Gema Nahdliyin"
      titlePage="Capaian"
      desc="Menampilkan capaian dan prestasi Gema Nahdliyin dalam pemberdayaan generasi muda dan pengembangan UMKM."
    >
      <div className="mb-12 text-center max-w-3xl mx-auto pt-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Capaian & Prestasi Gema Nahdliyin
        </h2>
        <p className="text-gray-600">
          Kami terus berupaya meningkatkan kualitas SDM Nahdliyin melalui
          program pelatihan, pemberdayaan UMKM, dan berbagai proyek kolaboratif.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 px-6 md:px-10 pb-20">
        {achievements.map((ach, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center p-6 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-transform bg-white"
          >
            <div
              className={`flex justify-center items-center w-16 h-16 rounded-full mb-4 bg-gradient-to-r ${ach.color} shadow-lg`}
            >
              {ach.icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {ach.title}
            </h3>
            <p className="text-2xl font-bold text-gray-700">
              <CountUp end={ach.count} duration={1.5} separator="," />
            </p>
          </motion.div>
        ))}
      </div>
    </LayoutPage>
  );
}
