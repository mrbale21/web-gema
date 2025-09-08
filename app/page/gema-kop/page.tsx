"use client";

import { FaHandshake, FaUsers, FaChartLine, FaLeaf } from "react-icons/fa";
import LayoutPage from "../layout-page";

export default function GemaKoperasiPage() {
  return (
    <LayoutPage
      title="Gema Koperasi"
      titlePage="Produk - Gema Koperasi"
      desc="Hadir untuk memberikan solusi ekonomi yang adil, inklusif, dan
            berdaya saing dengan prinsip syariah dan gotong royong."
    >
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-6">
            Apa itu <span className="text-primary">Gema Koperasi?</span>
          </h2>
          <p className="text-gray-700 leading-relaxed md:text-lg">
            Gema Koperasi adalah program pemberdayaan ekonomi berbasis koperasi
            yang diinisiasi oleh Gema Nahdliyin. Melalui koperasi, anggota dapat
            saling mendukung dalam permodalan, distribusi produk, hingga akses
            ke pasar yang lebih luas. Dengan prinsip syariah dan kebersamaan,
            Gema Koperasi menjadi solusi nyata untuk membangun kemandirian
            ekonomi umat.
          </p>
        </div>
      </section>

      {/* Keunggulan */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-4">
            Kenapa Memilih <span className="text-primary">Gema Koperasi?</span>
          </h2>
          <p className="text-gray-600 md:text-lg">
            Hadir untuk memberikan solusi ekonomi yang adil, inklusif, dan
            berdaya saing dengan prinsip syariah dan gotong royong.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div className="p-6 rounded-xl shadow hover:shadow-lg transition">
            <FaHandshake className="text-primary text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Kemitraan
            </h3>
            <p className="text-gray-600 text-sm">
              Membangun jaringan usaha bersama untuk saling menguatkan.
            </p>
          </div>
          <div className="p-6 rounded-xl shadow hover:shadow-lg transition">
            <FaUsers className="text-primary text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Kebersamaan
            </h3>
            <p className="text-gray-600 text-sm">
              Berbasis solidaritas dan gotong royong antar anggota.
            </p>
          </div>
          <div className="p-6 rounded-xl shadow hover:shadow-lg transition">
            <FaChartLine className="text-primary text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Pertumbuhan
            </h3>
            <p className="text-gray-600 text-sm">
              Mendukung perkembangan usaha anggota secara berkelanjutan.
            </p>
          </div>
          <div className="p-6 rounded-xl shadow hover:shadow-lg transition">
            <FaLeaf className="text-primary text-5xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Keberkahan
            </h3>
            <p className="text-gray-600 text-sm">
              Mengedepankan nilai syariah dan keberkahan dalam setiap usaha.
            </p>
          </div>
        </div>
      </section>

      {/* Penjelasan */}

      {/* Call to Action */}
      <section className="py-16 px-6 bg-accent text-gray-700 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">
            Bergabung Bersama Gema Koperasi
          </h2>
          <p className="mb-6 text-lg">
            Saatnya menjadi bagian dari gerakan ekonomi umat yang kuat dan
            berdaya.
          </p>
          <a
            href="/daftar-koperasi"
            className="bg-white text-primary font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition"
          >
            Daftar Sekarang
          </a>
        </div>
      </section>
    </LayoutPage>
  );
}
