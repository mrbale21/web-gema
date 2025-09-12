"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BsPencilSquare } from "react-icons/bs";
import { FaPlus } from "react-icons/fa";
import { IoPersonCircleOutline } from "react-icons/io5";
import { MdDelete } from "react-icons/md";

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

export default function NewsListPage() {
  const [news, setNews] = useState<News[]>([]);
  const router = useRouter();

  const fetchNews = async () => {
    const res = await fetch("/api/news");
    const data = await res.json();
    setNews(data);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus berita ini?")) return;

    try {
      const res = await fetch(`/api/news/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Gagal menghapus berita");
        return;
      }

      fetchNews();
      alert("Berita berhasil dihapus");
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan");
    }
  };

  return (
    <div className="min-h-screen text-gray-800">
      <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
        <h1 className="text-gray-900 font-bold text-xl">Data Berita</h1>
        <button
          onClick={() => router.push("/admin/dashboard/news/add-news")}
          className="bg-primary text-white p-2 rounded-full hover:bg-primary/90 flex items-center gap-3"
        >
          <FaPlus />
        </button>
      </div>

      {/* === LIST BERITA === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-8">
        {news.map((item) => (
          <div
            key={item.id}
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
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <IoPersonCircleOutline className="text-lg lg:text-2xl text-primary" />
                  <span>{item.editor || "By Admin"}</span>
                </div>
                <div className="flex items-center gap-4">
                  {/* Update */}
                  <button
                    onClick={() =>
                      router.push(
                        `/admin/dashboard/news/add-news?id=${item.id}`
                      )
                    }
                  >
                    <BsPencilSquare className="text-xl text-blue-500 hover:text-blue-600" />
                  </button>

                  {/* Delete */}
                  <button onClick={() => handleDelete(item.id)}>
                    <MdDelete className="text-2xl text-red-500 hover:text-red-600" />
                  </button>
                </div>
              </div>

              <Link
                href={`/News/${item.slug}`}
                className="text-lg font-bold text-black hover:text-primary cursor-pointer"
              >
                {item.title}
              </Link>
              <div className="text-sm text-black/50">
                {new Date(item.createdAt).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <div
                className="text-sm text-black/60 line-clamp-3"
                dangerouslySetInnerHTML={{ __html: item.content }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
