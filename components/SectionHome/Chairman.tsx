"use client";

import { Award, Quote } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface ChairmanData {
  id: number;
  name: string;
  title: string;
  sub1: string;
  sub2: string;
  desc: string;
  position: string;
  city: string;
  period: string;
  ToS: string;
  createdAt: string;
  image?: string;
}

export default function Chairman() {
  const [chairman, setChairman] = useState<ChairmanData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/chairman`)
      .then((res) => res.json())
      .then((json) => {
        // cek apakah array atau object
        if (Array.isArray(json)) {
          setChairman(json[0]); // ambil yang pertama
        } else {
          setChairman(json);
        }
      })
      .catch((err) => console.error("Error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!chairman) return <p>Tidak ada data Ketua</p>;

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Sambutan <span className="text-primary">Ketua Umum</span>
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Foto Ketua Umum */}
          <div className="relative">
            <div className="relative bg-accent rounded-3xl p-8 lg:p-12">
              <div className="absolute top-4 right-4 w-20 h-20 bg-primary rounded-full opacity-50"></div>
              <div className="absolute bottom-4 left-4 w-16 h-16 bg-secondary rounded-full opacity-30"></div>

              <div className="relative bg-primary rounded-2xl aspect-[3/4] flex items-center justify-center overflow-hidden">
                <Image
                  src={chairman.image || "/default.jpg"}
                  alt={chairman.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="mt-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {chairman.name}
                </h3>
                <p className="text-primary font-semibold">
                  {chairman.position}
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  Periode {chairman.period}
                </p>
              </div>
            </div>

            {/* Achievement Card */}
            <div className="absolute -right-4 top-20 bg-white rounded-xl shadow-lg p-4 border-l-4 border-primary hidden lg:block">
              <div className="flex items-center space-x-3">
                <Award className="w-6 h-6 text-secondary" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {chairman.ToS}
                  </p>
                  <p className="text-gray-600 text-xs">
                    Bakti untuk Organisasi
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sambutan Ketua Umum */}
          <div className="space-y-8">
            <div className="relative">
              <Quote className="w-12 h-12 text-secondary opacity-20 absolute -top-2 -left-2" />
              <blockquote className="text-2xl lg:text-3xl font-light text-gray-700 leading-relaxed italic pl-8">
                {chairman.title}
              </blockquote>
            </div>

            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p className="text-lg">
                <span className="font-semibold text-gray-900">
                  {chairman.sub1}
                </span>
              </p>

              <p>{chairman.desc}</p>

              <p className="text-lg font-medium text-gray-900">
                {chairman.sub2}
              </p>
            </div>

            {/* Tanda Tangan */}
            <div className="pt-6">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-900">{chairman.name}</p>
                    <p className="text-primary">{chairman.position}</p>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <p>
                      {chairman.city}, {chairman.createdAt}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
