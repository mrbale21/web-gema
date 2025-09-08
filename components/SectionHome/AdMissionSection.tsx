"use client";

import ButtonPrimary from "../Common/ButtonPrimary";

export default function AdmissionSection() {
  return (
    <section className="bg-gradient-to-r from-primary to-primary py-20 px-4 flex justify-center">
      <div className="max-w-4xl w-full text-center text-white">
        {/* Judul */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Bersama Membangun Ekonomi Umat 🌱
        </h2>
        <p className="mb-8 text-lg">
          Mari bergabung dengan{" "}
          <span className="font-semibold">Gema Nahdliyin</span>! Kami membuka
          peluang kerja sama dan kemitraan untuk menciptakan kemandirian
          ekonomi, meningkatkan kesejahteraan, dan membangun ekosistem bisnis
          yang berdaya saing.
        </p>

        {/* Tombol Aksi */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/kemitraan"
            className="bg-accent hover:bg-secondary text-primary font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Gabung Mitra
          </a>
          <a
            href="/profil"
            className="bg-white hover:bg-gray-100 text-secondary font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Lihat Profil
          </a>
        </div>

        {/* Info Kontak */}
        <p className="mt-6 text-sm text-gray-200">
          Hubungi kami di <span className="font-semibold">0812-3456-7890</span>{" "}
          untuk informasi lebih lanjut.
        </p>
      </div>
    </section>
  );
}
