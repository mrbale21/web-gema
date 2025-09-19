"use client";

import DynamicIcon from "@/components/Common/DynamicIcon";
import { GemaEdTech, GemaEdTechDetail } from "@/types/gemaedtech";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import LayoutPage from "../layout-page";

export default function GemaEdTechPage() {
  const [gemaedtech, setGemaedtech] = useState<GemaEdTech | null>(null);
  const [gemaedtechdetail, setGemaedtechdetail] = useState<GemaEdTechDetail[]>(
    []
  );

  // ambil hanya 1 item
  useEffect(() => {
    fetch("/api/gemaedtech")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          setGemaedtech(data[0]); // ambil item pertama saja
        }
      });
  }, []);

  // ambil semua item
  useEffect(() => {
    fetch("/api/gemaedtech/detail")
      .then((res) => res.json())
      .then((data) => setGemaedtechdetail(data));
  }, []);

  return (
    <LayoutPage
      title="Gema EdTech"
      titlePage="Gema EdTech"
      desc={gemaedtech ? gemaedtech.desc : "Loading..."}
    >
      <div className="relative bg-gradient-to-br from-green-50 via-white to-green-100 py-16 overflow-hidden">
        <div className="max-w-6xl mx-auto text-center px-6">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {gemaedtech ? gemaedtech.title : "Loading..."}
          </motion.h2>
          <motion.p
            className="text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {gemaedtech ? gemaedtech.desc : ""}
          </motion.p>
        </div>

        {/* Features Section dari DB */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 px-20 py-10">
          {gemaedtechdetail.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="group flex items-center gap-4 rounded-2xl bg-white/90 shadow-md p-6 hover:shadow-xl border border-gray-100"
            >
              <div className="flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <DynamicIcon
                  name={item.icon}
                  className="w-10 h-10 text-primary"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="flex items-center justify-center gap-5">
          <motion.div
            className="mt-16 text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <a
              href={`/page/gema-edtech/gemaApp/`}
              className="bg-secondary text-white px-6 py-3 rounded-full shadow-md hover:bg-green-700 transition"
            >
              Mulai Belajar Sekarang
            </a>
          </motion.div>
          <motion.div
            className="mt-16 text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <button className="bg-primary text-white px-6 py-3 rounded-full shadow-md hover:bg-green-700 transition">
              Hubungi Kami
            </button>
          </motion.div>
        </div>
      </div>
    </LayoutPage>
  );
}
