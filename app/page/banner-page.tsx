"use client";

import { BannerPageType } from "@/types/bannerpage";
import { useEffect, useState } from "react";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";

interface BannerPageProps {
  title: string;
  breadcrumb: string;
  desc: string;
}

const BannerPage = ({ title, breadcrumb, desc }: BannerPageProps) => {
  const [bannerPage, setBannerPage] = useState<BannerPageType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchBannerPage = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/bannerpage`);
      const data = await res.json();

      // kalau API return array → ambil data pertama
      const banner = Array.isArray(data) ? data[0] : data;

      if (!banner || !banner.id) {
        setBannerPage(null);
      } else {
        setBannerPage(banner);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Gagal mengambil data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBannerPage();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[300px] md:h-[600px]">
        <p className="text-white">Loading banner...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[300px] md:h-[600px] bg-gray-200">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative h-[300px] md:h-[600px] mb-10 mt-35">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: bannerPage?.image
            ? `url(${bannerPage.image})`
            : "url(/assets/images/banner-2.png)",
        }}
      ></div>

      {/* Overlay hitam transparan */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Konten */}
      <div className="relative flex items-center justify-center h-full flex-col gap-4">
        <div className="absolute top-10 left-10 flex items-center gap-4 text-xl text-white">
          <div className="text-secondary font-semibold">Home</div>
          <MdKeyboardDoubleArrowRight className="text-amber-500" />
          <div>{breadcrumb}</div>
        </div>
        <div className="text-white text-4xl lg:text-5xl xl:text-6xl font-bold text-center">
          {title}
        </div>
        <p className="text-white/80 md:text-xl w-1/2 text-center">{desc}</p>
      </div>
    </div>
  );
};

export default BannerPage;
