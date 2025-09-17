"use client";

import { motion } from "framer-motion";
import { Users, Target, Award, Rocket } from "lucide-react";

import CountUp from "react-countup";
import LayoutPage from "../layout-page";
import { StatisticType } from "@/types/statistic";
import { useEffect, useState } from "react";
import Loading from "@/components/Common/Loading";

export default function CapaianPage() {
  const [achievement, setAchievement] = useState<StatisticType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/statistic")
      .then((res) => res.json())
      .then((json) => {
        if (Array.isArray(json)) {
          setAchievement(json);
        }
      })
      .catch((err) => console.error("Invalid API", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading fullScreen type="spinner" />;
  if (!achievement) return <Loading fullScreen type="spinner" />;

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
        {achievement.map((ach, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center p-6 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-transform bg-white"
          >
            <div
              className={`flex justify-center items-center w-16 h-16 rounded-full mb-4 bg-gradient-to-r from-green-400 to-teal-500 shadow-lg`}
            >
              <img src={ach.image} alt={ach.name} className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {ach.name}
            </h3>
            <p className="text-2xl font-bold text-gray-700">{ach.count} +</p>
          </motion.div>
        ))}
      </div>
    </LayoutPage>
  );
}
