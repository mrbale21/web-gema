"use client";

import { useEffect, useState } from "react";
import AboutSection from "@/components/SectionHome/AboutSection";
import AdmissionSection from "@/components/SectionHome/AdMissionSection";
import BannerSection from "@/components/SectionHome/banner-section";
import Chairman from "@/components/SectionHome/Chairman";
import FooterSection from "@/components/SectionHome/FooterSection";
import NavbarSection from "@/components/SectionHome/Navbar/NavbarSection";
import NewsSection from "@/components/SectionHome/News/NewsSection";
import PartnerSection from "@/components/SectionHome/PartnerSection";
import ProductSection from "@/components/SectionHome/ProductSection";
import ServiceSection from "@/components/SectionHome/ServiceSection";
import StatisticSection from "@/components/SectionHome/StatisticSection";
import VideoSection from "@/components/SectionHome/VideoSection";
import Loading from "@/components/Common/Loading";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Loading global simulasi 1 detik
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loading fullScreen type="spinner" />;
  }

  return (
    <div className="max-h-auto w-full bg-white text-gray-800 overflow-hidden">
      <NavbarSection />
      <BannerSection />
      <AboutSection />
      <ProductSection />
      <Chairman />
      <ServiceSection />
      <VideoSection />
      <StatisticSection />
      <AdmissionSection />
      <NewsSection limit={4} />
      <PartnerSection />
      <FooterSection />
    </div>
  );
}
