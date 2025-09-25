"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BsPencilSquare } from "react-icons/bs";
import { FaPlus } from "react-icons/fa";
import { IoPersonCircleOutline } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { NewsType, NewsVisibility } from "@/types/news";
import ConfirmAlert from "@/components/Common/ConfirmAlert";
import Alert from "@/components/Common/Alert";

export default function NewsListPage() {
  const [news, setNews] = useState<NewsType[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>(""); // filter kategori
  const router = useRouter();

  const [alert, setAlert] = useState<{
    type: "success" | "error" | "warning" | "info";
    message: string;
    show?: boolean;
    onClose?: () => void;
    onConfirm?: () => void;
    onCancel?: () => void;
  } | null>(null);

  const fetchNews = async () => {
    try {
      const res = await fetch("/api/news");
      const data = await res.json();
      setNews(data);
    } catch (err) {
      console.error("Gagal fetch berita:", err);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleDelete = async (id: number) => {
    setAlert({
      type: "warning",
      message: `Apakah anda yakin ingin menghapus ?`,
      show: true,
      onConfirm: async () => {
        setAlert(null);
        try {
          const res = await fetch(`/api/news/${id}`, { method: "DELETE" });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Gagal hapus data");
          fetchNews();
          setAlert({
            type: "success",
            message: "Data berhasil dihapus!",
            show: true,
          });
        } catch (err: any) {
          setAlert({
            type: "error",
            message: err.message || "Terjadi kesalahan",
            show: true,
          });
        }
      },
      onCancel: () => setAlert(null),
    });
  };

  const handleChangeVisibility = async (
    id: number,
    visibility: NewsVisibility
  ) => {
    try {
      const res = await fetch(`/api/news/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visibility }),
      });
      if (!res.ok) throw new Error("Gagal update Status Publikasi");
      setAlert({
        type: "success",
        message: "Status Publikasi berhasil diperbarui!",
        show: true,
      });
      fetchNews();
    } catch (err: any) {
      setAlert({
        type: "error",
        message: err.message || "Terjadi kesalahan",
        show: true,
      });
    }
  };

  // === Filter & Sorting ===
  const filteredNews = news
    .filter((n) =>
      categoryFilter ? n.category?.name === categoryFilter : true
    )
    .sort((a, b) => {
      // Headline selalu pertama
      if (a.visibility === "HEADLINE" && b.visibility !== "HEADLINE") return -1;
      if (a.visibility !== "HEADLINE" && b.visibility === "HEADLINE") return 1;

      // Publish terbaru
      if (a.visibility === "ALL" && b.visibility === "ALL") {
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      }

      // Publish tampil sebelum hidden atau lainnya
      if (a.visibility === "ALL" && b.visibility !== "ALL") return -1;
      if (a.visibility !== "ALL" && b.visibility === "ALL") return 1;

      // Sisanya berdasarkan update terbaru
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  // Ambil daftar kategori unik untuk filter dropdown
  const categories = Array.from(
    new Set(news.map((n) => n.category?.name).filter(Boolean))
  );

  return (
    <div className="min-h-screen text-gray-800">
      {alert && alert.onConfirm ? (
        <ConfirmAlert
          type={alert.type}
          message={alert.message}
          show={alert.show ?? true}
          onConfirm={alert.onConfirm}
          onCancel={alert.onCancel}
        />
      ) : (
        alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            duration={6000}
            onClose={() => setAlert(null)}
          />
        )
      )}

      <div className="flex justify-between gap-4 items-center mb-6">
        <h1 className="text-gray-900 font-bold text-xl">Data Berita</h1>
        <div className="flex gap-2">
          {/* Dropdown Filter Kategori */}
          {categories.length > 0 && (
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 text-sm"
            >
              <option value="">Semua Kategori</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}
          <button
            onClick={() => router.push("/admin/dashboard/news/add-news")}
            className="bg-primary text-white p-2 px-4 rounded-lg hover:bg-primary/90 flex items-center gap-3"
          >
            <FaPlus /> Tambah Berita
          </button>
        </div>
      </div>

      {/* === LIST BERITA === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredNews.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
          >
            {/* Image Section */}
            <div className="relative w-full h-48 overflow-hidden">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="text-gray-400 text-center">
                    <svg
                      className="mx-auto w-12 h-12 mb-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-sm font-medium">No Image</p>
                  </div>
                </div>
              )}

              {/* Visibility Badge */}
              <div className="absolute top-3 left-3">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold shadow-sm ${
                    item.visibility === "HEADLINE"
                      ? "bg-red-500 text-white"
                      : item.visibility === "ALL"
                      ? "bg-green-500 text-white"
                      : "bg-gray-500 text-white"
                  }`}
                >
                  {item.visibility === "HEADLINE"
                    ? "🏆 Headline"
                    : item.visibility === "ALL"
                    ? "✨ Published"
                    : "👁️ Hidden"}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="absolute top-3 right-3 flex gap-1">
                <button
                  onClick={() =>
                    router.push(`/admin/dashboard/news/add-news?id=${item.id}`)
                  }
                  className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-white transition-all duration-200 hover:scale-110"
                  title="Edit Berita"
                >
                  <BsPencilSquare className="text-blue-500 w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-white transition-all duration-200 hover:scale-110"
                  title="Hapus Berita"
                >
                  <MdDelete className="text-red-500 w-4 h-4" />
                </button>
              </div>

              {/* Category Tag */}
              {item.category?.name && (
                <div className="absolute bottom-3 left-3">
                  <span className="bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                    {item.category.name}
                  </span>
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="p-5">
              <div className="block mb-3 group">
                <h3 className="text-lg font-bold text-gray-900 transition-colors duration-200 line-clamp-2 leading-tight">
                  {item.title}
                </h3>
              </div>
              <div
                className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: item.content }}
              />
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <IoPersonCircleOutline className="text-gray-400 w-5 h-5" />
                  <span className="text-sm text-gray-600 font-medium">
                    {item.editor || "Admin"}
                  </span>
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {new Date(item.createdAt).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </div>

              {/* Enhanced Visibility Controls */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 block">
                  Status Publikasi
                </label>
                <div className="flex flex-wrap gap-2">
                  {(["HEADLINE", "ALL", "HIDDEN"] as NewsVisibility[]).map(
                    (option) => (
                      <button
                        key={option}
                        onClick={() => handleChangeVisibility(item.id, option)}
                        className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1 ${
                          item.visibility === option
                            ? option === "HEADLINE"
                              ? "bg-red-500 text-white shadow-md transform scale-105"
                              : option === "ALL"
                              ? "bg-green-500 text-white shadow-md transform scale-105"
                              : "bg-gray-500 text-white shadow-md transform scale-105"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:shadow-sm hover:scale-105"
                        }`}
                      >
                        {option === "HEADLINE" ? (
                          <>🏆 Headline</>
                        ) : option === "ALL" ? (
                          <>✨ Publish</>
                        ) : (
                          <>👁️ Hidden</>
                        )}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
