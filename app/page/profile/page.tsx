// pages/profile.tsx
"use client";

import { motion } from "framer-motion";
import { BookOpen, Lightbulb, Target, Users } from "lucide-react";
import { JSX, useEffect, useState } from "react";
import LayoutPage from "../layout-page";
import { TimelineType } from "@/types/timeline";
import { ProgramType } from "@/types/program";
import { PrincipleType } from "@/types/principle";
import { VisiMisiType } from "@/types/visimisi";
import { availableIcons } from "@/components/Common/AvailableIcons";

const iconsMap: Record<string, JSX.Element> = {
  users: <Users className="w-8 h-8 text-primary" />,
  target: <Target className="w-8 h-8 text-primary" />,
  "book-open": <BookOpen className="w-8 h-8 text-primary" />,
  lightbulb: <Lightbulb className="w-8 h-8 text-primary" />,
};

export default function ProfilePage() {
  const [timeline, setTimeline] = useState<TimelineType[]>([]);
  const [program, setProgram] = useState<ProgramType[]>([]);
  const [nilai, setNilai] = useState<PrincipleType[]>([]);
  const [data, setData] = useState<VisiMisiType | null>(null);

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

    fetch("/api/program")
      .then((res) => res.json())
      .then((json) => {
        if (Array.isArray(json)) {
          setProgram(json);
        }
      })
      .catch((err) => console.error("Invalid API", err))
      .finally(() => setLoading(false));

    fetch("/api/principle")
      .then((res) => res.json())
      .then((json) => {
        if (Array.isArray(json)) {
          setNilai(json);
        }
      })
      .catch((err) => console.error("Invalid API", err))
      .finally(() => setLoading(false));

    fetch("/api/visimisi")
      .then((res) => res.json())
      .then((json) => {
        if (json.length > 0) {
          setData(json[0]); // ambil 1 data pertama
        }
      })
      .catch((err) => console.error("masalah pada api", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>loading...</p>;
  if (!timeline) return <p>data tidak valid</p>;
  if (!data) return <p>data tidak valid</p>;
  if (!program) return <p>tidak ada data program unggulan</p>;
  if (!nilai) return <p>tidak ada data nilai dan prinsip</p>;

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
          {program.map((p) => (
            <div
              key={p.id}
              className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-xl transition"
            >
              <h4 className="font-semibold text-lg mb-2 text-gray-800">
                {p.title}
              </h4>
              <p className="text-gray-600">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Visi & Misi */}
      <section className="px-6 lg:px-20 mb-16 grid md:grid-cols-3 gap-6">
        {/* Visi */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition border-l-4 border-primary"
        >
          <h3 className="text-2xl font-bold text-primary mb-4">Visi</h3>
          <p className="text-gray-700 leading-relaxed">
            {data.visi.map((v) => v.title).join(". ")}
          </p>
        </motion.div>

        {/* Misi */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition"
        >
          <h3 className="text-2xl font-bold text-primary mb-4">Misi</h3>
          <ul className="space-y-3">
            {data.misi.map((m) => (
              <li key={m.id} className="flex items-start gap-2 text-gray-700">
                <span className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2"></span>
                <span>{m.title}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Motto */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-primary/10 shadow-lg rounded-2xl p-6 hover:shadow-xl transition flex flex-col justify-center items-center text-center"
        >
          <h3 className="text-2xl font-bold text-primary mb-4">Motto</h3>
          <p className="text-gray-700 italic relative before:content-['“'] before:absolute before:-left-3 before:text-primary before:text-4xl after:content-['”'] after:absolute after:-right-3 after:text-primary after:text-4xl">
            {data?.moto}
          </p>
        </motion.div>
      </section>

      {/* Nilai & Prinsip */}
      <section className="px-6 lg:px-20 mb-20">
        <h3 className="text-3xl font-bold text-primary mb-10">
          Nilai & Prinsip
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {nilai.map((val, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              viewport={{ once: true }}
              className="bg-white shadow-md rounded-xl p-6 text-center hover:shadow-xl hover:scale-105 transition-transform"
            >
              <div className="flex justify-center items-center w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4">
                {availableIcons.find((i) => i.name === val.icon)?.icon}
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
