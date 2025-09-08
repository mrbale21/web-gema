"use client";

import { useState, useEffect } from "react";
import { FaCommentDots } from "react-icons/fa6";
import { IoPersonCircleOutline } from "react-icons/io5";
import { RiShareBoxFill } from "react-icons/ri";
import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";
import Link from "next/link";
import LayoutPage from "../layout-page";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

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

const ITEMS_PER_PAGE = 6;

export default function NewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const totalPages = Math.ceil(news.length / ITEMS_PER_PAGE);

  const paginatedData = news.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    const fetchNews = async () => {
      const res = await fetch("/api/news");
      const data = await res.json();
      setNews(data);
    };
    fetchNews();
  }, []);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <LayoutPage title="Berita" titlePage="Berita" desc="Berita">
      <div className="px-4 py-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedData.map((item, idx) => (
            <div
              key={idx}
              className="bg-accent rounded-md overflow-hidden shadow-sm"
            >
              <div className="relative w-full h-56">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  "No Image"
                )}
              </div>
              <div className="p-6 flex flex-col gap-4">
                <div className="flex justify-between items-center text-sm ">
                  <div className="flex items-center gap-2">
                    <IoPersonCircleOutline className="text-lg lg:text-2xl text-primary" />
                    <span>{item.editor || "By Admin"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCommentDots className="text-sm lg:text-lg text-primary" />
                    <span>2 Comment</span>
                  </div>
                  <Link href={`/News/${item.slug}`}>
                    <RiShareBoxFill className="text-xl text-black/50 hover:text-black" />
                  </Link>
                </div>

                <Link
                  href={`/News/${item.slug}`}
                  className="text-lg font-bold text-black hover:text-primary cursor-pointer"
                >
                  {item.title}
                </Link>
                <p className="text-sm text-black/50">{item.createdAt}</p>
                <p className="text-sm text-black/60">{item.content}</p>
                <button
                  onClick={() => router.push(`/news/${item.id}`)}
                  className="mt-4 inline-flex items-center text-primary font-semibold hover:underline"
                >
                  Baca Selengkapnya <ArrowRight size={18} className="ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination controls */}
        <div className="flex justify-center mt-10 gap-4 text-black/70 items-center flex-wrap">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="text-2xl hover:text-secondary disabled:opacity-50"
          >
            <FaLongArrowAltLeft />
          </button>

          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToPage(index + 1)}
              className={`px-4 py-2 text-sm rounded-md border ${
                currentPage === index + 1
                  ? "bg-primary text-white"
                  : "border-gray-300 hover:bg-gray-100"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="text-2xl hover:text-secondary disabled:opacity-50"
          >
            <FaLongArrowAltRight />
          </button>
        </div>
      </div>
    </LayoutPage>
  );
}
