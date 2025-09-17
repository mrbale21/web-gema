"use client";

import { useEffect, useState } from "react";
import { FaBullseye, FaLightbulb, FaQuoteLeft } from "react-icons/fa";
import LayoutPage from "../layout-page";
import Loading from "@/components/Common/Loading";

interface VisiMisi {
  id: number;
  title: string;
  subtitle: string;
  vs: string;
  ms: string;
  moto: string;
  titleMoto: string;
  visi: Visi[];
  misi: Misi[];
}

interface Visi {
  id: number;
  title: string;
}

interface Misi {
  id: number;
  title: string;
}

export default function VisiMisi() {
  const [data, setData] = useState<VisiMisi | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/visimisi")
      .then((res) => res.json())
      .then((json) => {
        if (json.length > 0) {
          setData(json[0]); // ambil 1 data pertama
        }
      })
      .catch((err) => console.error("masalah pada api", err))
      .finally(() => setLoading(false));
  }, []);
  if (loading) return <Loading fullScreen type="spinner" />;
  if (!data)
    return <Loading fullScreen type="spinner" text="data tidak vallid!" />;

  return (
    <>
      <LayoutPage
        title={data.title}
        titlePage={data.title}
        desc={data.subtitle}
      >
        <section className="bg-white py-8 px-4 md:px-12 lg:px-24">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
            {/* Visi */}
            <div className="bg-primary/10 p-8 rounded-xl shadow hover:shadow-lg transition duration-300">
              <div className="flex items-center gap-4 mb-4">
                <FaLightbulb className="text-primary text-4xl" />
                <h3 className="text-2xl font-bold text-primary lg:text-3xl">
                  {data.vs}
                </h3>
              </div>
              <p className="text-gray-700 leading-relaxed lg:text-lg">
                {data.visi.map((v) => v.title)}
              </p>
            </div>

            {/* Misi */}
            <div className="bg-primary/10 p-8 rounded-xl shadow hover:shadow-lg transition duration-300">
              <div className="flex items-center gap-4 mb-4">
                <FaBullseye className="text-primary text-4xl" />
                <h3 className="text-2xl font-bold text-primary lg:text-3xl">
                  {data.ms}
                </h3>
              </div>

              <ul className="list-disc list-outside pl-5 space-y-2 text-gray-700 leading-relaxed">
                {data.misi.map((m) => (
                  <li key={m.id}>{m.title}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Motto */}
        <section className="bg-gray-50 py-8 px-4 md:px-12 lg:px-24 mb-10">
          <div className="max-w-3xl mx-auto text-center">
            <FaQuoteLeft className="text-primary text-4xl mx-auto mb-4" />
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-3">
              Motto Gema Nahdliyin
            </h3>
            <p className="text-lg italic text-gray-700">
              Bersinergi, Berdaya, dan Berkah untuk Umat
            </p>
          </div>
        </section>
      </LayoutPage>
    </>
  );
}
