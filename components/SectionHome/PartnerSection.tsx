import Image from "next/image";
import partnerData from "@/data/partrnerData";
import Marquee from "react-fast-marquee";

export default function PartnerSection() {
  // Duplikasikan partnerData biar transisi lebih mulus
  const data = [...partnerData, ...partnerData];

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
                  src={item.image}
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
