"use client";

import Image from "next/image";
import statisticData from "@/data/statData";
import { StatisticType } from "@/types/statistic";
import { useEffect, useState } from "react";
import Loading from "../Common/Loading";

export default function StatisticSection() {
  const [statistic, setStatistic] = useState<StatisticType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/statistic`)
      .then((res) => res.json())
      .then((json) => {
        if (Array.isArray(json)) {
          setStatistic(json);
        } else {
          setStatistic([json]);
        }
      })
      .catch((err) => console.error("Error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading type="spinner" text="Memuat statistik..." />;
  if (!statistic)
    return <Loading type="spinner" text="Data Tidak Ditemukan!" />;

  return (
    <section className="bg-accent w-full">
      <div className="max-w-6xl mx-auto py-16 px-4 md:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8 text-center">
          {statistic.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="relative w-[70px] h-[70px] md:w-[90px] md:h-[90px] mb-4">
                <Image
                  src={item.image ?? "/assets/images/placeholder.png"}
                  alt={item.name}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="text-3xl md:text-5xl font-extrabold text-gray-800">
                {item.count} +
              </div>
              <div className="text-base md:text-lg font-medium text-gray-700 mt-2">
                {item.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
