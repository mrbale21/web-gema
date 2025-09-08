"use client";

import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import Link from "next/link";

export default function FooterSection() {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Logo & Deskripsi */}
        <div>
          <h2 className="text-2xl font-bold ">Gema Nahdliyin Indonesia</h2>
          <p className="mt-4 text-sm leading-relaxed">
            Gema adalah sebuah komunitas yang berfokus pada pengembangan
            kreativitas dan inovasi di bidang teknologi serta seni.
          </p>
        </div>

        {/* Navigasi */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Navigasi Cepat</h3>
          <ul className="space-y-2  text-sm">
            <li>
              <Link href="/" className="hover:text-secondary">
                Beranda
              </Link>
            </li>
            <li>
              <Link href="/profil" className="hover:text-secondary">
                Profil
              </Link>
            </li>
            <li>
              <Link href="/jurusan" className="hover:text-secondary">
                Jurusan
              </Link>
            </li>
            <li>
              <Link href="/kontak" className="hover:text-secondary">
                Kontak
              </Link>
            </li>
          </ul>
        </div>

        {/* Kontak */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Kontak Kami</h3>
          <ul className="space-y-3  text-sm">
            <li className="flex items-start gap-3">
              <MapPin size={18} className=" mt-1" />
              Jl. Mahar Martanegara No.48, Cimahi Selatan, Kota Cimahi
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="" />
              (022) 1234 5678
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="" />
              info@gemanahdliyin.sch.id
            </li>
          </ul>
        </div>

        {/* Sosial Media */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Ikuti Kami</h3>
          <div className="flex gap-4">
            <Link
              href="#"
              className="bg-secondary p-2 rounded-full hover:bg-white hover:text-primary transition"
            >
              <Facebook size={18} />
            </Link>
            <Link
              href="#"
              className="bg-secondary p-2 rounded-full hover:bg-white hover:text-primary transition"
            >
              <Instagram size={18} />
            </Link>
            <Link
              href="#"
              className="bg-secondary p-2 rounded-full hover:bg-white hover:text-primary transition"
            >
              <Twitter size={18} />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Bawah */}
      <div className="border-t border-white/40 text-center py-4 text-sm ">
        © {new Date().getFullYear()} Gema Nahdliyin Indonesia. All rights
        reserved.
      </div>
    </footer>
  );
}
