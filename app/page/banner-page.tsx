"use client";

import { MdKeyboardDoubleArrowRight } from "react-icons/md";

interface BannerPageProps {
  title: string;
  breadcrumb: string;
  desc: string;
}

const BannerPage = ({ title, breadcrumb, desc }: BannerPageProps) => {
  return (
    <div className="relative h-[300px] md:h-[600px] mb-10 mt-35">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/assets/images/banner-2.png')",
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
