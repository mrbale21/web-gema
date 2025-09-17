"use client";

import { motion } from "framer-motion";
import { JSX, useEffect, useState } from "react";
import LayoutPage from "../layout-page";
import DynamicIcon from "@/components/Common/DynamicIcon";
import { Training, TrainingBenefit, TrainingDetail } from "@/types/training";

export default function GemaPelatihan() {
  const [training, setTraining] = useState<Training[]>([]);
  const [trainingdetail, setTrainingDetail] = useState<TrainingDetail[]>([]);
  const [trainingbenefit, setTrainingbenefit] = useState<TrainingBenefit[]>([]);

  useEffect(() => {
    fetch("/api/training/benefit")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTrainingbenefit(data);
        }
      });
  }, []);

  useEffect(() => {
    fetch("/api/training/")
      .then((res) => res.json())
      .then((data) => setTraining(data));
  }, []);

  useEffect(() => {
    fetch("/api/training/detail")
      .then((res) => res.json())
      .then((data) => setTrainingDetail(data));
  }, []);

  const benefits = [
    "Akses jaringan mitra luas di berbagai sektor.",
    "Dukungan penuh dari tim pelatihan Gema Nahdliyin.",
    "Kesempatan kolaborasi dalam program pemberdayaan.",
    "Promosi bersama untuk meningkatkan eksposur mitra.",
  ];

  return (
    <LayoutPage
      title="Pelatihan Gema Nahdliyin"
      titlePage="Pelatihan"
      desc="Program pelatihan Gema Nahdliyin hadir untuk meningkatkan kualitas SDM Nahdliyin. 
      Dengan pendekatan praktis, peserta didorong agar siap menghadapi tantangan kerja, 
      membuka peluang usaha, dan mampu berdaya saing di era digital."
    >
      {/* Intro Section */}
      <div className="mb-12 text-center max-w-3xl mx-auto pt-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Mengapa Bergabung di Pelatihan Kami?
        </h2>
        <p className="text-gray-600">
          Gema Nahdliyin membuka kesempatan bagi siapa saja yang ingin belajar,
          berkembang, dan menjadi bagian dari jaringan mitra yang produktif.
        </p>
      </div>

      {/* Steps Section */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 px-6 md:px-10">
        {training.map((step, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col items-center bg-white shadow-md rounded-2xl p-6 text-center group hover:shadow-xl hover:scale-105 transition-transform"
          >
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary shadow-lg mb-4">
              <DynamicIcon
                name={step.icon}
                className=" mx-auto text-white w-8 h-8"
              />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-primary">
              {step.title}
            </h3>
            <p className="text-gray-600">{step.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Program Types */}
      <div className="mt-20 max-w-5xl mx-auto px-6">
        <h3 className="text-2xl font-bold text-gray-800 text-center mb-10">
          Jenis Pelatihan yang Tersedia
        </h3>
        <div className="grid md:grid-cols-3 gap-8">
          {trainingdetail.map((prog, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition"
            >
              <div className="mb-4">
                {" "}
                <DynamicIcon
                  name={prog.icon}
                  className="w-8 h-8 text-primary"
                />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                {prog.title}
              </h4>
              <p className="text-gray-600 text-sm">{prog.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mitra Benefits */}
      <div className="mt-20 max-w-4xl mx-auto px-6 text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">
          Keunggulan Bergabung Sebagai Mitra
        </h3>
        <ul className="text-gray-600 space-y-3 text-center items-center justify-center flex flex-col max-w-xl mx-auto">
          {trainingbenefit.map((item, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.2 }}
              viewport={{ once: true }}
              className="flex items-start gap-2"
            >
              <span className="text-primary font-bold">✔</span>
              <span>{item.title}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Call to Action */}
      <div className="mt-16 text-center pb-20">
        <motion.a
          href="#"
          whileHover={{ scale: 1.05 }}
          className="inline-block bg-primary text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-primary/90 transition"
        >
          Gabung Sebagai Mitra Pelatihan
        </motion.a>
      </div>
    </LayoutPage>
  );
}
