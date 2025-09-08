"use client";

import React, { useEffect, useState } from "react";
import {
  Calendar,
  User,
  Eye,
  ThumbsUp,
  Share2,
  ArrowLeft,
  MessageCircle,
} from "lucide-react";

import Link from "next/link";

import { useParams, useSearchParams } from "next/navigation";
import { FaPersonRifle } from "react-icons/fa6";
import LayoutPage from "../../layout-page";

interface Comment {
  id: number;
  name: string;
  slug: string;
  comment: string;
  status: string;
  createdAt: string;
}

const NewsDetailPage = () => {
  const [comment, setComment] = useState<Comment[]>([]);
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<any>(null);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("");
  const [loadingComment, setLoadingComment] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(`/api/news/${id}`)
        .then((res) => res.json())
        .then((data) => setNews(data));
    }
  }, [id]);

  const fetchComments = async () => {
    try {
      setLoadingComment(true);
      const res = await fetch(`/api/news/${id}/comments`);
      if (!res.ok) throw new Error("Gagal mengambil komentar");
      const data = await res.json();
      setComment(data);
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setLoadingComment(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchComments();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`/api/news/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          comment: content, // isi komentar
          status,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setName("");
      setContent("");
      setStatus("");

      fetchComments();
      alert("Komentar berhasil ditambahkan");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  const [likes, setLikes] = useState(47);
  const [isLiked, setIsLiked] = useState(false);

  const relatedNews = [
    {
      id: 2,
      title: "Prestasi Gemilang Tim Robotika di Kompetisi Nasional",
      image:
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300&h=200&fit=crop",
      date: "2024-08-03",
      category: "Prestasi",
    },
    {
      id: 3,
      title: "Program Beasiswa untuk Siswa Berprestasi",
      image:
        "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=300&h=200&fit=crop",
      date: "2024-08-01",
      category: "Akademik",
    },
    {
      id: 4,
      title: "Kerjasama dengan Universitas Terkemuka",
      image:
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=300&h=200&fit=crop",
      date: "2024-07-30",
      category: "Kemitraan",
    },
  ];

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  // const handleCommentSubmit = () => {
  //   if (newComment.name && newComment.comment) {
  //     const comment = {
  //       id: comments.length + 1,
  //       ...newComment,
  //       date: new Date().toISOString().split("T")[0],
  //       avatar: newComment.name
  //         .split(" ")
  //         .map((n) => n[0])
  //         .join("")
  //         .toUpperCase(),
  //     };
  //     setComments([...comments, comment]);
  //     setNewComment({ name: "", role: "", comment: "" });
  //   }
  // };

  const handleShare = () => {
    navigator.share
      ? navigator.share({ title: "Berita Sekolah", url: window.location.href })
      : navigator.clipboard.writeText(window.location.href);
  };
  if (!news) return <p>Loading...</p>;
  return (
    <LayoutPage
      title="Detail Berita"
      titlePage="Detail Berita"
      desc="Detail Beritaaa"
    >
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}

          {news && (
            <div className="lg:col-span-2">
              <article className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* Hero Image */}

                <div className="relative h-96 bg-primary">
                  {news.image ? (
                    <img
                      src={news.image}
                      alt={news.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-white text-xl">
                      No Image
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                      Kegiatan Sekolah
                    </span>
                  </div>
                </div>

                {/* Article Content */}
                <div className="p-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {news.title}
                  </h1>

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center text-gray-500 text-sm mb-6 gap-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {news.createdAt}
                    </div>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      {news.editor}
                    </div>
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-2" />
                      1,234 views
                    </div>
                  </div>

                  {/* Article Body */}
                  <div className="prose max-w-none text-gray-700 leading-relaxed">
                    <p className="mb-6 text-lg">{news.content}</p>

                    <p className="mb-6">
                      Kegiatan yang berlangsung selama tiga hari ini
                      menghadirkan para ahli teknologi dari berbagai perusahaan
                      startup terkemuka. Materi yang diajarkan meliputi
                      dasar-dasar pemrograman, desain grafis, digital marketing,
                      dan pengembangan aplikasi mobile.
                    </p>

                    <p className="mb-6">
                      "Kami berharap melalui workshop ini, siswa dapat lebih
                      siap menghadapi tantangan era digital dan memiliki bekal
                      yang cukup untuk melanjutkan pendidikan ke jenjang yang
                      lebih tinggi," ujar Kepala Sekolah, Dr. Ahmad Wijaya,
                      S.Pd., M.Pd.
                    </p>

                    <p className="mb-6">
                      Workshop ini juga dilengkapi dengan sesi praktik langsung,
                      dimana siswa dapat mencoba mengimplementasikan ilmu yang
                      telah dipelajari. Setiap peserta akan mendapat sertifikat
                      yang dapat menjadi nilai tambah dalam portofolio mereka.
                    </p>

                    <p>
                      Antusiasme siswa terhadap kegiatan ini sangat tinggi,
                      terlihat dari partisipasi aktif mereka selama kegiatan
                      berlangsung. Kedepannya, sekolah berencana untuk
                      mengadakan workshop serupa secara berkala.
                    </p>
                  </div>

                  {/* Social Actions */}
                  <div className="flex flex-col gap-4 sm:flex-row items-center justify-between mt-8 pt-6 border-t">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={handleLike}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                          isLiked
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                        }`}
                      >
                        <ThumbsUp
                          className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`}
                        />
                        <span>{likes}</span>
                      </button>
                      <button
                        onClick={handleShare}
                        className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <Share2 className="w-5 h-5" />
                        <span>Bagikan</span>
                      </button>
                    </div>

                    <div className="flex items-center text-gray-500 text-sm">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      {comment.length} Komentar
                    </div>
                  </div>
                </div>
              </article>

              {/* Comments Section */}
              <div className="bg-white rounded-xl shadow-sm mt-8 p-4 sm:p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Komentar ({comment.length})
                </h3>

                {/* Comment Form */}
                <div className="mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Nama Anda"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="placeholder-gray-400 text-black/70 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Status (opsional)"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="placeholder-gray-400 text-black/70 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <textarea
                    placeholder="Tulis komentar Anda..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="placeholder-gray-400 text-black/70 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                    rows={4}
                  ></textarea>
                  <button
                    onClick={handleSubmit}
                    className="bg-primary  text-white px-6 py-3 rounded-lg hover:bg-secondary transition-colors font-medium"
                  >
                    Kirim Komentar
                  </button>
                </div>

                {/* Comments List */}
                <div className="space-y-6">
                  {comment.map((comment) => (
                    <div key={comment.id} className="flex space-x-4">
                      <div className="flex-shrink-2">
                        <div className=" w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-full flex items-center justify-center text-white font-medium text-sm">
                          <FaPersonRifle />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex text-sm sm:text-base items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-900">
                            {comment.name}
                          </h4>
                          {comment.status && (
                            <span className="text-xs sm:text-sm text-gray-500">
                              • {comment.status}
                            </span>
                          )}
                          <span className="text-xs sm:text-sm text-gray-400">
                            • {comment.createdAt}
                          </span>
                        </div>
                        <p className="text-gray-700">{comment.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Related News */}
            <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col ">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Berita Terkait
              </h3>
              <div className="space-y-6">
                {relatedNews.map((news) => (
                  <div key={news.id} className="group cursor-pointer">
                    <div className="flex space-x-4">
                      <div className="flex-shrink-0">
                        <img
                          src={news.image}
                          alt={news.title}
                          className="w-20 h-20 object-cover rounded-lg group-hover:opacity-80 transition-opacity"
                        />
                      </div>
                      <div className="flex-1">
                        <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full mb-2">
                          {news.category}
                        </span>
                        <h4 className="font-medium text-gray-900 group-hover:text-secondary transition-colors line-clamp-2 mb-2">
                          {news.title}
                        </h4>
                        <p className="text-sm text-gray-500">{news.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href={"/News"}
                className="text-center w-full mt-6 hover:text-secondary font-medium text-primary transition-colors"
              >
                Lihat Semua Berita →
              </Link>
            </div>

            {/* Quick Info */}
            <div className="bg-primary rounded-xl p-6 text-white">
              <h3 className="text-lg font-bold mb-4">Informasi Sekolah</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <strong>Alamat:</strong>
                  <br />
                  Jl. Pendidikan No. 123
                  <br />
                  Jakarta Selatan 12345
                </div>
                <div>
                  <strong>Telepon:</strong>
                  <br />
                  (021) 123-4567
                </div>
                <div>
                  <strong>Email:</strong>
                  <br />
                  info@smamajubersama.sch.id
                </div>
              </div>
              <button className="w-full mt-4 bg-white hover:bg-secondary hover:text-white text-primary py-2 rounded-lg font-medium transition-colors">
                Hubungi Kami
              </button>
            </div>
          </div>
        </div>
      </div>
    </LayoutPage>
  );
};

export default NewsDetailPage;
