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
    <div className=" flex flex-col">
      {/* Hero Section dengan background video */}
      <div className="relative w-full h-screen flex items-center">
        {/* Background Video */}
        {edtech?.video && (
          <div className="absolute inset-0 overflow-hidden">
            <iframe
              className="absolute top-0 left-0 w-full h-full object-cover"
              src={`https://www.youtube.com/embed/${extractVideoId(
                edtech.video
              )}?autoplay=1&mute=1&loop=1&playlist=${extractVideoId(
                edtech.video
              )}&controls=0&showinfo=0&rel=0`}
              title={edtech.title}
              frameBorder="0"
              allow="autoplay; fullscreen"
              allowFullScreen
              style={{
                width: "100vw",
                height: "100vh",
                objectFit: "cover",
                transform: "scale(1.2)", // zoom biar nutup layar
              }}
            ></iframe>
            <div className="absolute inset-0 bg-gradient-to-br from-black via-black/20 to-black"></div>
            <div className="absolute inset-0 bg-gradient-to-bl from-black via-black/20 to-black"></div>
          </div>
        )}

        {/* Konten Hero */}
        <div className="relative z-10 max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center px-6 gap-5">
          {/* Text */}
          <motion.div
            className="md:w-1/2 space-y-6 text-center md:text-left text-white"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold">
              {edtech?.title ?? "Judul Belum Ada"}
            </h1>
            <p className="text-lg md:text-xl text-justify">
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
        </div>
      </div>

      {/* Features Section DI LUAR video background */}
      <div className="w-full bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
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
      </div>
    </div>
  );
}
