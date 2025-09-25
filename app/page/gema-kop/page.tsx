"use client";

import { useEffect, useState } from "react";
import LayoutPage from "../layout-page";
import DynamicIcon from "@/components/Common/DynamicIcon";
import { GemaKop, GemaKopDetail } from "@/types/gemakop";
import WhatsappButton from "@/components/Common/WhatsAppButton";
import { TenantType } from "@/types/tenant";

export default function GemaKoperasiPage() {
  const [gemakop, setGemakop] = useState<GemaKop | null>(null);
  const [gemakopdetail, setGemakopdetail] = useState<GemaKopDetail[]>([]);
  const [tenant, setTenant] = useState<TenantType | null>(null);

  // ambil hanya 1 item utama
  useEffect(() => {
    fetch("/api/gemakop")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          setGemakop(data[0]);
        }
      });
  }, []);

  // ambil semua detail
  useEffect(() => {
    fetch("/api/gemakop/detail")
      .then((res) => res.json())
      .then((data) => setGemakopdetail(data));
  }, []);

  useEffect(() => {
    fetch("/api/tenant")
      .then((res) => res.json())
      .then((data) => setTenant(data));
  }, []);

  return (
    <LayoutPage
      title="Gema Koperasi"
      titlePage="Produk - Gema Koperasi"
      desc="Hadir untuk memberikan solusi ekonomi yang adil, inklusif, dan
            berdaya saing dengan prinsip syariah dan gotong royong."
    >
      {/* Tentang */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-6">
            Apa itu <span className="text-primary">{gemakop?.title}</span>?
          </h2>
          <p className="text-gray-700 leading-relaxed md:text-lg">
            {gemakop?.desc}
          </p>
        </div>
      </section>

      {/* Keunggulan */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4">
            Kenapa Memilih{" "}
            <span className="text-primary">{gemakop?.title}</span>?
          </h2>
          <p className="text-gray-600 md:text-lg">{gemakop?.desc}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {gemakopdetail.map((item) => {
            return (
              <div
                key={item.id}
                className="p-6 rounded-xl shadow hover:shadow-lg transition"
              >
                <DynamicIcon
                  name={item.icon}
                  className="w-10 h-10 text-primary mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-accent text-gray-700 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">
            {gemakop?.title1}
          </h2>
          <p className="mb-6 text-lg">{gemakop?.desc1}</p>
          <WhatsappButton
            phone={tenant?.phone2 || ""}
            message={`Halo ${
              tenant?.nameTenant || "Tenant"
            }, saya ingin menanyakan sesuatu.`}
            className="bg-white text-primary font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition"
          >
            Hubungi Sekarang!
          </WhatsappButton>
        </div>
      </section>
    </LayoutPage>
  );
}
