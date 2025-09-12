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
  tag: string;
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
  const [allNews, setAllNews] = useState<any[]>([]);
  const [allTenant, setAllTenant] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/news")
      .then((res) => res.json())
      .then((data) => setAllNews(data));
  }, []);

  useEffect(() => {
    fetch("/api/tenant")
      .then((res) => res.json())
      .then((data) => setAllTenant(data));
  }, []);

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

  const tenantData = allTenant;

  const relatedNews = allNews
    .filter((item) => item.id !== Number(id))
    .slice(0, 3);

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
      desc={news.title}
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
                      {news.tag}
                    </span>
                  </div>
                </div>

                {/* Article Content */}
                <div className="p-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {news.title}
                  </h1>

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center text-gray-500 text-sm mb-6 gap-8">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(news.createdAt).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      {news.editor}
                    </div>
                  </div>

                  {/* Article Body */}
                  <div className="prose max-w-none text-gray-700 leading-relaxed">
                    <div
                      className="mb-6 text-lg"
                      dangerouslySetInnerHTML={{ __html: news.content }}
                    />
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
                href={"/page/news"}
                className="text-center w-full mt-6 hover:text-secondary font-medium text-primary transition-colors"
              >
                Lihat Semua Berita →
              </Link>
            </div>

            {/* Quick Info */}
            {tenantData.map((tenant) => (
              <div className="bg-primary rounded-xl p-6 text-white">
                <h3 className="text-lg font-bold mb-4">Informasi Sekolah</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <strong>Alamat:</strong>
                    <br />
                    {tenant.address}
                  </div>
                  <div>
                    <strong>Telepon:</strong>
                    <br />
                    {tenant.phone}
                  </div>
                  <div>
                    <strong>Email:</strong>
                    <br />
                    {tenant.email}
                  </div>
                </div>
                <button className="w-full mt-4 bg-white hover:bg-secondary hover:text-white text-primary py-2 rounded-lg font-medium transition-colors">
                  Hubungi Kami
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </LayoutPage>
  );
};

export default NewsDetailPage;
