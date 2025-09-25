"use client";

import React, { useEffect, useState } from "react";
import { NewsType } from "@/types/news";
import { CommentType } from "@/types/comments";

export default function DashboardCommentsPage() {
  const [newsList, setNewsList] = useState<NewsType[]>([]);
  const [selectedNews, setSelectedNews] = useState<NewsType | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");

  // Ambil semua berita
  useEffect(() => {
    fetch("/api/news")
      .then((res) => res.json())
      .then((data) => setNewsList(data))
      .catch((err) => console.error(err));
  }, []);

  // Ambil komentar saat berita dipilih
  const fetchComments = (newsId: number) => {
    setLoading(true);
    fetch(`/api/news/${newsId}/comments`)
      .then((res) => res.json())
      .then((data) => setComments(data))
      .finally(() => setLoading(false));
  };

  const handleSelectNews = (news: NewsType) => {
    setSelectedNews(news);
    fetchComments(news.id);
  };

  const handleEdit = (comment: CommentType) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.comment);
  };

  const handleUpdate = async (commentId: number) => {
    try {
      const res = await fetch(`/api/news/${commentId}/comments`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: editContent }),
      });
      if (!res.ok) throw new Error("Gagal update komentar");
      setEditingCommentId(null);
      if (selectedNews) fetchComments(selectedNews.id);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (commentId: number) => {
    if (!confirm("Apakah anda yakin ingin menghapus komentar ini?")) return;
    try {
      const res = await fetch(`/api/news/${commentId}/comments`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal hapus komentar");
      if (selectedNews) fetchComments(selectedNews.id);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8 text-gray-700">
      <h1 className="text-3xl font-bold mb-6">Dashboard Komentar Berita</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* List Berita */}
        <div className="bg-white p-4 rounded-lg shadow h-fit">
          <h2 className="font-bold text-lg mb-4">Daftar Berita</h2>
          <ul className="space-y-2">
            {newsList.map((news) => (
              <li
                key={news.id}
                className={`cursor-pointer p-2 rounded hover:bg-gray-100 ${
                  selectedNews?.id === news.id
                    ? "bg-gray-200 font-semibold"
                    : ""
                }`}
                onClick={() => handleSelectNews(news)}
              >
                {news.title}
              </li>
            ))}
          </ul>
        </div>

        {/* Detail Komentar */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <h2 className="font-bold text-lg mb-4">
            Komentar {selectedNews ? `: ${selectedNews.title}` : ""}
          </h2>

          {loading ? (
            <p>Loading komentar...</p>
          ) : !selectedNews ? (
            <p>Pilih berita untuk melihat komentar</p>
          ) : comments.length === 0 ? (
            <p>Tidak ada Komentar</p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-4 border rounded flex flex-col gap-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{comment.name}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(comment)}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>

                  {editingCommentId === comment.id ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="border px-2 py-1 flex-1 rounded"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                      />
                      <button
                        onClick={() => handleUpdate(comment.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Simpan
                      </button>
                    </div>
                  ) : (
                    <p>{comment.comment}</p>
                  )}

                  {comment.status && (
                    <span className="text-sm text-gray-500">
                      Status: {comment.status}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
