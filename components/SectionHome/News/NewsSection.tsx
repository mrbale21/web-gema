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
import { NewsType } from "@/types/news";

const ITEMS_PER_PAGE = 12;

export default function NewsSection({ limit }: { limit?: number }) {
  const [news, setNews] = useState<NewsType[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [selectedCategory, setSelectedCategory] = useState<number | "all">(
    "all"
  );

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

    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Gagal fetch categories:", err);
      }
    };

    fetchNews();
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-8 flex justify-center">
        <Loading type="spinner" text="Memuat berita..." />
      </section>
    );
  }

  // -------------------- FILTERING DATA --------------------
  const visibleNews = news.filter((item) => item.visibility !== "HIDDEN");

  // Filter berdasarkan kategori kalau dipilih
  const categoryFiltered =
    selectedCategory === "all"
      ? visibleNews
      : visibleNews.filter((item) => item.categoryId === selectedCategory);

  let displayedNews: NewsType[] = [];

  if (limit) {
    const headlines = categoryFiltered
      .filter((item) => item.visibility === "HEADLINE")
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );

    if (headlines.length >= limit) {
      displayedNews = headlines.slice(0, limit);
    } else {
      const others = categoryFiltered
        .filter((item) => item.visibility !== "HEADLINE")
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      displayedNews = [
        ...headlines,
        ...others.slice(0, limit - headlines.length),
      ];
    }
  } else {
    const sorted = [...categoryFiltered].sort((a, b) => {
      if (a.visibility === "HEADLINE" && b.visibility !== "HEADLINE") return -1;
      if (a.visibility !== "HEADLINE" && b.visibility === "HEADLINE") return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    displayedNews = sorted.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  }
  // --------------------------------------------------------

  const totalPages = Math.ceil(categoryFiltered.length / ITEMS_PER_PAGE);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const goToPage = (page: number) => setCurrentPage(page);

  return (
    <section className="py-16 bg-white pt-20">
      <div className="mx-auto px-4 md:px-8">
        {/* Heading */}
        <div className="text-center">
          <TextHeader
            title="Artikel | & Berita"
            desc="Update informasi terbaru dari Gema Nahdliyin Indonesia"
          />
        </div>

        {/* Filter Kategori */}
        {!limit && (
          <div className="flex justify-center mb-8">
            <select
              value={selectedCategory}
              onChange={(e) =>
                setSelectedCategory(
                  e.target.value === "all" ? "all" : Number(e.target.value)
                )
              }
              className="border border-primary text-primary bg-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        )}

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
                className="w-full h-56 object-cover object-center relative"
              />
              <div className="absolute">
                <div className="bg-primary m-3 px-2 rounded-lg text-sm text-white">
                  {item.category?.name || "category"}
                </div>
              </div>
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
                  dangerouslySetInnerHTML={{
                    __html:
                      item.content.length > 80
                        ? item.content.substring(0, 80) + "..."
                        : item.content,
                  }}
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

        {/* Pagination */}
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
