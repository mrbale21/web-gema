"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
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
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [error, setError] = useState("");
  const [selectedNews, setSelectedNews] = useState<News | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("");
  const [editor, setEditor] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchNews = async () => {
    const res = await fetch("/api/news");
    const data = await res.json();
    setNews(data);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  // === ADD ===
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("tag", tag);
    formData.append("editor", editor);
    if (imageFile) formData.append("image", imageFile);

    try {
      const res = await fetch("/api/news", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setAddModal(false);
      resetForm();
      fetchNews();
      alert("Berita berhasil ditambahkan");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  // === UPDATE ===
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNews) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("tag", tag);
    formData.append("editor", editor);
    if (imageFile) formData.append("image", imageFile);

    try {
      const res = await fetch(`/api/news/${selectedNews.id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setEditModal(false);
      resetForm();
      fetchNews();
      alert("Berita berhasil diupdate");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  // === DELETE ===
  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus berita ini?")) return;

    try {
      const res = await fetch(`/api/news/${id}`, {
        method: "DELETE",
      });

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

  const resetForm = () => {
    setTitle("");
    setContent("");
    setEditor("");
    setTag("");
    setImageFile(null);
    setSelectedNews(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10 text-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Daftar Berita</h1>
        <button
          onClick={() => setAddModal(true)}
          className="bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90"
        >
          Tambah Berita
        </button>
      </div>

      {/* === LIST BERITA === */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {news.map((item, idx) => (
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
                <div className="flex items-center gap-4">
                  {/* Update */}
                  <button
                    onClick={() => {
                      setSelectedNews(item);
                      setTitle(item.title);
                      setContent(item.content);
                      setTag(item.tag);
                      setEditor(item.editor);
                      setEditModal(true);
                    }}
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
              <p className="text-sm text-black/50">{item.createdAt}</p>
              <p className="text-sm text-black/60">{item.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* === MODAL TAMBAH === */}
      {addModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <form
            onSubmit={handleSubmit}
            className="space-y-4 bg-white p-6 rounded-lg shadow-lg w-96"
          >
            <input
              type="text"
              placeholder="Judul"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border rounded-lg p-3"
            />
            <textarea
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="w-full border rounded-lg p-3"
            />
            <input
              type="text"
              placeholder="Tag"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="w-full border rounded-lg p-3"
            />
            <input
              type="text"
              placeholder="Editor"
              value={editor}
              onChange={(e) => setEditor(e.target.value)}
              required
              className="w-full border rounded-lg p-3"
            />
            <input type="file" accept="image/*" onChange={handleFileChange} />

            {error && <p className="text-red-500">{error}</p>}

            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90"
            >
              Tambah
            </button>
            <button
              type="button"
              onClick={() => setAddModal(false)}
              className="w-full mt-2 border border-gray-300 rounded-lg py-2 hover:bg-gray-100"
            >
              Batal
            </button>
          </form>
        </div>
      )}

      {/* === MODAL UPDATE === */}
      {editModal && selectedNews && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <form
            onSubmit={handleUpdate}
            className="space-y-4 bg-white p-6 rounded-lg shadow-lg w-96"
          >
            <input
              type="text"
              placeholder="Judul"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border rounded-lg p-3"
            />
            <textarea
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="w-full border rounded-lg p-3"
            />
            <input
              type="text"
              placeholder="Tag"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="w-full border rounded-lg p-3"
            />
            <input
              type="text"
              placeholder="Editor"
              value={editor}
              onChange={(e) => setEditor(e.target.value)}
              required
              className="w-full border rounded-lg p-3"
            />
            <input type="file" accept="image/*" onChange={handleFileChange} />

            {error && <p className="text-red-500">{error}</p>}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Update
            </button>
            <button
              type="button"
              onClick={() => setEditModal(false)}
              className="w-full mt-2 border border-gray-300 rounded-lg py-2 hover:bg-gray-100"
            >
              Batal
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
