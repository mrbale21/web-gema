"use client";

import { motion } from "framer-motion";
import LayoutPage from "../layout-page";
import { BookOpen, Users, Rocket, Lightbulb } from "lucide-react";

export default function ProgramPage() {
  const programs = [
    {
      icon: <BookOpen className="w-10 h-10 text-white" />,
      title: "Pendidikan & Literasi",
      desc: "Menyelenggarakan program belajar, literasi digital, dan workshop untuk generasi muda.",
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: <Users className="w-10 h-10 text-white" />,
      title: "Pemberdayaan Komunitas",
      desc: "Membina UMKM, kegiatan sosial, dan kolaborasi antar komunitas Nahdliyin.",
      color: "from-green-500 to-teal-500",
    },
    {
      icon: <Rocket className="w-10 h-10 text-white" />,
      title: "Pelatihan & Skill",
      desc: "Memberikan pelatihan praktis, sertifikasi, dan peningkatan kompetensi peserta.",
      color: "from-yellow-400 to-orange-500",
    },
    {
      icon: <Lightbulb className="w-10 h-10 text-white" />,
      title: "Inovasi & Kreativitas",
      desc: "Mendorong ide kreatif, inovasi teknologi, dan solusi problem-solving di masyarakat.",
      color: "from-pink-500 to-red-500",
    },
  ];

  return (
    <LayoutPage
      title="Program Gema Nahdliyin"
      titlePage="Program"
      desc="Menampilkan program unggulan Gema Nahdliyin untuk pendidikan, pemberdayaan, dan pengembangan generasi muda."
    >
      {/* Intro */}
      <div className="mb-12 text-center max-w-3xl mx-auto pt-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Program Unggulan Kami
        </h2>
        <p className="text-gray-600">
          Gema Nahdliyin menghadirkan berbagai program strategis untuk
          meningkatkan kualitas SDM, membangun komunitas produktif, dan
          mendorong inovasi di kalangan generasi muda.
        </p>
      </div>

      {/* Programs Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 px-6 md:px-10 pb-20">
        {programs.map((program, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center p-6 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-transform bg-white"
          >
            <div
              className={`flex justify-center items-center w-16 h-16 rounded-full mb-4 bg-gradient-to-r ${program.color} shadow-lg`}
            >
              {program.icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {program.title}
            </h3>
            <p className="text-gray-600">{program.desc}</p>
          </motion.div>
        ))}
      </div>
    </LayoutPage>
  );
}
