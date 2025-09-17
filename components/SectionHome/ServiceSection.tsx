"use client";

import { motion } from "framer-motion";
import { JSX, useEffect, useState } from "react";
import {
  FaChalkboardTeacher,
  FaHandshake,
  FaStore,
  FaUsers,
} from "react-icons/fa";
import TextHeader from "../Common/TextHeader";
import { SuperiorType } from "@/types/superior";
import { availableIcons } from "../Common/AvailableIcons";
import DynamicIcon from "../Common/DynamicIcon";
import Loading from "../Common/Loading";

export default function ServiceSection() {
  const [superior, setSuperior] = useState<SuperiorType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/superior`)
      .then((res) => res.json())
      .then((json) => {
        if (Array.isArray(json)) {
          setSuperior(json);
        } else {
          setSuperior([json]); // bungkus jadi array
        }
      })
      .catch((err) => console.error("Error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading type="spinner" text="Memuat Servis..." />;
  if (!superior) return <Loading type="spinner" text="Data Tidak Ditemukan!" />;

  return (
    <section className="bg-accent/40 py-20">
      <TextHeader
        title="Mengapa Gema | Nahdliyin?"
        desc="Gema Nahdliyin hadir sebagai wadah penguatan ekonomi keumatan dengan
          memadukan komunitas, kolaborasi, pendampingan, serta teknologi digital."
      />

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 px-6 md:px-10">
        {superior.map((service, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col items-center bg-white shadow-lg rounded-2xl p-6 text-center group hover:shadow-2xl hover:scale-105 transition-transform"
          >
            <motion.div
              className="flex justify-center items-center w-16 h-16 rounded-full mb-4 bg-gradient-to-r from-green-400 to-teal-500 shadow-lg"
              whileHover={{ scale: 1.2, rotate: 10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <DynamicIcon name={service.icon} className="w-8 h-8 text-white" />
            </motion.div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-primary">
              {service.title}
            </h3>
            <p className="text-gray-600">{service.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
