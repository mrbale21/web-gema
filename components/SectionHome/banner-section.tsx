"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { IoMdArrowRoundForward } from "react-icons/io";
import {
  MdOutlineArrowBackIos,
  MdOutlineArrowForwardIos,
} from "react-icons/md";

import ButtonPrimary from "../Common/ButtonPrimary";
import { BannerType } from "@/types/banner";

export default function BannerSection() {
  const [allBanner, setAllBanner] = useState<BannerType[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const fetchBanner = async () => {
    const res = await fetch("/api/banner");
    const data = await res.json();
    setAllBanner(data);
  };

  useEffect(() => {
    fetchBanner();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % allBanner.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + allBanner.length) % allBanner.length);
  };

  useEffect(() => {
    if (allBanner.length === 0) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [allBanner.length]);

  return (
    <div className="relative w-full h-screen overflow-hidden mt-22 lg:mt-36">
      {/* Wrapper semua slide */}
      <div
        className="flex h-full transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {allBanner.map(({ image, title, subtitle, desc }, index) => (
          <div
            key={index}
            className="w-full flex-shrink-0 h-full relative bg-cover bg-center"
            style={{ backgroundImage: `url(${image})` }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70"></div>

            {/* Konten teks */}
            <div className="relative z-10 px-[12px] md:px-[64px] xl:px-0 max-w-[1320px] mx-auto h-full flex flex-col justify-center items-center text-white text-center">
              <h1 className="font-chivo font-bold text-3xl md:text-6xl lg:text-7xl max-w-4xl mb-4">
                {title}
              </h1>
              <h2 className="text-xl md:text-3xl font-bold text-amber-300 mb-4 lg:py-4">
                {subtitle}
              </h2>
              <p className="max-w-2xl text-lg md:text-xl mb-6">{desc}</p>

              <div className="flex items-center gap-4">
                <ButtonPrimary href="#" label="Gabung Mitra" />
                <Link
                  href="/profile-page"
                  className="flex items-center font-bold text-sm group sm:text-lg gap-2 hover:underline hover:text-secondary"
                >
                  Lihat Profil
                  <IoMdArrowRoundForward className="ml-1 text-sm sm:text-xl group-hover:ml-0" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tombol prev/next */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full z-20"
      >
        <MdOutlineArrowBackIos size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full z-20"
      >
        <MdOutlineArrowForwardIos size={24} />
      </button>

      {/* Indikator carousel */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {allBanner.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSlide === index ? "bg-white scale-110" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
