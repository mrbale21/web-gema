"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import { ArrowRight } from "lucide-react";
import TextHeader from "@/components/Common/TextHeader";
import ButtonReadMore from "@/components/Common/ButtonReadMore";
import Loading from "@/components/Common/Loading";

interface News {
  id: number;
  title: string;
  slug: string;
  tag: string;
  editor: string;
  content: string;
  image?: string | null;
  createdAt: string;
}

const ITEMS_PER_PAGE = 9;

export default function NewsSection({ limit }: { limit?: number }) {
  const [news, setNews] = useState<News[]>([]);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/news");
        const data = await res.json();
        setNews(data);
      } catch (err) {
        console.error("Gagal fetch news:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (loading) {
    return (
      <section className="py-8 flex justify-center">
        <Loading type="spinner" text="Memuat berita..." />
      </section>
    );
  }

  const totalPages = Math.ceil(news.length / ITEMS_PER_PAGE);

  const paginatedData = news.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const goToPage = (page: number) => setCurrentPage(page);

  // Data ditampilkan: limit kalau ada, kalau tidak pakai paginatedData
  const displayedNews = limit ? news.slice(0, limit) : paginatedData;

  return (
    <section className="py-16 bg-white pt-30">
      <div className=" mx-auto px-4 md:px-8">
        {/* Heading */}
        <div className="text-center mb-12">
          <TextHeader
            title="Artikel | & Berita"
            desc="Update informasi terbaru dari Gema Nahdliyin Indonesia"
          />
        </div>

        {/* Tombol Selengkapnya (hanya muncul kalau ada limit) */}
        {limit && (
          <div
            onClick={() => router.push("/page/news")}
            className="w-full flex md:justify-end justify-center pb-10 cursor-pointer"
          >
            <ButtonReadMore title="Selengkapnya" />
          </div>
        )}

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedNews.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <img
                src={item.image || "no image"}
                alt={item.title}
                className="w-full h-56 object-cover object-center"
              />
              <div className="p-5 flex flex-col flex-grow">
                <span className="text-secondary text-sm font-semibold">
                  {new Date(item.createdAt).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <h3 className="text-lg font-bold mt-2 mb-3">{item.title}</h3>
                <div
                  className="text-gray-600 flex-grow"
                  dangerouslySetInnerHTML={{ __html: item.content }}
                />
                <button
                  onClick={() => router.push(`/page/news/${item.id}`)}
                  className="mt-4 inline-flex items-center text-primary font-semibold hover:underline"
                >
                  Baca Selengkapnya <ArrowRight size={18} className="ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination hanya muncul kalau tidak ada limit */}
        {!limit && totalPages > 1 && (
          <div className="flex flex-wrap justify-center items-center gap-2 mt-10">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-4 py-1 bg-secondary rounded disabled:opacity-50 group hover:bg-primary"
            >
              <MdKeyboardDoubleArrowLeft size={25} className="text-white" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i + 1)}
                className={`px-3 py-1 rounded hover:border hover:border-secondary ${
                  currentPage === i + 1
                    ? "bg-secondary text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-1 bg-secondary rounded disabled:opacity-50 group hover:bg-primary"
            >
              <MdKeyboardDoubleArrowRight
                size={25}
                className="text-white group-hover:text-white"
              />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
