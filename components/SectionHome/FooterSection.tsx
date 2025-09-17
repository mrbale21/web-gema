"use client";

import { TenantType } from "@/types/tenant";
import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Loading from "../Common/Loading";

export default function FooterSection() {
  const [tenant, setTenant] = useState<TenantType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const res = await fetch("/api/tenant");
        if (!res.ok) throw new Error("Failed to fetch tenant");

        const json = await res.json();
        setTenant(Array.isArray(json) ? json[0] : json);
      } catch (err) {
        console.error("Invalid API", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTenant();
  }, []);

  if (loading) return <Loading type="spinner" text="Memuat footer..." />;
  if (!tenant) return <Loading type="spinner" text="Data Tidak Ditemukan!" />;

  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Logo & Deskripsi */}
        <div>
          <h2 className="text-2xl font-bold">{tenant.nameTenant}</h2>
          <p className="mt-4 text-sm leading-relaxed">{tenant.desc}</p>
        </div>

        {/* Navigasi */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Navigasi Cepat</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-secondary">
                Beranda
              </Link>
            </li>
            <li>
              <Link href="/page/profile" className="hover:text-secondary">
                Profile
              </Link>
            </li>
            <li>
              <Link href="/page/news" className="hover:text-secondary">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/page/contact" className="hover:text-secondary">
                Kontak
              </Link>
            </li>
          </ul>
        </div>

        {/* Kontak */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Kontak Kami</h3>
          <ul className="space-y-3 text-sm">
            {tenant.address && (
              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-1" />
                {tenant.address}
              </li>
            )}
            {tenant.phone && (
              <li className="flex items-center gap-3">
                <Phone size={18} />
                {tenant.phone}
              </li>
            )}
            {tenant.email && (
              <li className="flex items-center gap-3">
                <Mail size={18} />
                {tenant.email}
              </li>
            )}
          </ul>
        </div>

        {/* Sosial Media */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Ikuti Kami</h3>
          <div className="flex gap-4">
            {tenant.linkFacebook && (
              <Link
                href={tenant.linkFacebook}
                target="_blank"
                className="bg-secondary p-2 rounded-full hover:bg-white hover:text-primary transition"
              >
                <Facebook size={18} />
              </Link>
            )}
            {tenant.linkInstagram && (
              <Link
                href={tenant.linkInstagram}
                target="_blank"
                className="bg-secondary p-2 rounded-full hover:bg-white hover:text-primary transition"
              >
                <Instagram size={18} />
              </Link>
            )}
            {tenant.linkTwitter && (
              <Link
                href={tenant.linkTwitter}
                target="_blank"
                className="bg-secondary p-2 rounded-full hover:bg-white hover:text-primary transition"
              >
                <Twitter size={18} />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Footer Bawah */}
      <div className="border-t border-white/40 text-center py-4 text-sm">
        © {new Date().getFullYear()} {tenant.copyRight ?? tenant.nameTenant}.
        All rights reserved.
      </div>
    </footer>
  );
}
