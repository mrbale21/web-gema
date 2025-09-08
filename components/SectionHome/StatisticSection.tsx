import Image from "next/image";
import statisticData from "@/data/statData";

export default function StatisticSection() {
  return (
    <section className="bg-accent w-full">
      <div className="max-w-6xl mx-auto py-16 px-4 md:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8 text-center">
          {statisticData.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="relative w-[70px] h-[70px] md:w-[90px] md:h-[90px] mb-4">
                <Image
                  src={item.image}
                  alt={item.desc}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="text-3xl md:text-5xl font-extrabold text-gray-800">
                {item.amount}
              </div>
              <div className="text-base md:text-lg font-medium text-gray-700 mt-2">
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
