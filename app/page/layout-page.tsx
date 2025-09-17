"use client";

import { useState, useEffect } from "react";
import FooterSection from "@/components/SectionHome/FooterSection";
import NavbarSection from "@/components/SectionHome/Navbar/NavbarSection";
import BannerPage from "./banner-page";
import Loading from "@/components/Common/Loading";

interface LayoutPageProps {
  children: React.ReactNode;
  title: string;
  titlePage: string;
  desc: string;
}

export default function LayoutPage({
  children,
  title,
  titlePage,
  desc,
}: LayoutPageProps) {
  const [loading, setLoading] = useState(true);

  // Simulasi loading saat halaman pertama kali render
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800); // contoh delay 0.8s
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-h-auto w-full bg-white text-gray-800 relative">
      <NavbarSection />
      <BannerPage title={title} breadcrumb={titlePage} desc={desc} />

      {/* Kalau loading true, tampilkan overlay full screen */}
      {loading && <Loading fullScreen type="spinner" />}

      {children}

      <FooterSection />
    </div>
  );
}
