"use client";

import { motion } from "framer-motion";
import { BookOpen, Lightbulb, Target, Users } from "lucide-react";
import { JSX, useEffect, useState } from "react";
import LayoutPage from "../layout-page";
import Loading from "@/components/Common/Loading";
import { ProgramType } from "@/types/program";
import DynamicIcon from "@/components/Common/DynamicIcon";

export default function ProgramPage() {
  const [programs, setProgram] = useState<ProgramType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/program")
      .then((res) => res.json())
      .then((json) => {
        if (Array.isArray(json)) {
          setProgram(json);
        }
      })
      .catch((err) => console.error("Invalid API", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading fullScreen type="spinner" />;
  if (!programs) return <Loading fullScreen type="spinner" />;

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
              className={`flex justify-center items-center w-16 h-16 rounded-full mb-4 bg-gradient-to-r from-green-400 to-teal-500 shadow-lg`}
            >
              <DynamicIcon
                name={program.icon}
                className="w-8 h-8 text-white "
              />
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
