"use client";

import Image from "next/image";
import partnerData from "@/data/partrnerData";
import Marquee from "react-fast-marquee";
import { useEffect, useState } from "react";
import { PartnerType } from "@/types/partner";

export default function PartnerSection() {
  const [partner, setPartner] = useState<PartnerType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/partner`)
      .then((res) => res.json())
      .then((json) => {
        if (Array.isArray(json)) {
          setPartner(json);
        } else {
          setPartner([json]);
        }
      })
      .catch((err) => console.error("Error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!partner) return <p>Tidak ada data Partner..</p>;

  const data = [...partner, ...partner];

  return (
    <div className=" w-full">
      <div className="flex justify-center items-center py-8">
        <Marquee speed={40} pauseOnHover gradient={false}>
          <div className="flex items-center gap-10 px-8">
            {data.map((item, idx) => (
              <div
                key={idx}
                className="relative w-[80px] h-[80px] flex-shrink-0"
              >
                <Image
                  src={item.image ?? "/assets/images/placeholder.png"}
                  alt={`Partner ${idx + 1}`}
                  fill
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </Marquee>
      </div>
    </div>
  );
}
