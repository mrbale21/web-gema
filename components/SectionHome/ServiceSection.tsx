"use client";

import { motion } from "framer-motion";
import {
  FaUsers,
  FaHandshake,
  FaChalkboardTeacher,
  FaStore,
} from "react-icons/fa";
import TextHeader from "../Common/TextHeader";

const services = [
  {
    icon: <FaUsers className="text-white text-2xl" />,
    title: "Komunitas Nahdliyin",
    desc: "Menghubungkan UMKM, santri, dan masyarakat dalam ekosistem ekonomi keumatan.",
    color: "from-indigo-500 to-purple-500",
  },
  {
    icon: <FaHandshake className="text-white text-2xl" />,
    title: "Kolaborasi & Kemitraan",
    desc: "Membuka peluang kerjasama dengan berbagai mitra strategis untuk memperluas jaringan usaha.",
    color: "from-green-400 to-teal-500",
  },
  {
    icon: <FaChalkboardTeacher className="text-white text-2xl" />,
    title: "Pelatihan & Pendampingan",
    desc: "Memberikan bimbingan, workshop, serta edukasi bisnis untuk meningkatkan kapasitas UMKM.",
    color: "from-yellow-400 to-yellow-600",
  },
  {
    icon: <FaStore className="text-white text-2xl" />,
    title: "Digitalisasi UMKM",
    desc: "Mendukung promosi, pemasaran, dan transaksi melalui platform digital berbasis komunitas.",
    color: "from-pink-500 to-red-500",
  },
];

export default function ServiceSection() {
  return (
    <section className="bg-accent/40 py-20">
      <TextHeader
        title="Mengapa Gema | Nahdliyin?"
        desc="Gema Nahdliyin hadir sebagai wadah penguatan ekonomi keumatan dengan
          memadukan komunitas, kolaborasi, pendampingan, serta teknologi digital."
      />

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 px-6 md:px-10">
        {services.map((service, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col items-center bg-white shadow-lg rounded-2xl p-6 text-center group hover:shadow-2xl hover:scale-105 transition-transform"
          >
            <motion.div
              className={`flex justify-center items-center w-16 h-16 rounded-full mb-4 bg-gradient-to-r ${service.color} shadow-lg`}
              whileHover={{ scale: 1.2, rotate: 10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {service.icon}
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
