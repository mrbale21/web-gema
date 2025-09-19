"use client";

import { EdtechApp, EdtechDetailApp } from "@/types/edtechapp";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function GemaApp() {
  const [edtech, setEdtech] = useState<EdtechApp | null>(null);
  const [edtechdetail, setEdtechdetail] = useState<EdtechDetailApp[]>([]);

  useEffect(() => {
    fetch("/api/gemaedtechapp")
      .then((res) => {
        console.log(res.status, res.statusText); // lihat status
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        if (data && data.length > 0) setEdtech(data[0]);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  useEffect(() => {
    fetch("/api/gemaedtechapp/edtechdetail")
      .then((res) => res.json())
      .then((data) => setEdtechdetail(data));
  }, []);

  function extractVideoId(url: string) {
    const match = url.match(/v=([^&]+)/);
    return match ? match[1] : "";
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center px-6 py-16 md:py-32 gap-5">
        {/* Text */}

        <motion.div
          className="md:w-1/2 space-y-6 text-center md:text-left "
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            {edtech?.title ?? "Judul Belum Ada"}
          </h1>
          <p className="text-gray-600 text-lg md:text-xl text-justify">
            {edtech?.subtitle ?? "Subtitle belum ada"}
          </p>

          <div className="flex flex-col md:flex-row gap-4 items-center">
            <Link
              href="/"
              className="inline-block bg-secondary text-white px-8 py-3 rounded-lg shadow-md hover:bg-orange-400 transition font-semibold"
            >
              Gema Nahdliyin
            </Link>
            <a
              href="https://play.google.com/store/apps/details?id=eu.nordeus.topeleven.android&pcampaignid=web_share"
              className="inline-block bg-primary text-white px-8 py-3 rounded-lg shadow-md hover:bg-green-700 transition font-semibold"
            >
              Mulai Belajar Sekarang
            </a>
          </div>
        </motion.div>

        {/* Video */}
        <motion.div
          className="md:w-1/2 mb-12 md:mb-0 flex justify-center "
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          {edtech?.video && (
            <iframe
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${extractVideoId(
                edtech.video
              )}`}
              title={edtech.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-6 py-10 md:py-32 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {edtechdetail && edtechdetail.length > 0 ? (
          edtechdetail.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -8, scale: 1.02 }}
              className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition border-l-2 border-t-2 border-l-secondary border-t-primary"
            >
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-500">{item.subtitle}</p>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-400 col-span-full text-center">
            Tidak ada detail untuk ditampilkan.
          </p>
        )}
      </div>
      {/* <div className="max-w-6xl mx-auto px-6 py-16 md:py-32 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">Belajar Interaktif</h3>
          <p className="text-gray-500">
            Materi dan latihan yang menyenangkan, sehingga belajar jadi lebih
            efektif.
          </p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">Fleksibel & Mudah</h3>
          <p className="text-gray-500">
            Akses kapan saja dan di mana saja dari perangkatmu.
          </p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2">Pantau Kemajuanmu</h3>
          <p className="text-gray-500">
            Lihat perkembangan belajar dan capai target dengan lebih cepat.
          </p>
        </div>
      </div> */}
    </div>
  );
}
