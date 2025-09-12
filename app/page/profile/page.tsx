// pages/profile.tsx
"use client";

import { motion } from "framer-motion";
import { BookOpen, Lightbulb, Target, Users } from "lucide-react";
import { useEffect, useState } from "react";
import LayoutPage from "../layout-page";

interface timelineData {
  title: string;
  year: string;
  desc: string;
}

export default function ProfilePage() {
  const [timeline, setTimeline] = useState<timelineData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/timeline")
      .then((res) => res.json())
      .then((json) => {
        if (Array.isArray(json)) {
          setTimeline(json);
        }
      })
      .catch((err) => console.error("Invalid API", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>loading.....</p>;
  if (!timeline) return <p>data tidak valid</p>;

  const values = [
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Kebersamaan",
      desc: "Menjunjung tinggi persaudaraan, solidaritas, dan gotong royong.",
    },
    {
      icon: <Target className="w-8 h-8 text-primary" />,
      title: "Kemandirian",
      desc: "Mendorong generasi muda untuk berdaya secara ekonomi dan sosial.",
    },
    {
      icon: <BookOpen className="w-8 h-8 text-primary" />,
      title: "Inklusif",
      desc: "Membuka ruang kolaborasi untuk semua kalangan tanpa batasan.",
    },
    {
      icon: <Lightbulb className="w-8 h-8 text-primary" />,
      title: "Berorientasi Masa Depan",
      desc: "Fokus pada kompetensi relevan untuk menghadapi tantangan global.",
    },
  ];

  return (
    <LayoutPage
      title="Profil"
      titlePage="Profil Gema Nahdliyin"
      desc="Mengenal lebih dekat sejarah, visi, misi, dan nilai yang menjadi landasan gerakan."
    >
      {/* Sejarah */}
      {/* Timeline Sejarah */}
      <section className="px-6 lg:px-20 mb-20">
        <h3 className="text-3xl font-bold text-primary mb-10">
          Perjalanan Kami
        </h3>
        <div className="relative">
          {/* Garis timeline */}
          <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-primary/20"></div>

          <div className="space-y-12">
            {timeline.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className={`relative flex flex-col md:flex-row items-center md:items-start gap-6 ${
                  idx % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Titik timeline */}
                <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-6 h-6 rounded-full bg-primary border-4 border-white z-10 shadow-md"></div>

                {/* Konten */}
                <div
                  className={`bg-white shadow-lg rounded-xl p-6 w-full md:w-5/12 ${
                    idx % 2 === 0 ? "md:text-left" : "md:text-right"
                  }`}
                >
                  <h4 className="text-xl font-bold text-primary">
                    {item.year}
                  </h4>
                  <h5 className="text-lg font-semibold text-gray-800 mt-1">
                    {item.title}
                  </h5>
                  <p className="text-gray-600 mt-2">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Program Unggulan */}
      <section className="px-6 lg:px-20 mb-20">
        <h3 className="text-3xl font-bold text-primary mb-10">
          Program Unggulan
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-xl transition">
            <h4 className="font-semibold text-lg mb-2 text-gray-800">
              Pelatihan
            </h4>
            <p className="text-gray-600">
              Berbagai pelatihan keterampilan untuk meningkatkan daya saing
              generasi muda.
            </p>
          </div>
          <div className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-xl transition">
            <h4 className="font-semibold text-lg mb-2 text-gray-800">UMKM</h4>
            <p className="text-gray-600">
              Dukungan pengembangan usaha kecil berbasis komunitas Nahdliyin.
            </p>
          </div>
          <div className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-xl transition">
            <h4 className="font-semibold text-lg mb-2 text-gray-800">Sosial</h4>
            <p className="text-gray-600">
              Program kepedulian masyarakat melalui aksi nyata dan kolaborasi.
            </p>
          </div>
          <div className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-xl transition">
            <h4 className="font-semibold text-lg mb-2 text-gray-800">
              Digitalisasi
            </h4>
            <p className="text-gray-600">
              Mendorong literasi digital dan inovasi berbasis teknologi.
            </p>
          </div>
        </div>
      </section>

      {/* Visi & Misi */}
      <section className="px-6 lg:px-20 mb-16 grid md:grid-cols-2 gap-10">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition"
        >
          <h3 className="text-2xl font-bold text-primary mb-4">Visi</h3>
          <p className="text-gray-700 leading-relaxed">
            Menjadi wadah utama pemberdayaan generasi muda Nahdliyin yang
            berkarakter, berdaya saing, dan memberi kontribusi nyata bagi
            masyarakat, bangsa, dan agama.
          </p>
        </motion.div>

        <motion.div
          initial={{ x: 50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition"
        >
          <h3 className="text-2xl font-bold text-primary mb-4">Misi</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Mengembangkan pendidikan dan literasi digital.</li>
            <li>Mendorong tumbuhnya UMKM berbasis komunitas.</li>
            <li>Menyelenggarakan pelatihan keterampilan generasi muda.</li>
            <li>Membangun jaringan kolaborasi antar komunitas.</li>
            <li>Menanamkan nilai kebersamaan, toleransi, dan kemandirian.</li>
          </ul>
        </motion.div>
      </section>

      {/* Nilai & Prinsip */}
      <section className="px-6 lg:px-20 mb-20">
        <h3 className="text-3xl font-bold text-primary mb-10">
          Nilai & Prinsip
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((val, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              viewport={{ once: true }}
              className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-xl hover:scale-105 transition-transform"
            >
              <div className="flex justify-center items-center w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4">
                {val.icon}
              </div>
              <h4 className="font-semibold text-lg mb-2 text-gray-800">
                {val.title}
              </h4>
              <p className="text-gray-600">{val.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </LayoutPage>
  );
}
